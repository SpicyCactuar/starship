class ParticleSystemDrawer{
    /*
    The main idea of the ParticleSystemDrawer is that it's meant to draw ALL the particles at once, which can be done through webgl *instancing*.
    Each particle is represented as a quad + a texture (which is set in the constructor). To draw them, we loop a particle list and set attributes for each particle.
    */
    constructor() {
        this.prog = createShaderProgram(particleSystemVS, particleSystemFS)

        this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp')
        this.rotLoc = gl.getUniformLocation(this.prog, 'rotation')
        this.colLoc = gl.getUniformLocation(this.prog, 'color')
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')
		this.positionBuffer = gl.createBuffer()

        this.texLoc = gl.getAttribLocation(this.prog, 'tex')
		this.texCoordsBuffer = gl.createBuffer()
		this.samplerLoc = gl.getUniformLocation(this.prog, 'texGPU')
		this.texture = gl.createTexture()

        this.mvp = null
        
        //this.particleTexture = loadTexture(particleTextureName)
        
        this.setColor([1.0, 0.0, 0.0, 1.0])
    }

    setColor(color) {
        gl.useProgram(this.prog);
        //let alpha = color[3]
        //color[3] = 1.0
        gl.uniform4fv(this.colLoc, color);
    }

    setTexture(loadedImage) {
        gl.useProgram(this.prog)

        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(
            gl.TEXTURE_2D, // Texture 2D
            0, // Mipmap level 0
            gl.RGBA, // GPU format
            gl.RGBA, // input format
            gl.UNSIGNED_BYTE, // type
            loadedImage // array or <img>
        );
        gl.generateMipmap(gl.TEXTURE_2D)
    }

    setParticleData(quad) {
        let vertices = quad
        gl.useProgram(this.prog);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        let tex_coords = [
            1, 0, // tri1
            1, 1,
            0, 0, 
            0, 1, // tri2
            1, 0,
            0, 1
        ]

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
    }

	onModelViewProjectionUpdated(mvp) {
		this.mvp = mvp
        //console.log(this.mvp)
	}

    updateWorldTransform(worldTransform) {	
        if (this.mvp == null) return
        //console.log(this.mvp)
        
        let newMVP = matrixMultiply(this.mvp, worldTransform)

		// Set mvp matrix value in shaders
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvpLoc, false, newMVP);        
	}
	
	draw(particleList) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        
		gl.useProgram(this.prog);
        // Enables position attribute as a vec3
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.posLoc);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.texCoordsBuffer );
		gl.vertexAttribPointer( this.texLoc, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.texLoc );
        
        // While particles COULD use different textures each, it's easier this way.
        // We could also extend this class and change the shader.
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.activeTexture(gl.TEXTURE0)
        gl.uniform1i(this.samplerLoc, 0)  // Unit 0

        /*for (var i = 0; i < 6; i++) {
            this.drawFace(i)
        }*/
        particleList.forEach(particle => {
            //console.log(particle.translation)
            let quad = this.getQuadCentered(particle.translation[0], particle.translation[1], particle.translation[2], particle.scale[0] / 2.0, particle.scale[1] / 2.0)
            this.setParticleData(quad)
            this.setColor([particle.colorTint[0], particle.colorTint[1], particle.colorTint[2],particle.alpha]);
            
            gl.uniformMatrix4fv(this.rotLoc, false, calculateRotationMatrix(0.0, 0.0, particle.rotations[2]))
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        });
        gl.disable(gl.BLEND);
	}

    getQuadCentered(x, y, z, halfWidth, halfHeight){
        let tris =  [
            x + halfWidth, y - halfHeight, z, // bottom right
            x + halfWidth, y + halfHeight, z, // top right
            x - halfWidth, y - halfHeight, z, // bottom left
            x - halfWidth, y + halfHeight, z, // top left
        ]
        return tris
    }
}

// Vertex Shader
var particleSystemVS = `
	attribute vec3 pos;
    attribute vec2 tex;
	
	uniform mat4 mvp;
    uniform mat4 rotation;

	varying vec4 vertCoord;
    varying vec2 texCoord;

	void main() {        
		gl_Position = mvp * rotation * vec4(pos, 1.0);
        vertCoord = vec4(pos, 1.0);
        texCoord = tex;
	}
`;

// Fragment Shader
var particleSystemFS = `
	precision mediump float;

    uniform sampler2D texGPU;

    uniform vec4 color;
    varying vec4 vertCoord;
    varying vec2 texCoord;

	void main() {
        float alpha = color.a;
        vec4 col = texture2D(texGPU, texCoord);
        col *= col.a;
        col.a *= alpha;

        /*
        vec2 uv = texCoord.xy - 0.5;
        float d = sqrt(dot(uv,uv));
        float radius = 0.3;
        float t = 1.0 - smoothstep(radius, radius+0.1, d);
        float t2 = 1.0 - smoothstep(radius-0.2, radius-0.1, d*1.0);
        vec4 col = t * color;
        vec4 inner_color = t2 * vec4(0.8, 0.8, 0.8, 1.0);        
        col = col + inner_color;        
        col *= alpha;
        
        */
        //col += color / 2.0;
		//gl_FragColor = vec4(uv, 0.0, 1.0);

        if (col.a < 0.1){
            discard;
        }        
        gl_FragColor = col;
	}
`;