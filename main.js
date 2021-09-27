// Canvas to draw on
var canvas

// WebGL context
var gl

// Camera
var camera = new Camera()

// Engine
var engine = new Engine()

// When window loads, perform all steps to initialize & draw the WebGL scene
window.onload = async function() {
	initializeWebGL()
    engine.initializeScene()
    updateCanvasSize()
	engine.startGameLoop()
	initializeGameInputListeners()
}

function initializeGameInputListeners() {
	document.addEventListener('keydown', function(event) {
		var currentAngleX = camera.rotation[0]
		var currentAngleY = camera.rotation[1]
		var currentPosition = camera.center
		
		var rotated = false

		if (event.key == "a") {
			currentAngleY -= 1.0
			rotated = true
		} else if (event.key == "d") {
			currentAngleY += 1.0
			rotated = true
		} else if (event.key == "w") {
			currentAngleX -= 1.0
			rotated = true
		} else if (event.key == "s") {
			currentAngleX += 1.0
			rotated = true
		}

		if (rotated) {
			currentPosition[0] = Math.sin(deg2rad(currentAngleY)) * 1.0 
			currentPosition[2] = Math.cos(deg2rad(currentAngleY)) * 1.0 + 5.0
			camera.center = currentPosition
			camera.setRotation(currentAngleX, currentAngleY, camera.rotation[2])
			engine.notifyViewportUpdated(camera)
		}
	})
}


// Initializes canvas & webGl context
function initializeWebGL() {
	canvas = document.getElementById("canvas")
    // Disables right click context menu
	canvas.oncontextmenu = function() {
		return false
	}

	gl = canvas.getContext("webgl", { antialias: false, depth: true })
	if (!gl) {
		alert("Failed to initialize WebGL. Check your browser & settings compatibility.")
		return
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 0.0)
	gl.enable(gl.DEPTH_TEST)
	gl.enable(gl.CULL_FACE)
	gl.cullFace(gl.BACK)
}

// Updates canvas size & redraws scene
function windowResize() {
	updateCanvasSize()
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
    engine.notifyViewportUpdated(camera)
}