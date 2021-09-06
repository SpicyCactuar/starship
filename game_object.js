class GameObject {

    constructor(objectDrawer) {
        this.translation = [0.0, 0.0, 0.0]
		this.rotations = [0.0, 0.0, 0.0]
		this.scale = [1.0, 1.0, 1.0]

        this.drawer = objectDrawer

        this.updateWorldTransform()
    }

    updateWorldTransform() {
		let rotMatrix = calculateRotationMatrix(this.rotations[0], this.rotations[1], this.rotations[2])

		let worldTransform = [
			rotMatrix[0] * this.scale[0], rotMatrix[1] * this.scale[0], rotMatrix[2] * this.scale[0], 0.0,
			rotMatrix[4] * this.scale[1], rotMatrix[5] * this.scale[1], rotMatrix[6] * this.scale[1], 0.0,
			rotMatrix[8] * this.scale[2], rotMatrix[9] * this.scale[2], rotMatrix[10] * this.scale[2], 0.0,
			this.translation[0], this.translation[1], this.translation[2], 1.0
		]

        this.drawer.updateWorldTransform(worldTransform)
	}

    draw() {
        this.drawer.draw()
    }

    update() {}

    setRotation(degX, degY, degZ) {
		this.rotations = [degX, degY, degZ]
		this.updateWorldTransform()
	}

	setTranslation(x, y, z) { 
		this.translation = [x, y, z]
		this.updateWorldTransform()
	}

	setScale(scaleX, scaleY, scaleZ) {
		this.scale = [scaleX, scaleY, scaleZ]
		this.updateWorldTransform()
	}

}