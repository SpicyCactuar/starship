class Starship extends GameObject {

    constructor(sharshipDrawer) {
        super(sharshipDrawer)
        
        this.initializeEventListeners()
    }

    initializeEventListeners() {
		let starship = this
		document.addEventListener('keydown', function(event) {
			if (event.key == "ArrowLeft") {
				starship.leftKey = true
			} else if (event.key == "ArrowRight") {
				starship.rightKey = true
			} else if (event.key == "ArrowUp") {
				starship.upKey = true
			} else if (event.key == "ArrowDown") {
				starship.downKey = true
			}
		});
		document.addEventListener('keyup', function(event) {
			if (event.key == "ArrowLeft") {
				starship.leftKey = false
			} else if (event.key == "ArrowRight") {
				starship.rightKey = false
			} else if (event.key == "ArrowUp") {
				starship.upKey = false
			} else if (event.key == "ArrowDown") {
				starship.downKey = false
			}
		});
	}

    update() {
		var translationX = this.translation[0]
		var translationY = this.translation[1]

		translationX += (this.rightKey ? 0.01 : 0.0)
		translationX -= (this.leftKey ? 0.01 : 0.0)

		translationY += (this.upKey ? 0.01 : 0.0)
		translationY -= (this.downKey ? 0.01 : 0.0)
		
		this.setTranslation(translationX, translationY, this.translation[2])
	}
}