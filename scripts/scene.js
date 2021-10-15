class Scene {

    constructor(camera, cameraMatrices) {
        this.camera = camera

        this.starship = Starship.create(cameraMatrices)
        this.starship.setTranslation(0.0, 0.0, -5.0)

        this.asteroid1 = Asteroid.create(cameraMatrices)
        this.asteroid1.setTranslation(0.0, 0.0, -22.0)
        this.asteroid1.setScale(0.15, 0.15, 0.15)

        this.asteroid2 = Asteroid.create(cameraMatrices)
        this.asteroid2.setTranslation(0.0, 5.0, -32.0)
        this.asteroid2.setScale(0.15, 0.15, 0.15)

        this.stars = Stars.create(this.camera, cameraMatrices)
        this.stars.setAmount(90)
    }

    start() {
        this.propelStarship()
    }

    propelStarship() {
        this.starship.attachCamera(this.camera)
        this.starship.propel()
    }

    static create(camera) {
        return new Scene(camera, camera.getMVPMatrices())
    }

}