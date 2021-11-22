const LASER_SPEED = STARSHIP_SPEED + 0.5
const LASER_TTL = 1.5

class Laser extends GameObject {

    constructor(stageDrawer, direction) {
        super(stageDrawer, "laser")
        // TODO: Change/remove when using actual model
        this.scale = [0.1, 0.1, 3.5]
        this.collider = new Collider([0.0, 0.0, 0.0], 0.5, 0.5, 0.5)
        this.speed = LASER_SPEED
        this.direction = direction
        this.ttl = LASER_TTL
    }

    update() {
        this.advanceInDirection()
        this.decreaseTtl()
    }

    advanceInDirection() {
        this.setTranslation(
            this.translation[0] + this.direction[0] * this.speed,
            this.translation[1] + this.direction[1] * this.speed,
            this.translation[2] + this.direction[2] * this.speed
        )
    }

    decreaseTtl() {
        this.ttl -= 0.016

        if (this.ttl <= 0) {
            this.destroy()
        }
    }

    static laserMesh = null

    static loadMeshIfNecessary() {
        if (!Laser.laserMesh) {
            Laser.laserMesh = new ObjectMesh()
            // TODO: Use laser.obj
            Laser.laserMesh.load("./models/laser.obj")
        }
    }

    static create(cameraMatrices, direction) {
        let laserDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)
        laserDrawer.toggleLighting(false)

        this.loadMeshIfNecessary()
        
        laserDrawer.setMesh(Laser.laserMesh)

        let laserImage = new Image()
        laserImage.onload = function() {
            laserDrawer.setTexture(laserImage)
        }
        // TODO: Use laser.png
        laserImage.src = "./textures/laser.png"

        return new Laser(laserDrawer, direction)
    }

}