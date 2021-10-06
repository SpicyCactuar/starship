class Laser extends GameObject {

    constructor(stageDrawer) {
        super(stageDrawer, "laser")
        // TODO: Change/remove when using actual model
        this.scale = [0.2, 0.2, 3.0]
        this.collider = new Collider([0.0, 0.0, 0.0], 0.3, 0.3, 0.3)
        this.speed = STARSHIP_SPEED + 0.3        
        this.direction = [0.0, 0.0, -1.0]
        this.life = 1.5
    }

    update() {
        super.update()
        this.setTranslation(this.translation[0] + this.direction[0] * this.speed, this.translation[1] + this.direction[1] * this.speed, this.translation[2] + this.direction[2] * this.speed)
        this.life -= 0.016

        if (this.life <= 0) {
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

    static create(cameraMatrices) {
        let laserDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)
        laserDrawer.toggleLighting(false)

        this.loadMeshIfNecessary()
        
        laserDrawer.setMesh(Laser.laserMesh)

        let laserImage = new Image()
        laserImage.onload = function() {
            laserDrawer.setTexture(laserImage)
        }
        // TODO: Use laser.png
        laserImage.src = "./textures/laser_texture0.png"

        return new Laser(laserDrawer)
    }

}