const LIMIT_X = 4.5
const LIMIT_Y = 3.0

class Camera {

    constructor() {
        this.center = [0.0, 1.0, 0.0]
        this.rotation = [0.0, 0.0, 0.0]
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

    setRotation(degX, degY, degZ) {
		this.rotation = [degX, degY, degZ]
	}

    moveZ(z) {
        this.center = [this.center[0], this.center[1], z]
        engine.notifyViewportUpdated()
    }

    getMVPMatrices() {
        // TODO: Optimize by calculating only after conditions have changed, return cached instance otherwise
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

        let camRotMatrix = calculateRotationMatrix(this.rotation[0], this.rotation[1], this.rotation[2])
        
        let Mcam = [
            camRotMatrix[0], camRotMatrix[1], camRotMatrix[2], 0,
            camRotMatrix[4], camRotMatrix[5], camRotMatrix[6], 0,
            camRotMatrix[8], camRotMatrix[9], camRotMatrix[10], 0,
            -this.center[0], -this.center[1], -this.center[2], 1
        ]

        return {
            mv: matrixMultiply(Morth, Mcam),
            mvp: matrixMultiply(Mper, Mcam)
        }
    }

}