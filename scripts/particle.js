class Particle{
    constructor(emitter){
        this.translation = [0.0, 0.0, 0.0]
		this.rotations = [0.0, 0.0, 0.0]
        
        this.maxScale = [1.0, 1.0, 1.0]
		this.scale = [1.0, 1.0, 1.0]

        this.speed = [0.0, 0.0, 0.0]
        this.acceleration = [0.0, 0.0, 0.0]
        this.rotationSpeed = [0.0, 0.0, 0.0]
        this.scaleSpeed = [0.0, 0.0, 0.0]

        this.lifeAsAlpha = false;
        this.lifeAsScale = false
        this.alphaReduction = 0.0;
        this.alpha = 1.0
        this.colorTint = [1.0, 1.0, 1.0]

        this.life = 1.0
        this.maxLife = 1.0
        this.dead = false

        this.emitter = emitter
        this.id = 0
    }

    update(){
        if (this.dead){
            return
        }

        this.speed[0] += this.acceleration[0]
        this.speed[1] += this.acceleration[1]
        this.speed[2] += this.acceleration[2]

        this.rotations[0] += this.rotationSpeed[0]
        this.rotations[1] += this.rotationSpeed[1]
        this.rotations[2] += this.rotationSpeed[2]

        this.translation[0] += this.speed[0]
        this.translation[1] += this.speed[1]
        this.translation[2] += this.speed[2]
        
        
        this.life -= 0.016
        if (this.lifeAsAlpha){
            if (this.life <= 0.5){
                this.alpha = this.life / 0.5;
            }
            //this.alpha = this.life / this.maxLife
        } else{
            this.alpha = Math.max(this.alpha - this.alphaReduction, 0.0);
        }

        if (this.lifeAsScale){
            if (this.life <= 1.0){
                this.scale[0] = (this.life / this.maxLife) * this.maxScale[0];
                this.scale[1] = (this.life / this.maxLife)  * this.maxScale[0];
            }
        } else {
            this.scale[0] += this.scaleSpeed[0]
            this.scale[1] += this.scaleSpeed[1]
            this.scale[2] += this.scaleSpeed[2]
        }

        if (this.life <= 0){
            this.die()
        }
        
    }

    die(){
        this.dead = true;
        this.emitter.onParticleDestroyed(this)
    }
}