const SteeringManager = (() => {
    const MAX_FORCE = 0.1;
    const DEFAULT_SLOWING_DISTANCE = 20;
    const DOUBLE_PI = 2.0 * Math.PI;

    function truncate(vector, max) {
        if(vector.magnitudeSquared() > max * max) {
            vector.scaleToMagnitude(max);
        }
    }

    return class SteeringManager {
        constructor(unit) {
            this.host = unit;
            this.wanderAngle = Math.random() * DOUBLE_PI;
            this.reset();
        }

        reset() {
            this.steering = new Vector();
        }

        update() {
            let host = this.host;

            truncate(this.steering, MAX_FORCE);
            host.velocity.add(this.steering);
            truncate(host.velocity, host.maxVelocity);
            host.pos.add(host.velocity);

            this.reset();
        }

        setWanderAngle(towards) {
            this.wanderAngle = Math.atan2(towards.y - this.host.pos.y, towards.x - this.host.pos.x);
        }

        seek(targetPos, slowingRadius) {
            if(targetPos == null) {
                debug("Null seek command!");
                return;
            }

            slowingRadius = slowingRadius || DEFAULT_SLOWING_DISTANCE;

            let host = this.host;
            let seekForce = targetPos.copy().subtract(host.pos);
            let distance = host.pos.distance(targetPos);
            let maxVelocity = host.maxVelocity;

            if(distance < slowingRadius) {
                seekForce.scaleToMagnitude(maxVelocity * (distance / slowingRadius));
            } else {
                seekForce.scaleToMagnitude(maxVelocity);
            }

            seekForce.subtract(host.velocity);
            this.steering.add(seekForce);
        }

        flee(avoidPos) {
            if(avoidPos == null) {
                debug("Null flee command!");
                return;
            }

            let host = this.host;
            let fleeForce = host.pos.copy().subtract(avoidPos);
            fleeForce.scaleToMagnitude(host.maxVelocity);
            fleeForce.subtract(host.velocity);
            this.steering.add(fleeForce);
        }
    };
})();