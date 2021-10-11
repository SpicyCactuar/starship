const BASE_CAMERA_DELTA = 10
const VARIABLE_CAMERA_DELTA = 50
const SPAWN_HORIZONTAL_RANGE = 10
const SPAWN_VERTICAL_RANGE = 10

class StarParticle {

    constructor(camera, mvp, loadedMesh) {
        this.prog = createShaderProgram(starsVS, starsFS)
        
        this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp')
        this.cameraDepthLoc = gl.getUniformLocation(this.prog, 'camera_depth')
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')
		this.positionBuffer = gl.createBuffer()

        this.camera = camera

        this.setMeshData(loadedMesh)
        this.generateRandomParameters()
        this.onModelViewProjectionUpdated(mvp)
    }

    setMeshData(loadedMesh) {
        gl.useProgram(this.prog)

		let meshData = loadedMesh.getVertexBuffers()
        this.meshVertices = meshData.positionBuffer
        
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.meshVertices), gl.STATIC_DRAW)
    }

    generateRandomParameters() {
        let x = clamp(Math.random(), 0.1, 0.9) * 2 * SPAWN_HORIZONTAL_RANGE - SPAWN_HORIZONTAL_RANGE
        let y = clamp(Math.random(), 0.1, 0.9) * 2 * SPAWN_VERTICAL_RANGE - SPAWN_VERTICAL_RANGE
        let z = this.camera.center[2] - BASE_CAMERA_DELTA - Math.random() * VARIABLE_CAMERA_DELTA

        this.position = [x, y, z]
        this.scale = clamp(Math.random() * 0.05, 0.01, 0.05)
    }

	onModelViewProjectionUpdated(mvp) {
        this.mvp = mvp

        let transform = [
            this.scale,       0,                0,                0,
            0,                this.scale,       0,                0,
            0,                0,                this.scale,       0,
            this.position[0], this.position[1], this.position[2], 1
        ]

        let transformedMvp = matrixMultiply(this.mvp, transform)

		gl.useProgram(this.prog)
		gl.uniformMatrix4fv(this.mvpLoc, false, transformedMvp)
        gl.uniform1f(this.cameraDepthLoc, this.camera.center[2])
        // console.log(this.position[2], this.camera.center[2])
	}

	draw() {
		gl.useProgram(this.prog)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ZERO)
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
        gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.posLoc)
        
        gl.drawArrays(gl.TRIANGLES, 0, this.meshVertices.length / 3)

        gl.disable(gl.BLEND)
	}

    update() {
        if (this.shouldReposition()) {
            this.generateRandomParameters()
        }
    }

    shouldReposition() {
        return this.position[2] > this.camera.center[2] + 1.0
    }

    static create(camera, mvp, loadedMesh) {
        return new StarParticle(camera, mvp, loadedMesh)
    }

}

// Vertex Shader
var starsVS = `
    uniform mat4 mvp;

	attribute vec3 pos;

    varying float vert_depth;
	
	void main() {
		gl_Position = mvp * vec4(pos, 1.0);
        vert_depth = gl_Position[2];
	}
`;

// Fragment Shader
var starsFS = `
	precision mediump float;

    uniform float camera_depth;

    varying float vert_depth;

	void main() {
        float delta = abs(vert_depth - camera_depth);
        float alpha = clamp(delta, 0.0, 5.0) / 5.0;
		gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
	}
`;