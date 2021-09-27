class Engine {

    constructor() {
        this.gameObjectList = []
        this.drawerList = []
    }

    onObjectCreated(gameObject) {
        this.gameObjectList.push(gameObject)
    }

    onObjectDestroyed(gameObject) {
        const index = this.gameObjectList.indexOf(gameObject)
        if (index > -1) {
            this.gameObjectList.splice(index, 1)
        }
    }

    // Initializes scene objects
    initializeScene() {
        let cameraMatrices = camera.getMVPMatrices()	

        let stage = this.createStage(cameraMatrices)
        let starship = this.createStarship(cameraMatrices)
            
        stage.setScale(1.0, 1.0, 1.0)
        stage.setRotation(45.0, 0.0, 0.0)
        stage.setTranslation(0.0, 0.0, -10.0)
        
        starship.setTranslation(0.0, 0.0, -3.0)
        starship.setRotation(0.0, 180.0, 0.0)
    }

    createStage(cameraMatrices) {
        let stageDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)
        this.drawerList.push(stageDrawer)

        let mesh = new ObjectMesh()
        mesh.load("./models/final_destination.obj")
        stageDrawer.setMesh(mesh)

        let stageImage = new Image()
        stageImage.onload = function() {
            stageDrawer.setTexture(stageImage)
        }
        stageImage.src = "./textures/rock.png"

        return new Stage(stageDrawer)
    }

    createStarship(cameraMatrices) {
        let starshipDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)
        this.drawerList.push(starshipDrawer)

        let mesh = new ObjectMesh()
        mesh.load("./models/duck.obj")
        starshipDrawer.setMesh(mesh)

        let starshipImage = new Image()
        starshipImage.onload = function() {
            starshipDrawer.setTexture(starshipImage)
        }
        starshipImage.src = "./textures/duck.png"

        return new Starship(starshipDrawer)
    }

    startGameLoop() {
        let engine = this
        setInterval(function() {
            engine.updateScene()
            engine.drawScene()
        }, 16);
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
    }
    
    drawScene() {
        // Clear WebGL buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        this.gameObjectList.forEach(function(gameObject) {
            gameObject.draw()
        })
    }

    notifyViewportUpdated(camera) {
        let matrices = camera.getMVPMatrices()

        this.drawerList.forEach(function(drawer) {
            drawer.onModelViewProjectionUpdated(matrices.mvp, matrices.mv)
        })

        this.gameObjectList.forEach(function(gameObject) {
            // Do not re-order these calls
            gameObject.collider.onModelViewProjectionUpdated(matrices.mvp)
            gameObject.updateWorldTransform()
        })
    }

}