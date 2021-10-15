class Scene {

    constructor(camera, cameraMatrices) {
        this.camera = camera

        this.starship = Starship.create(cameraMatrices)
        this.starship.setTranslation(0.0, 0.0, -5.0)

        this.stars = Stars.create(this.camera, cameraMatrices)
        this.stars.setAmount(90)

        this.asteroids = new Asteroids(this.camera, this.starship)
    }

    start() {
        let scene = this
        scene.propelStarship()
        setTimeout(() => scene.asteroids.startSpawning(), 2000)
    }

    propelStarship() {
        this.starship.attachCamera(this.camera)
        this.starship.propel()
    }

    stop() {
        this.asteroids.stopSpawning()
    }

    static create(camera) {
        return new Scene(camera, camera.getMVPMatrices())
    }

}