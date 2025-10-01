import randiman from "./random";
import { Shape, BACKGROUND_COLORS, SHAPE_COLORS, TEXT_COLORS } from "./map"
export { default as Avaaataaar } from "./shape-renderer.svelte"
export { Shape as AvaaataaarShape } from "./map"
export { SHAPE_COLORS }

export function getAvaaataaar(value: string) {
    const key = randiman({ value, min: 0, max: 19 });
    const key2 = randiman({ value: value.split("").reverse().join(""), min: 0, max: 19 });
    const shapeKey = randiman({ value, min: 1, max: 60 });
    const scale = randiman({ value, min: 50, max: 90 })
    const x = randiman({ value: value, min: 0, max: 80 })
    const y = randiman({ value: value + 100, min: 0, max: 80 })

    return {
        scale: scale / 100,
        x,
        y,
        background: BACKGROUND_COLORS[key],
        shape_color: SHAPE_COLORS[key],
        border: SHAPE_COLORS[key2],
        shape: Shape[Object.keys(Shape)[shapeKey - 1]]
    }
}

export { default as randiman } from "./random"