class Starship {

    constructor() {
		// Initialize necessary rendering dependencies
		this.prog = createShaderProgram(starshipVS, starshipFS)
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp')
		
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')		
		this.positionBuffer = gl.createBuffer()

		this.texLoc = gl.getAttribLocation( this.prog, 'tex' );
		this.texCoordsBuffer = gl.createBuffer();

		this.samplerLoc = gl.getUniformLocation( this.prog, 'texGPU' );

		this.texture = gl.createTexture();

		this.translation = [0.0, 0.0, 0.0]
		this.rotations = [0.0, 0.0, 0.0]
		this.scale = [1.0, 1.0, 1.0]

		this.mesh = new ObjMesh()

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

	loadObj() {
		this.mesh.load("./models/duck.obj")
		this.loadTexture()
	}

	updateMeshData() {
		this.loadObj()

		// Process mesh data and populate buffers
		let meshData = this.mesh.getVertexBuffers()
        this.meshVertices = meshData.positionBuffer
		this.meshTexCoords = meshData.texCoordBuffer
		this.meshNormals = meshData.normalBuffer
        
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.meshVertices), gl.STATIC_DRAW);
		
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCoordsBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.meshTexCoords), gl.STATIC_DRAW );
	}

	loadTexture() {
		let starship = this
		this.img = new Image()
		this.img.onload = () => {
			gl.useProgram( starship.prog )

			gl.bindTexture( gl.TEXTURE_2D, this.texture )
			gl.texImage2D(
				gl.TEXTURE_2D, // Texture 2D
				0, // Mipmap level 0
				gl.RGB, // GPU format
				gl.RGB, // input format
				gl.UNSIGNED_BYTE, // type
				starship.img // array or <img>
			);
			gl.generateMipmap( gl.TEXTURE_2D )

			// Pass the texture to uniform
			gl.activeTexture( gl.TEXTURE0 )
			gl.uniform1i( starship.samplerLoc, 0 )  // Unit 0
		}
		this.img.src = "./textures/duck.png"
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

		// Enables texture coordinates as a vec2
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texCoordsBuffer );
		gl.vertexAttribPointer( this.texLoc, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.texLoc );
	
		// Draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.meshVertices.length / 3);
	}

    update() {
        // TODO: Implement
    }

}

// Vertex Shader
var starshipVS = `
	attribute vec3 pos;
	attribute vec2 tex;

	varying vec2 texCoord;

	uniform mat4 mvp;
	
	void main() { 
		gl_Position = mvp * vec4(pos, 1.0);
		texCoord = tex;
	}
`;

// Fragment Shader
var starshipFS = `
	precision mediump float;	
	
	varying vec2 texCoord;

	uniform sampler2D texGPU;

	void main() {
		vec4 textureColor = texture2D(texGPU, texCoord);
		gl_FragColor = textureColor;
		//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;