/**
 * Created by khanas on 10/21/15.
 */

class ScrollingModulePhysics {

    static get ACCELERATION_CONSTANT() {
        return 0.010;
    }

    static get MIN_VELOCITY() {
        return 0.005;
    }

    static getMomentum(current, positions, lowerMargin, upperMargin, wrapperSize, EASING_BOUNCE) {
        var velocity: number = ScrollingModulePhysics.getVelocity(positions),
            momentum: any = ScrollingModulePhysics.computeMomentum(velocity, current);

        // beyond the bottom
        if (momentum.destination < lowerMargin) {
            momentum = ScrollingModulePhysics.computeSnap(lowerMargin, wrapperSize, velocity, current);
            momentum.bounce = EASING_BOUNCE;

            // beyond the top
        } else if (momentum.destination > upperMargin) {
            momentum = ScrollingModulePhysics.computeSnap(upperMargin, wrapperSize, velocity, current);
            momentum.bounce = EASING_BOUNCE;
        }

        return momentum;
    }

    static getVelocity(positions) {
        var i,
            velocity,
            positionsLength = positions.length,
            lastTime,
            lastPos,
            firstTime,
            firstPos,
            period = 100;

        if (positionsLength < 2) {
            return 0;
        }

        lastTime = positions[positionsLength - 1].time;
        lastPos = positions[positionsLength - 1].value;

        i = positionsLength - 2;
        while (i >= 0 && (positions[i].time - lastTime < period)) {
            firstTime = positions[i].time;
            firstPos = positions[i].value;
            i--;
        }

        if (lastTime - firstTime === 0) {
            return 0;
        }

        velocity = (lastPos - firstPos) / (lastTime - firstTime);

        if (Math.abs(velocity) < ScrollingModulePhysics.MIN_VELOCITY) {
            return 0;
        }

        return velocity;
    }

    static computeMomentum(velocity, current) {
        var acceleration = ScrollingModulePhysics.ACCELERATION_CONSTANT,
            time = Math.abs(velocity) / acceleration,
            distance = velocity / 2 * time;

        return {
            destination : current + distance,
            time : time
        };
    }

    static computeSnap(start, end, velocity, current) {
        var destination = start + Math.sqrt(end) * (velocity / 16);

        return {
            destination : destination,
            time : Math.abs((destination - current) / velocity)
        };
    }
}
