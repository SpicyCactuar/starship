const CARTESIAN_MOVEMENT_DELTA = 0.08
const STARSHIP_SPEED = 0.15
const CAMERA_DISTANCE = 5.0
const LASER_FORWARD_SPAWN_DELTA = 2.5
const MAX_CARTESIAN_ROTATION = 40.0
const ROLL_ROTATION_SPEED = 18.0
const SHOOT_COOLDOWN = 0.1

class Starship extends GameObject {

    constructor(starshipDrawer) {
        super(starshipDrawer, "starship")
		this.propelling = false
		this.attachedCamera = null
		
		this.collider = new Collider([0.0, 0.0, 0.0], 1.0, 0.5, 2.0)
        
        this.addMovementEventListeners()

		this.initialRotations = [0.0, 0.0, 0.0]

		this.shootCooldown = 0
		// (-1) is left, (+1) is right, 0 is no roll
		this.barrelRollDirection = 0
		this.lastSideKey = this.rightKey
    }

    addMovementEventListeners() {
		let starship = this
		document.addEventListener('keydown', function(event) {
			if (event.key == "ArrowLeft") {
				starship.leftKey = true
				starship.lastSideKey = event.key
			} else if (event.key == "ArrowRight") {
				starship.rightKey = true
				starship.lastSideKey = event.key
			} else if (event.key == "ArrowUp") {
				starship.upKey = true
			} else if (event.key == "ArrowDown") {
				starship.downKey = true
			} else if (event.key == " ") {
				starship.shoot()
			} else if (event.key == "z") {
				starship.barrelRoll()
			}
		})
		document.addEventListener('keyup', function(event) {
			if (event.key == "ArrowLeft") {
				starship.leftKey = false
			} else if (event.key == "ArrowRight") {
				starship.rightKey = false
			} else if (event.key == "ArrowUp") {
				starship.upKey = false
			} else if (event.key == "ArrowDown") {
				starship.downKey = false
			}  
		})
	}

    update() {
		let [speedX, speedY, speedZ] = this.calculatePerAxisSpeed()
		this.moveBy(speedX, speedY, speedZ)
		this.rotateSmoothlyBy(speedX, speedY)
		this.updateShootCooldown()
	}

	calculatePerAxisSpeed() {
		return [
			// Speed X
			CARTESIAN_MOVEMENT_DELTA * (this.rightKey ? 1.0 : (this.leftKey ? -1.0 : 0.0)),
			// Speed Y
			CARTESIAN_MOVEMENT_DELTA * (this.upKey ? 1.0 : (this.downKey ? -1.0 : 0.0)),
			// Speed Z
			this.propelling ? STARSHIP_SPEED : 0.0
		]
	}

	moveBy(speedX, speedY, speedZ) {
		let translationX = clamp(this.translation[0] + speedX, -LIMIT_X, LIMIT_X)
		let translationY = clamp(this.translation[1] + speedY, -LIMIT_Y + 1.5, LIMIT_Y)
		// Negative Z axis is forward
		let translationZ = this.translation[2] - speedZ

		this.setTranslation(translationX, translationY, translationZ)
		this.attachedCamera?.moveZ(translationZ + CAMERA_DISTANCE)
	}

	rotateSmoothlyBy(speedX, speedY) {
		var rotX, rotY, rotZ

		if (this.isBarrelRolling()) {
		 	[ rotX, rotY, rotZ ] = this.calculateRollRotations()
		} else {
			[ rotX, rotY, rotZ ] = this.calculateCartesianRotations(speedX, speedY)
		}

		this.setRotation(rotX, rotY, rotZ)
	}

	calculateRollRotations() {
		// Reset X and Y rotations
		// Process Roll rotation step
		let rotZ = this.rotations[2] + ROLL_ROTATION_SPEED * this.barrelRollDirection

		// Finished rolling, reset Z rotation
		if (Math.abs(rotZ) >= 360) {
			rotZ = 0
			this.barrelRollDirection = 0
		}

		return [ 0.0, 0.0, rotZ ]
	}

	calculateCartesianRotations(speedX, speedY) {
		let rotX = speedY != 0 ? 
			this.rotations[0] + speedY * MAX_CARTESIAN_ROTATION :
			epsilonSubstract(this.rotations[0], (this.rotations[0] - this.initialRotations[0]) * CARTESIAN_MOVEMENT_DELTA, 0.05)

		if (Math.abs(rotX - this.initialRotations[0]) > MAX_CARTESIAN_ROTATION) {
			rotX = this.initialRotations[0] + Math.sign(speedY) * MAX_CARTESIAN_ROTATION
		}

		let rotY = speedX != 0 ?
			this.rotations[1] - speedX * MAX_CARTESIAN_ROTATION :
			epsilonSubstract(this.rotations[1], (this.rotations[1] - this.initialRotations[1]) * CARTESIAN_MOVEMENT_DELTA, 0.05)

		if (Math.abs(rotY - this.initialRotations[1]) > MAX_CARTESIAN_ROTATION) {
			rotY = this.initialRotations[1] - Math.sign(speedX) * MAX_CARTESIAN_ROTATION
		}

		return [ rotX, rotY, this.rotations[2] ]
	}

	barrelRoll() {
		if (this.isBarrelRolling()) return

		this.barrelRollDirection = (this.lastSideKey == "ArrowLeft" ? 1.0 : -1.0)
	}

	isBarrelRolling() {
		return this.barrelRollDirection != 0
	}

	updateShootCooldown() {
		this.shootCooldown = Math.max(this.shootCooldown - 0.016, 0.0)
	}

	propel() {
		this.propelling = true
	}

	stop() {
		this.propelling = false
	}

	shoot() {
		if (this.shootCooldown > 0) return

		this.shootCooldown = SHOOT_COOLDOWN

		let rotX = epsilonSubstract(this.rotations[0], this.initialRotations[0], 0.01)
		let rotY = epsilonSubstract(this.rotations[1], this.initialRotations[1], 0.01)

		let laserDirection = [
			-Math.sin(deg2rad(rotY)),
			Math.sin(deg2rad(rotX)),
			-1
		]
		
		let laser = Laser.create(engine.camera.getMVPMatrices(), laserDirection)

		laser.setRotation(laser.rotations[0] + rotX, laser.rotations[1] + rotY, laser.rotations[2])
		laser.setTranslation(
			this.translation[0] + laserDirection[0] * LASER_FORWARD_SPAWN_DELTA,
			this.translation[1] + laserDirection[1] * LASER_FORWARD_SPAWN_DELTA + 0.35,
			this.translation[2] + laserDirection[2] * LASER_FORWARD_SPAWN_DELTA
		)
	}

	attachCamera(camera) {
		this.attachedCamera = camera
	}

	detachCamera() {
		this.attachedCamera = null
	}

	onCollided(otherGameObject) {
		super.onCollided(otherGameObject)

		if (otherGameObject.name == "asteroid") {
			this.destroy()
		}
	}

	static create(cameraMatrices) {
        let starshipDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)

        let mesh = new ObjectMesh()
        mesh.load("./models/pawship.obj")
        starshipDrawer.setMesh(mesh)

        let starshipImage = new Image()
        starshipImage.onload = function() {
            starshipDrawer.setTexture(starshipImage)
        }
        starshipImage.src = "./textures/pawship.jpg"

        return new Starship(starshipDrawer)
    }
}