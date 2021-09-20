class Collider {
    constructor(position, width, height, depth) {
        this.position = position

        this.halfWidth = width / 2.0
        this.halfHeight = height / 2.0
        this.halfDepth = depth / 2.0

        this.drawer = new ColliderDrawer()
        this.drawer.setColliderData(this)
    }

    draw() {
        this.drawer.draw()
    }

    onModelViewProjectionUpdated(mvp) {
        this.drawer.onModelViewProjectionUpdated(mvp)
    }

    updateWorldTransform(worldTransform) {
        let colliderTransform = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            this.position[0] + worldTransform[12], this.position[1] + worldTransform[13], this.position[2] + worldTransform[14], 1.0,
        ]
        
        //worldTransform = matrixMultiply(worldTransform, colliderTransform)
       
        this.drawer.updateWorldTransform(colliderTransform)
    }

    getFacesBuffer() {
        // y+ arriba
        // z+ mirando hacia adelante (z- es hacia la cámara)
        // x+ derecha desde la cámara

        let facesBuffer = [
            // top (xz)
            -this.halfWidth, this.halfHeight, this.halfDepth, // top left
            this.halfWidth, this.halfHeight, this.halfDepth, // top right
            this.halfWidth, this.halfHeight, -this.halfDepth, // bottom right
            -this.halfWidth, this.halfHeight, -this.halfDepth, // bottom left

            // front (xy)
            -this.halfWidth, this.halfHeight, this.halfDepth, // top left
            this.halfWidth, this.halfHeight, this.halfDepth, // top right
            this.halfWidth, -this.halfHeight, this.halfDepth, // bottom right
            -this.halfWidth, -this.halfHeight, this.halfDepth, // bottom left

            // right (yz)
            this.halfWidth, this.halfHeight, -this.halfDepth, // top left
            this.halfWidth, this.halfHeight, this.halfDepth, // top right
            this.halfWidth, -this.halfHeight, this.halfDepth, // bottom right
            this.halfWidth, -this.halfHeight, -this.halfDepth, // bottom left

            // back (xy)
            -this.halfWidth, this.halfHeight, -this.halfDepth, // top left
            this.halfWidth, this.halfHeight, -this.halfDepth, // top right
            this.halfWidth, -this.halfHeight, -this.halfDepth, // bottom right
            -this.halfWidth, -this.halfHeight, -this.halfDepth, // bottom left

            // left (yz)
            -this.halfWidth, this.halfHeight, -this.halfDepth, // top left
            -this.halfWidth, this.halfHeight, this.halfDepth, // top right
            -this.halfWidth, -this.halfHeight, this.halfDepth, // bottom right
            -this.halfWidth, -this.halfHeight, -this.halfDepth, // bottom left

            // bottom (xz)
            -this.halfWidth, -this.halfHeight, this.halfDepth, // top left
            this.halfWidth, -this.halfHeight, this.halfDepth, // top right
            this.halfWidth, -this.halfHeight, -this.halfDepth, // bottom right
            -this.halfWidth, -this.halfHeight, -this.halfDepth, // bottom left
        ]
        
        return facesBuffer
    }
}