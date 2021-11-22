class FireParticleEmitter extends ParticleEmitter {

    constructor(relativePosition) {
        super(relativePosition)
        this.particleDrawer = new ParticleSystemDrawer()        
        this.setParticlesImage("./textures/fireparticle.png")

        this.rate = 0.005 // Emission rate in seconds
        this.number = 4 // Number of particles emitted
        this.timer = 0.0

        this.rotationX = 0.0
        this.rotationY = 0.0
    }

    setRotation(X, Y){
        this.rotationX = X
        this.rotationY = Y
    }

    update(){ 
        super.update()
        this.timer += 0.016
        if (this.timer > this.rate){
            this.timer = 0.0
            this.emit()
        }
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

            let offsetAngle = currentAngle + Math.random() * 0.1 - 0.05
            let partSpeed = 0.01;

            part.translation = [Math.cos(offsetAngle) * 0.08 + this.rotationX * 5.0, Math.sin(offsetAngle) * 0.08 + this.rotationY * 5.0, i * 0.00001] 
            // Something to be aware of is transparency in 3D particles. We add a really small Z to sort particles by that component. Particles closer to us will be drawn last. 
            part.rotations = [0.0, 0.0, offsetAngle]
            part.maxScale = [0.35, 0.35, 0.35]
            part.scale = [0.35, 0.35, 0.35]
            
            part.speed = [Math.cos(offsetAngle) * partSpeed + this.rotationX + Math.random() * 0.01 - 0.005, Math.sin(offsetAngle) * partSpeed + this.rotationY, 0.08]
            part.acceleration = [0.0, 0.0, 0.0]
            part.rotationSpeed = [0.0, 0.0, 0.0]

            part.maxLife = 0.15
            part.life = 0.15
            part.lifeAsAlpha = false;
            part.lifeAsScale = true;
            part.id = this.current_id;
            this.current_id = (this.current_id + 1) % 1000;

            part.colorTint = [0.0, 0.0, 1.0]

            currentAngle += (2.0 * Math.PI) / this.number

            this.particleList.push(part)
        }
        this.sortParticleList()
    }
}