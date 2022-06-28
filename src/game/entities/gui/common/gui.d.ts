import Transform from "@razor/math/Transform";

export type metric = "px" | "%";
export type LengthMetric = `${number}${metric}`;

export interface PositionOptions {
    vertical: 'top' | 'center' | 'bottom' | LengthMetric
    horizontal: 'left' | 'center' | 'right' | LengthMetric
}

export type PositionRelative = "Razor" | Transform;