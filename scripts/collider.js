class Collider {
    constructor(relativePosition, width, height, depth) {
        this.relativePosition = relativePosition

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
        this.worldPosition = [
            this.relativePosition[0] + worldTransform[12], 
            this.relativePosition[1] + worldTransform[13],
            this.relativePosition[2] + worldTransform[14]
        ]

        let colliderTransform = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            this.worldPosition[0], this.worldPosition[1], this.worldPosition[2], 1.0,
        ]
       
        this.drawer.updateWorldTransform(colliderTransform)
    }

    isColliding(otherCollider) {
        let thisMinX = this.worldPosition[0] - this.halfWidth
        let thisMaxX = this.worldPosition[0] + this.halfWidth

        let thisMinY = this.worldPosition[1] - this.halfHeight
        let thisMaxY = this.worldPosition[1] + this.halfHeight

        let thisMinZ = this.worldPosition[2] - this.halfDepth
        let thisMaxZ = this.worldPosition[2] + this.halfDepth

        let otherMinX = otherCollider.worldPosition[0] - otherCollider.halfWidth
        let otherMaxX = otherCollider.worldPosition[0] + otherCollider.halfWidth

        let otherMinY = otherCollider.worldPosition[1] - otherCollider.halfHeight
        let otherMaxY = otherCollider.worldPosition[1] + otherCollider.halfHeight

        let otherMinZ = otherCollider.worldPosition[2] - otherCollider.halfDepth
        let otherMaxZ = otherCollider.worldPosition[2] + otherCollider.halfDepth

        return (thisMinX <= otherMaxX && thisMaxX >= otherMinX) &&
            (thisMinY <= otherMaxY && thisMaxY >= otherMinY) &&
            (thisMinZ <= otherMaxZ && thisMaxZ >= otherMinZ)
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