class Stage extends GameObject {

    constructor(stageDrawer) {
        super(stageDrawer, "stage")
        this.collider = new Collider([0.0, 0.25, 0.0], 5.0, 5.0, 10.0)
    }

    static create(cameraMatrices) {
        let stageDrawer = new ObjectDrawer(cameraMatrices.mvp, cameraMatrices.mv)

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

}