class ExplosionEmitter extends ParticleEmitter {

    constructor(relativePosition) {

        super(relativePosition)
        this.particleDrawer = new ParticleSystemDrawer()        
        this.setParticlesImage("./textures/fireparticle.png")

        this.number = 30
    }
    
    emit(){        
        // Basic emitting behaviour, extend class to make other emitters
        
        // This loop emits particles in a circle pattern with a random offset
        let currentAngle = Math.random() * 2.0 * Math.PI
        for (let i=0; i < this.number; ++i){
            let part = new Particle(this)

            let offsetAngle = currentAngle //+ Math.random() * 0.1 - 0.05
            let partSpeed = 0.15;

            let radius = 0.3 * Math.random() - 0.15 

            part.translation = [Math.cos(offsetAngle) * radius, Math.sin(offsetAngle) * radius, i * 0.0001] 
            // Something to be aware of is transparency in 3D particles. We add a really small Z to sort particles by that component. Particles closer to us will be drawn last. 
            part.rotations = [0.0, 0.0, offsetAngle]
            part.maxScale = [0.5, 0.5, 0.5]
            part.scale = [0.5, 0.5, 0.5]
            
            part.speed = [Math.cos(offsetAngle) * partSpeed, Math.sin(offsetAngle) * partSpeed, 0.0]
            part.acceleration = [0.0, 0.0, 0.0]
            part.rotationSpeed = [0.0, 0.0, 5.0]

            //part.scaleSpeed = [-0.01, -0.01, -0.01]
            part.lifeAsScale = true

            part.maxLife = 0.25
            part.life = 0.25
            part.lifeAsAlpha = false;
            part.id = this.current_id;
            this.current_id = (this.current_id + 1) % 100000;
            //part.alphaReduction = 0.008;

            currentAngle += (8.0 * Math.PI) / this.number

            this.particleList.push(part)
        }
        this.sortParticleList()
    }
}