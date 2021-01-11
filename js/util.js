const FastMath = (() => {
    const SIN_BITS = 14;
    const SIN_MASK = ~(-1 << SIN_BITS);
    const SIN_COUNT = SIN_MASK + 1;
    const RADIANS_FULL = 2.0 * Math.PI;
    const DEGREES_FULL = 360.0;
    const RADIANS_TO_INDEX = SIN_COUNT / RADIANS_FULL;
    const DEGREES_TO_INDEX = SIN_COUNT / DEGREES_FULL;

    const DEGREES_TO_RADIANS = Math.PI / 180.0;
    const HALF_PI = Math.PI / 2.0;

    const sinTable = [];
    for(let i = 0; i < SIN_COUNT; i++) {
        sinTable.push(Math.sin((i + 0.5) / SIN_COUNT * RADIANS_FULL));
    }
    for(let i = 0; i < DEGREES_FULL; i += 90.0) {
        sinTable[~~(i * DEGREES_TO_INDEX) & SIN_MASK] = Math.sin(i * DEGREES_TO_RADIANS);
    }

    return {
        sin(rad) {
            return sinTable[~~(rad * RADIANS_TO_INDEX) & SIN_MASK];
        },
        cos(rad) {
            return sinTable[~~((rad + HALF_PI) * RADIANS_TO_INDEX) & SIN_MASK];
        }
    }
})();