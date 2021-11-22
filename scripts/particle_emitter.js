class ParticleEmitter {

    constructor(relativePosition) {

        this.particleDrawer = new ParticleSystemDrawer()        
        this.setParticlesImage("./textures/fireparticle.png")

        this.relativePosition = relativePosition

        this.collider = null

        this.life = null // How long the emitter lives in seconds (null for infinite)
        this.dead = false 
        this.rate = 1 // Emission rate in seconds
        this.number = 20 // Number of particles emitted
        
        this.particleList = []
        //this.emit()
    }

    setParticlesImage(filename){
        let emitter = this
        let particleImage = new Image()
        particleImage.onload = function() {
            emitter.particleDrawer.setTexture(particleImage)
        }
        particleImage.src = filename
    }

    onModelViewProjectionUpdated(mvp){
        if (!mvp){return}
        this.particleDrawer.onModelViewProjectionUpdated(mvp)
    }

    updateWorldTransform(worldTransform) {
        this.worldPosition = [
            this.relativePosition[0] + worldTransform[12], 
            this.relativePosition[1] + worldTransform[13],
            this.relativePosition[2] + worldTransform[14]
        ]

        let emitterTransform = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            this.worldPosition[0], this.worldPosition[1], this.worldPosition[2], 1.0,
        ]
       
        this.particleDrawer.updateWorldTransform(emitterTransform)
    }

    update(){ 
        let matrices = engine.camera.getMVPMatrices()
        this.onModelViewProjectionUpdated(matrices.mvp)

        this.particleList.forEach(particle => {
            particle.update()
        });
    }

    sortParticleList(){
        // TODO: sort by Z for transparency reasons (maybe insertion sort could be fast in this case?)
        this.particleList.sort( function(a, b) {
            let diff = a.translation[2] - b.translation[2]
            if (diff != 0.0){
                return diff
            } else {
                return (b.id - a.id)
            }
        })
    }

    draw(){
        this.particleDrawer.draw(this.particleList)
    }

    emit(){
        //console.log("Emitting")
        // Basic emitting behaviour, extend class to make other emitters
        
        // This loop emits particles in a circle pattern with a random offset
        let currentAngle = Math.random() * 2.0 * Math.PI
        for (let i=0; i < this.number; ++i){
            let part = new Particle(this)

            let offsetAngle = currentAngle //+ Math.random() * 0.1 - 0.05
            let partSpeed = 0.05;

            part.translation = [Math.cos(offsetAngle) * 0.1, Math.sin(offsetAngle) * 0.1, i * 0.01] 
            // Something to be aware of is transparency in 3D particles. We add a really small Z to sort particles by that component. Particles closer to us will be drawn last. 
            part.rotations = [0.0, 0.0, offsetAngle]
            part.scale = [0.5, 0.5, 0.5]
            
            part.speed = [Math.cos(offsetAngle) * partSpeed, Math.sin(offsetAngle) * partSpeed, 0.0]
            part.acceleration = [0.0, 0.0, 0.0]
            part.rotationSpeed = [0.0, 0.0, 5.0]

            //part.scaleSpeed = [-0.01, -0.01, -0.01]
            part.lifeAsScale = true

            part.maxLife = 0.5
            part.life = 0.5
            part.lifeAsAlpha = false;
            part.id = this.current_id;
            this.current_id = (this.current_id + 1) % 100000;
            //part.alphaReduction = 0.008;

            currentAngle += (2.0 * Math.PI) / this.number

            this.particleList.push(part)
        }
        this.sortParticleList()
    }

    onParticleDestroyed(part){
        const index = this.particleList.indexOf(part)
        if (index > -1) {
            this.particleList.splice(index, 1)
        }
    }
}