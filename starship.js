// Canvas to draw on
var canvas;

// WebGL context
var gl;

// Drawers
var starshipDrawer;

// Camera
var camera;

// When window loads, perform all steps to initialize & draw the WebGL scene
window.onload = function() {
	initializeWebGL()
    initializeScene()
    updateCanvasSize()
	drawScene()
}

// Initializes canvas & webGl context
function initializeWebGL() {
	canvas = document.getElementById("canvas")
    // Disables right click context menu
	canvas.oncontextmenu = function() { return false }

	gl = canvas.getContext("webgl", { antialias: false, depth: true })
	if (!gl) {
		alert("Failed to initialize WebGL. Check your browser & settings compatibility.")
		return
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 0.0)
	gl.enable(gl.DEPTH_TEST)
}

// Initializes scene objects
function initializeScene() {
    starshipDrawer = new StarshipDrawer()
	camera = new Camera()
}

// Updates canvas size & redraws scene
function windowResize() {
	updateCanvasSize()
	drawScene()
}

function updateCanvasSize() {
	// Calculate viewport size
	canvas.style.width  = "100%"
	canvas.style.height = "100%"

	const pixelRatio = window.devicePixelRatio || 1
	canvas.width     = pixelRatio * canvas.clientWidth
	canvas.height    = pixelRatio * canvas.clientHeight

	const width  = (canvas.width  / pixelRatio)
	const height = (canvas.height / pixelRatio)

	canvas.style.width  = width  + 'px'
	canvas.style.height = height + 'px'

	// Set WebGL to match viewport size
	gl.viewport(0, 0, canvas.width, canvas.height)

	// Upon resizing canvas, notify scene objects
    notifyViewportUpdated(width, height)
}

function drawScene() {
	// Clear WebGL color buffers
    gl.clear(gl.COLOR_BUFFER_BIT);
	// TODO: Check wether we need to clear Depth buffers as well

    starshipDrawer.draw()
}

function notifyViewportUpdated(width, height) {
	// TODO: Include viewport matrix in the calculation
	let mvp = camera.getProjectionMatrix()
	console.log(mvp)
    starshipDrawer.onModelViewProjectionUpdated(mvp)
}

// Game loop
setInterval( function() {
    // TODO: Implement
}, 15 );

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