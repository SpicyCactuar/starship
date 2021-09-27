class Stage extends GameObject {

    constructor(stageDrawer) {
        super(stageDrawer, "stage")
        this.collider = new Collider([0.0, 0.25, 0.0], 5.0, 5.0, 10.0)
    }

}