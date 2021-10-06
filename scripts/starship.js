const CARTESIAN_MOVEMENT_DELTA = 0.08
const STARSHIP_SPEED = 0.15
const CAMERA_DISTANCE = 5.0
const LASER_FORWARD_SPAWN_DELTA = 2.5
const MAX_ROT = 40.0

const LIMIT_X = 4.5
const LIMIT_Y = 3.0

class Starship extends GameObject {

    constructor(starshipDrawer) {
        super(starshipDrawer, "starship")
		this.propelling = false
		this.attachedCamera = null
		
		this.collider = new Collider([0.0, 0.35, 0.0], 1.0, 0.5, 2.0)
        
        this.addMovementEventListeners()

		this.starting_rotations = [0.0, 180.0, 0.0]
		this.setRotation(this.starting_rotations[0], this.starting_rotations[1], this.starting_rotations[2])
    }

    addMovementEventListeners() {
		let starship = this
		document.addEventListener('keydown', function(event) {
			if (event.key == "ArrowLeft") {
				starship.leftKey = true
			} else if (event.key == "ArrowRight") {
				starship.rightKey = true
			} else if (event.key == "ArrowUp") {
				starship.upKey = true
			} else if (event.key == "ArrowDown") {
				starship.downKey = true
			} else if (event.key == " ") {
				starship.shoot()
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
		var translationX = this.translation[0]
		var translationY = this.translation[1]
		var translationZ = this.translation[2]

		let spdX = CARTESIAN_MOVEMENT_DELTA * (this.rightKey ? 1.0 : (this.leftKey ? -1.0 : 0.0))
		let spdY = CARTESIAN_MOVEMENT_DELTA * (this.upKey ? 1.0 : (this.downKey ? -1.0 : 0.0))

		translationX += spdX
		translationY += spdY

		translationX = Math.min(Math.max(translationX, -LIMIT_X), LIMIT_X)
		translationY = Math.min(Math.max(translationY, -LIMIT_Y+1.5), LIMIT_Y)

		// Negative Z axis is farther
		translationZ -= (this.propelling ? STARSHIP_SPEED : 0.0)

		this.rotateSmoothlyBy(spdX, spdY)
		
		this.setTranslation(translationX, translationY, translationZ)
		this.attachedCamera?.moveZ(translationZ + CAMERA_DISTANCE)

		this.shoot_cooldown = Math.max(this.shoot_cooldown - 0.016, 0.0)
	}

	shoot() {
		if (this.shoot_cooldown > 0) return;

		this.shoot_cooldown = 0.1
		let laser = Laser.create(engine.camera.getMVPMatrices())

		let rotX = this.rotations[0] - this.starting_rotations[0]
		let rotY = this.rotations[1] - this.starting_rotations[1]
		//let rotZ = this.rotations[2]
		console.log(rotX, rotY)

		laser.setRotation(laser.rotations[0] - rotX, laser.rotations[1] + rotY, laser.rotations[2])
		laser.setTranslation(
			this.translation[0] + -Math.sin(deg2rad(rotY)) * LASER_FORWARD_SPAWN_DELTA, 
			this.translation[1] - Math.sin(deg2rad(rotX)) * LASER_FORWARD_SPAWN_DELTA + 0.35, 
			this.translation[2] - LASER_FORWARD_SPAWN_DELTA)
		laser.direction = [
			-Math.sin(deg2rad(rotY)),
			-Math.sin(deg2rad(rotX)),
			-1
		]
		
	}

	propel() {
		this.propelling = true
	}

	stop() {
		this.propelling = false
	}

	rotateSmoothlyBy(speedX, speedY){
		let rotX = this.rotations[0]
		let rotY = this.rotations[1]
		let rotZ = this.rotations[2]

		rotX -= speedY * MAX_ROT
		if (Math.abs(rotX - this.starting_rotations[0]) > MAX_ROT){
			rotX = this.starting_rotations[0] - Math.sign(speedY) * MAX_ROT
		}
		rotY -= speedX * MAX_ROT
		if (Math.abs(rotY - this.starting_rotations[1]) > MAX_ROT){
			rotY = this.starting_rotations[1] - Math.sign(speedX) * MAX_ROT
		}		

		rotX -= (rotX - this.starting_rotations[0]) * CARTESIAN_MOVEMENT_DELTA;
		rotY -= (rotY - this.starting_rotations[1]) * CARTESIAN_MOVEMENT_DELTA;

		this.setRotation(rotX, rotY, rotZ)
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
        mesh.load("./models/starship.obj")
        starshipDrawer.setMesh(mesh)

        let starshipImage = new Image()
        starshipImage.onload = function() {
            starshipDrawer.setTexture(starshipImage)
        }
        starshipImage.src = "./textures/duck.png"

        return new Starship(starshipDrawer)
    }
}