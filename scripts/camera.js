class Camera {

    constructor() {
        this.center = [0.0, 0.0, 0.0]
        this.near = 1.0
        this.far = 50.0
        this.fov = deg2rad(60.0)
    }

    calculatePerspectiveMatrix() {
        let aspectRatio = window.innerWidth / window.innerHeight

        var f = 1.0 / Math.tan(this.fov / 2)
        var rangeInv = 1 / (this.near - this.far)
      
        return [
          f / aspectRatio, 0,                          0,   0,
          0,               f,                          0,   0,
          0,               0,    (this.near + this.far) * rangeInv,  -1,
          0,               0,  this.near * this.far * rangeInv * 2,   0
        ];
      }

    getMVPMatrices() {
        let amplitude = Math.abs(this.near - this.far) * Math.tan(this.fov / 2.0) // Use half of the angle for each side

        let r = amplitude
        let l = -amplitude
        let t = amplitude
        let b = -amplitude
        let n = this.near
        let f = this.far

        let Morth = [
            2 / (r - l), 0, 0, 0,
            0, 2 / (t - b), 0, 0,
            0, 0, 2 / (n - f), 0,
            -(r + l) / (r - l), -(t + b) / (t - b), -(n + f) / (n - f), 1
        ]

        let Mper = this.calculatePerspectiveMatrix()
        
        let Mcam = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -this.center[0], -this.center[1], -this.center[2], 1
        ]

        return {
            mv: matrixMultiply(Morth, Mcam),
            mvp: matrixMultiply(Mper, Mcam)
        }
    }


}