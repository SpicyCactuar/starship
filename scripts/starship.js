const CARTESIAN_MOVEMENT_DELTA = 0.05
const SPEED = 0.15
const CAMERA_DISTANCE = 5.0

class Starship extends GameObject {

    constructor(starshipDrawer) {
        super(starshipDrawer, "starship")
		this.propelling = false
		this.attachedCamera = null
        
        this.addMovementEventListeners()
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

		translationX += (this.rightKey ? CARTESIAN_MOVEMENT_DELTA : 0.0)
		translationX -= (this.leftKey ? CARTESIAN_MOVEMENT_DELTA : 0.0)

		translationY += (this.upKey ? CARTESIAN_MOVEMENT_DELTA : 0.0)
		translationY -= (this.downKey ? CARTESIAN_MOVEMENT_DELTA : 0.0)

		// Negative Z axis is farther
		translationZ -= (this.propelling ? SPEED : 0.0)
		
		this.setTranslation(translationX, translationY, translationZ)
		this.attachedCamera?.moveZ(translationZ + CAMERA_DISTANCE)
	}

	propel() {
		this.propelling = true
	}

	stop() {
		this.propelling = false
	}

	attachCamera(camera) {
		this.attachedCamera = camera
	}

	detachCamera() {
		this.attachedCamera = null
	}

	onCollided(otherGameObject) {
		super.onCollided(otherGameObject)

		this.destroy()
	}

	static create(cameraMatrices) {
        let starshipDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)

        let mesh = new ObjectMesh()
        mesh.load("./models/duck.obj")
        starshipDrawer.setMesh(mesh)

        let starshipImage = new Image()
        starshipImage.onload = function() {
            starshipDrawer.setTexture(starshipImage)
        }
        starshipImage.src = "./textures/duck.png"

        return new Starship(starshipDrawer)
    }
}