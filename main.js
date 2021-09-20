// Canvas to draw on
var canvas;

// WebGL context
var gl;

// GameObjects
var gameObjectList = [];
var drawerList = [];
var colliderList = [];

// Camera
var camera = new Camera();

// When window loads, perform all steps to initialize & draw the WebGL scene
window.onload = async function() {
	initializeWebGL()
    initializeScene()
    updateCanvasSize()
	startGameLoop()
	initializeGameInputListeners()
}

function initializeGameInputListeners(){
	document.addEventListener('keydown', function(event) {
		var current_angleX = camera.rotation[0]
		var current_angleY = camera.rotation[1]
		var current_position = camera.center
		
		var rotated = false

		if (event.key == "a") {
			current_angleY -= 1.0
			rotated = true
		} else if (event.key == "d") {
			current_angleY += 1.0
			rotated = true
		} else if (event.key == "w") {
			current_angleX -= 1.0
			rotated = true
		} else if (event.key == "s") {
			current_angleX += 1.0
			rotated = true
		}

		if (rotated){
			current_position[0] = Math.sin(deg2rad(current_angleY)) * 1.0 
			current_position[2] = Math.cos(deg2rad(current_angleY)) * 1.0 + 5.0
			camera.center = current_position
			camera.setRotation(current_angleX, current_angleY, camera.rotation[2])
			notifyViewportUpdated()
		}
	});
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
	let cameraMatrices = camera.getMVPMatrices()	

	let stage = createStage(cameraMatrices)
	gameObjectList.push(stage)
	
	let starship = createStarship(cameraMatrices)
	gameObjectList.push(starship)
	colliderList.push(starship.collider)
		
	stage.setScale(1.0, 1.0, 1.0)
	stage.setRotation(45.0, 0.0, 0.0)
	stage.setTranslation(0.0, -1.0, -10.0)
	
	starship.setTranslation(0.0, 0.0, -3.0)
	starship.setRotation(0.0, 180.0, 0.0)
}

function createStage(cameraMatrices) {
	let stageDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)
	drawerList.push(stageDrawer)

	let mesh = new ObjectMesh()
	mesh.load("./models/final_destination.obj")
	stageDrawer.setMesh(mesh)

	let stageImage = new Image()
	stageImage.onload = function() {
		stageDrawer.setTexture(stageImage)
	}
	stageImage.src = "./textures/rock.png"

	return new Stage(stageDrawer)
}

function createStarship(cameraMatrices) {
	let starshipDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)
	drawerList.push(starshipDrawer)

	let mesh = new ObjectMesh()
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
	colliderList.forEach(function(collider) {
		collider.onModelViewProjectionUpdated(matrices.mvp)
	})
	gameObjectList.forEach(function(gameObject) {
		gameObject.updateWorldTransform()
	})
	
}

function startGameLoop() {
	setInterval(function() {
		updateScene()
		drawScene()
	}, 16);
}