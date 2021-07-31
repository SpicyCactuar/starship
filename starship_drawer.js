class StarshipDrawer {

    constructor() {
		// Initialize necessary rendering dependencies
		this.prog = createShaderProgram(starshipVS, starshipFS)
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp')
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')
		this.buffer = gl.createBuffer()
        
		// Updates mesh
        this.updateMeshData()
    }

	updateMeshData() {
        var positions = [
            0.0,  0.8, 0.0,
            0.8, -0.8, 0.0,
            -0.8, -0.8, 0.0
        ];
        
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	}

	onViewportUpdated(width, height) {
		// Update model-view-projection matrix
		// TODO: Implement correctly
		// var mvp = [ 2/width,0,0,0,  0,-2/height,0,0,  0,0,1,0,  -1,1,0,1 ];
        var mvp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

		// Set mvp matrix value in shaders
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvpLoc, false, mvp);
	}
	
	draw() {
		gl.useProgram(this.prog);

		// Enables position attribute as a vec3
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	    gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
	    gl.enableVertexAttribArray(this.posLoc);
	
		// Draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

    update() {
        // TODO: Implement
    }

}

// Vertex Shader
var starshipVS = `
	attribute vec3 pos;

	uniform mat4 mvp;
	
	void main() { 
		gl_Position =  mvp * vec4(pos, 1.0);
	}
`;

// Fragment Shader
var starshipFS = `
	precision mediump float;

	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;