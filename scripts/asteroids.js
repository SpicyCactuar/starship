const STARSHIP_DEPTH_DELTA = 25
const STARSHIP_HORIZONTAL_DELTA = 1.5

class Asteroids {

    constructor(camera, starship) {
        this.camera = camera
        this.starship = starship
        this.spawnInterval = null
    }

    startSpawning() {
        let asteroids = this
        this.spawnInterval = setInterval(() => {
            if (!document.hasFocus()) return
            asteroids.spawnAsteroid()
        }, 1000);
    }

    spawnAsteroid() {
        let cameraMatrices = this.camera.getMVPMatrices()

        let x = this.starship.translation[0] + randomSign() * Math.random() * STARSHIP_HORIZONTAL_DELTA
        let y = this.starship.translation[1] + randomSign() * Math.random() * STARSHIP_HORIZONTAL_DELTA
        let z = this.starship.translation[2] - STARSHIP_DEPTH_DELTA
        let scale = clamp(Math.random() * 0.3, 0.2, 0.3)

        let asteroid = Asteroid.create(cameraMatrices)
        asteroid.setTranslation(x, y, z)
        asteroid.setScale(scale, scale, scale)
    }

    stopSpawning() {
        if (!this.spawnInterval) return

        clearInterval(this.spawnInterval)
    }

}