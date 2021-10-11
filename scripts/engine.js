class Engine {

    constructor() {
        this.gameObjectList = []
        this.camera = new Camera()
    }

    onObjectCreated(gameObject) {
        this.gameObjectList.push(gameObject)
    }

    onObjectDestroyed(gameObject) {
        const gameObjectIndex = this.gameObjectList.indexOf(gameObject)
        if (gameObjectIndex > -1) {
            this.gameObjectList.splice(gameObjectIndex, 1)
        }
    }

    initializeScene() {
        let cameraMatrices = this.camera.getMVPMatrices()
        
        let starship = Starship.create(cameraMatrices)
        starship.setTranslation(0.0, 0.0, -5.0)

        let asteroid1 = Asteroid.create(cameraMatrices)
        asteroid1.setTranslation(0.0, 0.0, -22.0)
        asteroid1.setScale(0.15, 0.15, 0.15)

        let asteroid2 = Asteroid.create(cameraMatrices)
        asteroid2.setTranslation(0.0, 5.0, -32.0)
        asteroid2.setScale(0.15, 0.15, 0.15)

        this.stars = Stars.create(this.camera, cameraMatrices)
        this.stars.setAmount(90)
    }

    startGameLoop() {
        let engine = this
        setInterval(function() {
            engine.updateScene()
            engine.drawScene()
        }, 16);

        // TODO: Move logic to new Scene object
        setTimeout(function() {
            engine.propelStarship()
        }, 1500)
    }

    propelStarship() {
        let starship = this.gameObjectList
            .find(gameObject => gameObject.name == "starship")

        starship.attachCamera(this.camera)
        starship.propel()
    }

    updateScene() {
        let engine = this

        engine.gameObjectList.forEach(function(gameObject) {
            gameObject.update()
        })
    
        engine.gameObjectList.forEach(function(gameObject) {
            engine.gameObjectList.forEach(function(otherGameObject) {
                if (gameObject === otherGameObject) return
                
                if (gameObject.collider.isColliding(otherGameObject.collider)) {
                    gameObject.onCollided(otherGameObject)
                }
            })
        })

        this.stars.update()
    }
    
    drawScene() {
        // Clear WebGL buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        this.gameObjectList.forEach(function(gameObject) {
            gameObject.draw()
        })

        this.stars.draw()
    }

    notifyViewportUpdated() {
        let matrices = this.camera.getMVPMatrices()

        this.gameObjectList.forEach(function(gameObject) {
            // Do not re-order these calls
            gameObject.onModelViewProjectionUpdated(matrices.mvp, matrices.mv)
            // TODO: This is hacky, we should recalculate inside onModelViewProjectionUpdated
            gameObject.updateWorldTransform()
        })

        this.stars.onModelViewProjectionUpdated(matrices.mvp)
    }

}