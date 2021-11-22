class ColliderDrawer {

    constructor() {
        this.prog = createShaderProgram(colliderVS, colliderFS)

        this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp')
        this.colLoc = gl.getUniformLocation(this.prog, 'color')
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')	        
		this.positionBuffer = gl.createBuffer()

        this.mvp = null
        this.worldTransform = null
        
        this.setColor([1.0, 1.0, 0.0, 1.0])
    }

    setColor(color) {
        gl.useProgram(this.prog);
        gl.uniform4fv(this.colLoc, color);
    }

    setColliderData(collider) {
        let vertices = collider.getFacesBuffer()
        
        gl.useProgram(this.prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

	onModelViewProjectionUpdated(mvp) {
        if (!engine.debugMode) return;
        
		this.mvp = mvp

        this.updateShaderMvp()
	}

    updateWorldTransform(worldTransform) {	
        if (!engine.debugMode) return;

        this.worldTransform = worldTransform

        this.updateShaderMvp()
	}

    updateShaderMvp() {
        if (!engine.debugMode) return;

        if (this.mvp == null || this.worldTransform == null) return

        let newMVP = matrixMultiply(this.mvp, this.worldTransform)

		// Set mvp matrix value in shaders
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvpLoc, false, newMVP);
    }
	
	draw() {
        if (!engine.debugMode) return;

		gl.useProgram(this.prog);
        // Enables position attribute as a vec3
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.posLoc);

        for (var i = 0; i < 6; i++) {
            this.drawFace(i)
        }
	}

    drawFace(faceIndex) {
        // Draw lines
        gl.drawArrays(gl.LINE_LOOP, faceIndex * 4, 4);
    }

}

// Vertex Shader
var colliderVS = `
	attribute vec3 pos;
	
	uniform mat4 mvp;
	
	void main() {
		gl_Position = mvp * vec4(pos, 1.0);
	}
`;

// Fragment Shader
var colliderFS = `
	precision mediump float;

    uniform vec4 color;

	void main() {
		gl_FragColor = color;
	}
`;