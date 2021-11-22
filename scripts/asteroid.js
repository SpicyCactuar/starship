const ROTATION_DEGREES_DELTA = 0.5
const BOUNDS_DESTRUCTION_DELTA = 1.0

class Asteroid extends GameObject {

    constructor(asteroidDrawer) {
        super(asteroidDrawer, "asteroid")
        this.collider = new Collider([0.0, 0.0, 0.0], 0.4, 0.4, 0.4)
        this.dead = false

        this.emitter = new ExplosionEmitter([0.0, 0.0, 0.0])
    }

    update() {
        let rotationY = (this.rotations[1] + ROTATION_DEGREES_DELTA) % 360
		let rotationZ = (this.rotations[2] + ROTATION_DEGREES_DELTA) % 360
		
		this.setRotation(this.rotations[0], rotationY, rotationZ)
        this.destroyIfOutOfBounds()

        this.emitter.update()
	}
    draw(){
		super.draw()
		if (this.emitter){
			this.emitter.draw()
		}
    }

    updateWorldTransform(){
		let worldTransform = super.updateWorldTransform()
		if (this.emitter){
			this.emitter.updateWorldTransform(worldTransform)
		}
    }

    destroyIfOutOfBounds() {
        let cameraZ = engine.camera.center[2]
        
        // Add delta to avoid destroying in front of players faces
        if (cameraZ < this.translation[2] + BOUNDS_DESTRUCTION_DELTA) {
            this.destroy()
        }
    }

    onCollided(otherGameObject) {
        if (this.dead) return

        super.onCollided(otherGameObject)

        if (otherGameObject.name == "laser") {
            this.dead = true
            
            this.emitter.emit()

            engine.addScore(100)

            this.collider = null
            this.drawer = null
            //this.destroy()
            otherGameObject.destroy()
        }
    }

    setScale(scaleX, scaleY, scaleZ){
        super.setScale(scaleX, scaleY, scaleZ)

        this.collider.setSize(scaleX * 3.0, scaleY * 3.0, scaleZ * 3.0)
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