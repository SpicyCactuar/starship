class Laser extends GameObject {

    constructor(stageDrawer) {
        super(stageDrawer, "laser")
        // TODO: Change/remove when using actual model
        this.scale = [0.1, 0.1, 1.0]
        this.collider = new Collider([0.0, 0.0, 0.0], 0.15, 0.15, 1.0)
        this.speed = STARSHIP_SPEED + 0.3
        this.life = 1.5
    }

    update() {
        super.update()
        this.setTranslation(this.translation[0], this.translation[1], this.translation[2] - this.speed)
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
            Laser.laserMesh.load("./models/asteroid.obj")
        }
    }

    static create(cameraMatrices) {
        let laserDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)

        this.loadMeshIfNecessary()
        
        laserDrawer.setMesh(Laser.laserMesh)

        let laserImage = new Image()
        laserImage.onload = function() {
            laserDrawer.setTexture(laserImage)
        }
        // TODO: Use laser.png
        laserImage.src = "./textures/asteroid.png"

        return new Laser(laserDrawer)
    }

}