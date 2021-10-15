const ROTATION_DEGREES_DELTA = 0.5
const BOUNDS_DESTRUCTION_DELTA = 1.0

class Asteroid extends GameObject {

    constructor(asteroidDrawer) {
        super(asteroidDrawer, "asteroid")
        this.collider = new Collider([0.0, 0.0, 0.0], 0.75, 0.75, 0.75)
    }

    update() {
        let rotationY = (this.rotations[1] + ROTATION_DEGREES_DELTA) % 360
		let rotationZ = (this.rotations[2] + ROTATION_DEGREES_DELTA) % 360
		
		this.setRotation(this.rotations[0], rotationY, rotationZ)
        this.destroyIfOutOfBounds()
	}

    destroyIfOutOfBounds() {
        let cameraZ = engine.camera.center[2]
        
        // Add delta to avoid destroying in front of players faces
        if (cameraZ < this.translation[2] + BOUNDS_DESTRUCTION_DELTA) {
            this.destroy()
        }
    }

    onCollided(otherGameObject) {
        super.onCollided(otherGameObject)

        if (otherGameObject.name == "laser") {
            this.destroy()
        }
    }

    static asteroidMesh = null

    static loadMeshIfNecessary() {
        if (!Asteroid.asteroidMesh) {
            Asteroid.asteroidMesh = new ObjectMesh()
            Asteroid.asteroidMesh.load("./models/asteroid.obj")
        }
    }

	static create(cameraMatrices) {
        let asteroidDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)

        this.loadMeshIfNecessary()

        asteroidDrawer.setMesh(Asteroid.asteroidMesh)
        let asteroidTexture = new Image()
        asteroidTexture.onload = function() {
            asteroidDrawer.setTexture(asteroidTexture)
        }
        asteroidTexture.src = "./textures/asteroid.png"

        return new Asteroid(asteroidDrawer)
    }
}