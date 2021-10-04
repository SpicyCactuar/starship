const ROTATION_DEGREES_DELTA = 0.5

class Asteroid extends GameObject {

    constructor(asteroidDrawer) {
        super(asteroidDrawer, "asteroid")
        this.collider = new Collider([0.0, 0.0, 0.0], 0.75, 0.75, 0.75)
    }

    update() {
        let rotationY = (this.rotations[1] + ROTATION_DEGREES_DELTA) % 360
		let rotationZ = (this.rotations[2] + ROTATION_DEGREES_DELTA) % 360
		
		this.setRotation(this.rotations[0], rotationY, rotationZ)
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