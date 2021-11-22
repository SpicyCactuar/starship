class SkyDrawer{
    constructor() {
        this.prog = createShaderProgram(SkyVS, SkyFS)

        this.colLoc = gl.getUniformLocation(this.prog, 'color')
		this.posLoc = gl.getAttribLocation(this.prog, 'pos')
        this.timeLoc = gl.getUniformLocation(this.prog, 'u_time')
		this.positionBuffer = gl.createBuffer()
        
		this.samplerLoc = gl.getUniformLocation(this.prog, 'texGPU')
		this.texture = gl.createTexture()

        this.mvp = null

        this.color = [1.0, 0.0, 0.0, 1.0]
        
        this.setColor(this.color)

        let drawer = this
        let skyTexture = new Image()
        skyTexture.onload = function() {
            drawer.setTexture(skyTexture)
        }
        skyTexture.src = "./textures/noise.png"

        this.time = 0.0
    }

    setColor(color) {
        gl.useProgram(this.prog);
        gl.uniform4fv(this.colLoc, color);
    }

    onModelViewProjectionUpdated(){
        //pass
    }

    update(){
        //pass
        this.time += 0.016;
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
	
	draw() {
        gl.disable(gl.DEPTH_TEST)
	    gl.disable(gl.CULL_FACE)
        
		gl.useProgram(this.prog);
        // Enables position attribute as a vec3
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.posLoc);
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.activeTexture(gl.TEXTURE0)
        gl.uniform1i(this.samplerLoc, 0)  // Unit 0     
        
        gl.uniform1f(this.timeLoc, this.time);

        let vertices = [
            // First triangle:
             1.0,  1.0,
            -1.0,  1.0,
            -1.0, -1.0,
            // Second triangle:
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0
        ];
        gl.useProgram(this.prog);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        this.setColor([this.color[0], this.color[1], this.color[2], 1.0]);
        
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);    
        
        gl.enable(gl.DEPTH_TEST)
	    gl.enable(gl.CULL_FACE)    
	}

}

// Vertex Shader
var SkyVS = `
	attribute vec2 pos;
    varying vec2 texCoord;

	void main() {
        texCoord = pos * vec2(0.5, 0.5) + vec2(0.5, 0.5);
		gl_Position = vec4(pos, -1.0, 1.0);
	}
`;

// Fragment Shader
var SkyFS = `
	precision mediump float;

    uniform sampler2D texGPU;

    uniform vec4 color;   
    uniform float u_time; 
    varying vec2 texCoord;

    //https://gist.github.com/983/e170a24ae8eba2cd174f
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

	void main() {
        vec2 uv = texCoord;
    
        float pct = 1.0 - distance(uv,vec2(0.5));
        pct = pow(pct, 4.0);

        uv.x = abs(uv.x - 0.5) * pct;    
        uv.y = abs(uv.y - 0.5) * pct;    
        
        vec4 tex = texture2D(texGPU, vec2(uv.x + u_time * 0.01, uv.y + u_time * 0.05));
        
        uv.x = tex.x * uv.y;

        vec4 tex2 = texture2D(texGPU, vec2(uv.x * sin(u_time) * 0.05 * tex.x, uv.y * cos(u_time) * 0.05 + tex.y));
        
        tex = mix(tex, tex2, 0.1);
        tex.x = step(tex.x, 1.0 - pct);
        tex.y = step(tex.y, 1.0 - pct);
        tex = vec4(smoothstep(tex.x, tex.x + 0.1, 0.5));
        tex = smoothstep(0.8, 0.9, tex);
        tex.xy = clamp(tex.xy + uv.yx, 0.0, 1.0);

        uv = texCoord;
        uv.x = abs(uv.x - 0.5) * pct;
        uv.y = abs(uv.y - 0.5) * pct;
        vec4 noise = texture2D(texGPU, uv * 3.0 - u_time * 0.05);
        tex = (noise + noise) + tex * 0.4;    
        
        tex.a = step(0.5, tex.x);
        tex *= tex.a;
        tex = tex * pct;
        tex *= 0.25;

        vec4 col = vec4(hsv2rgb(vec3(u_time * 0.01, 1.0, 1.0)), 1.0);
        tex = tex * col;
        tex.a = col.a;
        tex *= tex.a;

        gl_FragColor = tex;
        //gl_FragColor = texture2D(texGPU, uv);
	}
`;