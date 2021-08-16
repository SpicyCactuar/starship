class Starship {

    constructor() {
		// Initialize necessary rendering dependencies
		this.prog = createShaderProgram(starshipVS, starshipFS)
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp')
		
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')		
		this.positionBuffer = gl.createBuffer()

		this.colLoc = gl.getAttribLocation(this.prog, 'col')
		this.colorBuffer = gl.createBuffer()

		this.translation = [0.0, 0.0, 0.0]
		this.rotations = [0.0, 0.0, 0.0]
		this.scale = [1.0, 1.0, 1.0]

		this.updateWorldTransform()
        
		// Updates mesh
        this.updateMeshData()
		this.rotateIndefinitely()
    }

	updateWorldTransform() {
		let rotMatrix = calculateRotationMatrix(this.rotations[0], this.rotations[1], this.rotations[2])

		this.worldTransform = [
			rotMatrix[0] * this.scale[0], rotMatrix[1] * this.scale[0], rotMatrix[2] * this.scale[0], 0.0,
			rotMatrix[4] * this.scale[1], rotMatrix[5] * this.scale[1], rotMatrix[6] * this.scale[1], 0.0,
			rotMatrix[8] * this.scale[2], rotMatrix[9] * this.scale[2], rotMatrix[10] * this.scale[2], 0.0,
			this.translation[0], this.translation[1], this.translation[2], 1.0
		]
	}

	rotateIndefinitely() {
		var rotationY = 0
		var rotationX = 0
		var rotationZ = 0
		setInterval(function() {
			let starship = this.starship
			let rotations = starship.rotations
			starship.setRotation(rotationX, rotationY, rotationZ);
			rotationX = (rotationX + 0.5) % 360;
			rotationY = (rotationY + 0.5) % 360;
			rotationZ = (rotationZ + 0.1) % 360;
		}, 10)
	}

	updateMeshData() {
		// Vertices that define faces of a cube
        var meshVertices = [
			1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0,
			-1.0, 1.0,-1.0,
			
			1.0,-1.0, 1.0,
			-1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,

			-1.0, 1.0, 1.0, 
			-1.0,-1.0, 1.0,
            -1.0,-1.0,-1.0, 
			
			-1.0, 1.0,-1.0,
			-1.0,-1.0,-1.0,
			1.0, 1.0,-1.0, 
			
			1.0,-1.0,-1.0,
			-1.0,-1.0,-1.0,
			1.0,-1.0, 1.0,
			
			-1.0,-1.0,-1.0,
			1.0,-1.0,-1.0,
			1.0, 1.0,-1.0,
			
			-1.0, 1.0,-1.0,
			-1.0, 1.0, 1.0,
			-1.0,-1.0,-1.0,
			
			-1.0,-1.0,-1.0,
			-1.0,-1.0, 1.0,
			1.0,-1.0, 1.0,
			
			1.0,-1.0, 1.0,
			-1.0,-1.0, 1.0,
			-1.0, 1.0, 1.0,
			
			1.0, 1.0,-1.0,
			1.0,-1.0,-1.0,
			1.0, 1.0, 1.0,
			
			1.0,-1.0, 1.0,
			1.0, 1.0, 1.0,
			1.0,-1.0,-1.0,
			
			-1.0, 1.0,-1.0,
			1.0, 1.0,-1.0,
			1.0, 1.0, 1.0
        ];

		// Colors for the vertices of the cube
		var vertexColors = [
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,	

			1.0, 1.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0,

			0.0, 1.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,

			0.0, 0.0, 1.0, 1.0,
			0.0, 0.0, 1.0, 1.0,
			0.0, 0.0, 1.0, 1.0,

			1.0, 0.0, 1.0, 1.0,
			1.0, 0.0, 1.0, 1.0,
			1.0, 0.0, 1.0, 1.0,

			0.0, 0.0, 1.0, 1.0,
			0.0, 0.0, 1.0, 1.0,
			0.0, 0.0, 1.0, 1.0,

			0.0, 1.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
			
			1.0, 0.0, 1.0, 1.0,
			1.0, 0.0, 1.0, 1.0,
			1.0, 0.0, 1.0, 1.0,

			1.0, 1.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0,

			0.0, 1.0, 1.0, 1.0,
			0.0, 1.0, 1.0, 1.0,
			0.0, 1.0, 1.0, 1.0,
			
			0.0, 1.0, 1.0, 1.0,
			0.0, 1.0, 1.0, 1.0,
			0.0, 1.0, 1.0, 1.0,

			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0
		]
        
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshVertices), gl.STATIC_DRAW);		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
	}

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

	onModelViewProjectionUpdated(mvp) {
		// Update model-view-projection matrix
		mvp = matrixMultiply(mvp, this.worldTransform)
		
		// Set mvp matrix value in shaders
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvpLoc, false, mvp);
	}
	
	draw() {
		gl.useProgram(this.prog);

		// Enables position attribute as a vec3
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
	    gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
	    gl.enableVertexAttribArray(this.posLoc);

		// Enables vertex color attribute as a vec4
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.vertexAttribPointer(this.colLoc, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.colLoc);
	
		// Draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, 12 * 3);
	}

    update() {
        // TODO: Implement
    }

}

// Vertex Shader
var starshipVS = `
	attribute vec3 pos;
	attribute vec4 col;
	varying vec4 vcolor;

	uniform mat4 mvp;
	
	void main() { 
		gl_Position =  mvp * vec4(pos, 1.0);
		vcolor = col;
	}
`;

// Fragment Shader
var starshipFS = `
	precision mediump float;
	
	varying vec4 vcolor;

	void main() {
		gl_FragColor = vcolor;
	}
`;