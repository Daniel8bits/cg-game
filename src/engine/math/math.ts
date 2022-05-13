

export const toRadian = (angle: number): number => (angle * Math.PI) / 180

export const toDegree = (radian: number): number => (radian * 180) / Math.PI

/*============================
            MATRIX
=============================*/

type MatrixValueGetCallback = (x: number, y: number) => number
type MatrixValueSetCallback = (x: number, y: number, value: number) => void

export const equals = (
    size: number, 
    getV1: MatrixValueGetCallback,
    getV2: MatrixValueGetCallback
): boolean => {
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(getV1(i, j) !== getV2(i, j)) {
                return false
            }
        }
    }
    return true
}

export const transpose = (
    size: number,
    getValue: MatrixValueGetCallback, 
    setValue: MatrixValueSetCallback
) => {
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            setValue(i, j, getValue(j, i));
        }
    }
}

export  const mult = (
    size: number, 
    getV1: MatrixValueGetCallback,
    getV2: MatrixValueGetCallback,
    setValue: MatrixValueSetCallback, 
) => {
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){

            let value = 0;
            for(let k = 0; k < size; k++) value += getV1(i, k)*getV2(k, j);

            setValue(i, j, value);

        }
    }
}

