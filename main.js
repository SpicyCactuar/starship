// Canvas to draw on
var canvas;

// WebGL context
var gl;

// GameObjects
var gameObjectList = [];
var drawerList = [];

// Camera
var camera;

// When window loads, perform all steps to initialize & draw the WebGL scene
window.onload = async function() {
	initializeWebGL()
    initializeScene()
    updateCanvasSize()
	startGameLoop()
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

// Initializes scene objects
function initializeScene() {
	camera = new Camera()

	let starship = createStarship()
	starship.setTranslation(0.0, 0.0, -10.0)
	starship.setRotation(0.0, 180.0, 0.0)
	gameObjectList.push(starship)
	/*let stage = createStage()
	stage.setScale(0.1, 0.1, 0.1)
	stage.setRotation(45.0, 0.0, 0.0)
	stage.setTranslation(0.0, 0.0, 0.0)
	gameObjectList.push(stage)*/
}

function createStage() {
	let stageDrawer = new ObjectDrawer()
	drawerList.push(stageDrawer)

	let mesh = new ObjMesh()
	mesh.load("./models/final_destination.obj")
	stageDrawer.setMesh(mesh)

	let stageImage = new Image()
	stageImage.onload = function() {
		stageDrawer.setTexture(stageImage)
	}
	stageImage.src = "./textures/rock.png"

	return new GameObject(stageDrawer, "stage")
}

function createStarship() {
	let starshipDrawer = new ObjectDrawer()
	drawerList.push(starshipDrawer)

	let mesh = new ObjMesh()
	mesh.load("./models/starship.obj")
	starshipDrawer.setMesh(mesh)

	let starshipImage = new Image()
	starshipImage.onload = function() {
		starshipDrawer.setTexture(starshipImage)
	}
	starshipImage.src = "./textures/duck.png"

	return new Starship(starshipDrawer)
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
    notifyViewportUpdated()
}

function updateScene() {
	gameObjectList.forEach(function(gameObject) {
		gameObject.update()
	})
}

function drawScene() {
	// Clear WebGL buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gameObjectList.forEach(function(gameObject) {
		gameObject.draw()
	})
}

function notifyViewportUpdated() {
	// TODO: Include viewport matrix in the calculation
	let matrices = camera.getMVPMatrices()

	drawerList.forEach(function(drawer) {
		drawer.onModelViewProjectionUpdated(matrices.mvp, matrices.mv)
	})
}

function startGameLoop() {
	setInterval(function() {
		updateScene()
		drawScene()
	}, 16);
}