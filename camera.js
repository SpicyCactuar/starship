class Camera {

    constructor() {
        this.center = [0.0, 0.0, -4.0]
        this.near = 1.0
        this.far = -1.0
        this.fov = 60
        //this.right = 1
        //this.left = -1
        //this.top = 1
        //this.bottom = -1
    }

    getProjectionMatrix() {

        let apertura = Math.abs(this.near - this.far) * Math.tan(deg2rad(this.fov / 2.0)) // Importante: se usa mitad del ángulo!

        let r = apertura
        let l = -apertura
        let t = apertura
        let b = -apertura
        let n = this.near
        let f = this.far

        let orthographicMatrix = [
            2 / (r - l), 0, 0, 0,
            0, 2 / (t - b), 0, 0,
            0, 0, 2 / (n - f), 0,
            -(r + l) / (r - l), -(t + b) / (t - b), -(n + f) / (n - f), 1
        ]

        let perspectiveMatrix = [
            n, 0, 0, 0,
            0, n, 0, 0,
            0, 0, n + f, 1,
            0, 0, - f * n, 0
        ]

        let cameraSpaceMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -this.center[0], -this.center[1], -this.center[2], 1,
        ]
        
        return matrixMultiply(perspectiveMatrix, matrixMultiply(orthographicMatrix, cameraSpaceMatrix))
    }


}