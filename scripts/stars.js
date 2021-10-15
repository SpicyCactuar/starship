class Stars {

    constructor(camera, mvp) {
        this.particles = []
        this.camera = camera
        this.mvp = mvp

        engine.onObjectCreated(this)
    }

    setAmount(amount) {
        this.particles = []

        for (var i = 0; i < amount; i++) {
            this.particles.push(StarParticle.create(this.camera, this.mvp, Stars.starMesh))
        }
    }

    draw() {
        this.particles.forEach(function(particle) {
            particle.draw()
        })
    }

    onModelViewProjectionUpdated(mvp) {
        this.mvp = mvp

        this.particles.forEach(function(particle) {
            particle.onModelViewProjectionUpdated(mvp)
        })
    }

    update() {
        this.particles.forEach(function(particle) {
            particle.update()
        })
    }

    static starMesh = null

    static loadMeshIfNecessary() {
        if (!Stars.starMesh) {
            Stars.starMesh = new ObjectMesh()
            Stars.starMesh.load("./models/sphere.obj")
        }
    }

    static create(camera, cameraMatrices) {
        this.loadMeshIfNecessary()

        return new Stars(camera, cameraMatrices.mvp)
    }

}