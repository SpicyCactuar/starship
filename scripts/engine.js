class Engine {

    constructor() {
        this.drawables = []
        this.collidables = []
        this.camera = new Camera()

        this.score = 0;

        this.debugMode = false;
        this.scoreElement = document.querySelector("#score");
        this.scoreNode = document.createTextNode("Score: ");
        this.scoreElement.append(this.scoreNode)
        this.scoreNode.nodeValue = this.score
    }

    addScore(points){
        this.score += points
        this.scoreNode.nodeValue = this.score
    }

    initializeScene() {
        this.scene = Scene.create(this.camera)
    }

    onObjectCreated(gameObject) {
        if (gameObject.collider) {
            this.collidables.push(gameObject)
        }
        this.drawables.push(gameObject)
    }

    onObjectDestroyed(gameObject) {
        if (gameObject.collider) {
            this.removeElement(gameObject, this.collidables)
        }
        this.removeElement(gameObject, this.drawables)
        
        if (gameObject.name == "starship") {
            this.stop()
        }
    }

    removeElement(element, list) {
        const elementIndex = list.indexOf(element)
        if (elementIndex > -1) {
            list.splice(elementIndex, 1)
        }
    }

    run() {
        let engine = this
        setInterval(function() {
            engine.updateScene()
            engine.drawScene()
        }, 16);

        setTimeout(function() {
            engine.scene.start()
        }, 1600)
    }

    stop() {
        this.scene.stop()
    }

    updateScene() {
        let engine = this

        engine.drawables.forEach(function(drawable) {
            drawable.update()
        })
    
        engine.collidables.forEach(function(collidable) {
            if (collidable.collider === null) return;
            engine.collidables.forEach(function(otherCollidable) {
                if (otherCollidable.collider == null) return;
                if (collidable === otherCollidable) return
                
                if (collidable.collider.isColliding(otherCollidable.collider)) {
                    collidable.onCollided(otherCollidable)
                }
            })
        })
    }
    
    drawScene() {
        // Clear WebGL buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        this.drawables.forEach(function(drawable) {
            drawable.draw()
        })
    }

    notifyViewportUpdated() {
        let matrices = this.camera.getMVPMatrices()

        this.drawables.forEach(function(drawable) {
            drawable.onModelViewProjectionUpdated(matrices.mvp, matrices.mv)
        })
    }

}