// Compiles vsSource and fsSource as vertex & fragment shaders respectively
// Returns the associated program
function createShaderProgram(vsSource, fsSource, wgl=gl)
{
	// Compile each shader separately
	const vs = compileShader(wgl.VERTEX_SHADER, vsSource, wgl)
	const fs = compileShader(wgl.FRAGMENT_SHADER, fsSource, wgl)

	// Create & attach shaders to program
	const prog = wgl.createProgram()
	wgl.attachShader(prog, vs)
	wgl.attachShader(prog, fs)
	wgl.linkProgram(prog)

	if (!wgl.getProgramParameter(prog, wgl.LINK_STATUS)) {
		alert('Failed to initialize shader program: ' + wgl.getProgramInfoLog(prog))
		return null
	}
	return prog
}

// Compile a shader source of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
function compileShader(type, source)
{
	// Creates & compiles shader
	const shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	// Checks successful shader compilation
	if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS)) {
		alert('Failed to compile shader:' + gl.getShaderInfoLog(shader))
		gl.deleteShader(shader)
		return null
	}
	return shader
}