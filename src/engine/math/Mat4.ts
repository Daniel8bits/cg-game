import Mat from './Mat';
import {Tuple} from './MathTypes'
import Vec3 from './Vec3';
import Vec4 from './Vec4';

import {toRadian, mult, equals, transpose} from './math'

export type Matrix4x4OperandType = Mat4 | Vec4

class Mat4 extends Mat {

    public constructor (
        matrix: 
        [
            number, number, number, number, 
            number, number, number, number, 
            number, number, number, number, 
            number, number, number, number
        ] =
        [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ] 
        ) {
        super(matrix);
    }


    protected $validate(index: Tuple<[number, number]>) : void | never {
        if(!(index[0] >= 0 && index[0] <= 3 && index[1] >= 0 && index[1] <= 3)) {
            throw new Error("Matrix4x4 index out of bounds! (Min: 0, Max: 3)");
        }
    }

    public static orthographic(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number
    ): Mat4 {
        let matrix: Mat4 = new Mat4();
    
        let rl: number = 1 / (right - left);
        let tb: number = 1 / (top - bottom);
        let fn: number = 1 / (far - near);
    
        matrix.set([0, 0], 2 * rl);
        matrix.set([1, 1], 2 * tb);
        matrix.set([2, 2], -2 * fn)
        matrix.set([3, 0], -(right + left) * rl);
        matrix.set([3, 1], -(top + bottom) * tb);
        matrix.set([3, 2], -(far + near) * fn);
    
        return matrix;
    }

    /*

        public static Matrix4x4 project(float fov, float aspectRatio, float near, float far){

        Matrix4x4 projection = new Matrix4x4();

        float tan = (float) Math.tan(Math.toRadians(fov / 2));
        float range = far - near;

        float y_scale = 1f / tan;
        float x_scale = y_scale / aspectRatio;

        
        projection.setValueOn(0, 0, x_scale);
        projection.setValueOn(1, 1, y_scale);
        projection.setValueOn(2, 2, - ( (far + near) / range ));
        projection.setValueOn(2, 3, -1);
        projection.setValueOn(3, 2, - ( (2 * far * near) / range ));
        projection.setValueOn(3, 3, 0);

        return projection;

    }

    */

    public static perspective(
        fov: number,
        aspectRatio: number,
        near: number,
        far: number
    ): Mat4 {
        let matrix: Mat4 = new Mat4();

        const tan = Math.tan(toRadian(fov/2))
        const range = far - near

        const y_scale = 1 / tan
        const x_scale = y_scale / aspectRatio

        matrix.set([0, 0], x_scale);
        matrix.set([1, 1], y_scale)

        matrix.set([2, 2], - ( (far + near) / range ));
        matrix.set([2, 3], -1)

        matrix.set([3, 2], - ( (2 * far * near) / range ))
        matrix.set([3, 3], 0);

        return matrix;
    }

   /*
    public static perspective(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number
    ): Mat4 {
        let matrix: Mat4 = new Mat4();
    
        let rl: number = 1 / (right - left);
        let tb: number = 1 / (top - bottom);
        let fn: number = 1 / (far - near);
    
        matrix.set([0, 0], 2*near * rl);
        matrix.set([0, 2], (right+left)/rl)

        matrix.set([1, 1], 2*near * tb);
        matrix.set([1, 2], (top+bottom)/tb)

        matrix.set([2, 2], (far-near) * fn)
        matrix.set([2, 3], -2*(far + near) * fn);

        matrix.set([3, 2], -1);
        matrix.set([3, 3], 0);
    
        return matrix;
    }
    */

    public static transform(translation: Vec3, rotation: Vec3, scale: Vec3): Mat4 {

        const TRANSLATION = Mat4.translate(new Vec3(-translation.x, -translation.y, -translation.z));

        const ROTATION_X = Mat4.xRotate(rotation.x);
        const ROTATION_Y = Mat4.yRotate(rotation.y);
        const ROTATION_Z = Mat4.zRotate(rotation.z);

        const SCALE = Mat4.scale(scale);

        return SCALE.mult(ROTATION_Y.mult(ROTATION_Z).mult(ROTATION_X)).mult(TRANSLATION)
    }

    public static view(translation: Vec3, rotation: Vec3): Mat4 {

        const TRANSLATION = Mat4.translate(new Vec3(-translation.x, -translation.y, -translation.z));

        const ROTATION_X = Mat4.xRotate(rotation.x);
        const ROTATION_Y = Mat4.yRotate(rotation.y);
        const ROTATION_Z = Mat4.zRotate(rotation.z);

        return TRANSLATION.mult(ROTATION_Y.mult(ROTATION_X).mult(ROTATION_Z))
    }

    public static scale(scale: Vec3): Mat4 {
        let matrix: Mat4 = new Mat4();

        matrix.set([0, 0], scale.x);
        matrix.set([1, 1], scale.y);
        matrix.set([2, 2], scale.z);

        return matrix;
    }

    public static xRotate(angle: number): Mat4 {
        return Mat4.rotate(angle, new Vec3(1, 0, 0))
    }

    public static yRotate(angle: number): Mat4 {
        return Mat4.rotate(angle, new Vec3(0, 1, 0))
    }

    public static zRotate(angle: number): Mat4 {
        return Mat4.rotate(angle, new Vec3(0, 0, 1))
    }

    public static rotate(angle: number, axis: Vec3): Mat4 {
        let matrix: Mat4 = new Mat4();

        const cos = Math.cos(toRadian(angle));
        const sin = Math.sin(toRadian(angle));
        const C = 1 - cos

        matrix.set([0, 0], cos + axis.x * axis.x * C);
        matrix.set([0, 1], axis.x * axis.y * C - axis.z * sin);
        matrix.set([0, 2], axis.x * axis.z * C + axis.y * sin);

        matrix.set([1, 0], axis.y * axis.x * C + axis.z * sin);
        matrix.set([1, 1], cos + axis.y * axis.y * C);
        matrix.set([1, 2], axis.y * axis.z * C - axis.x * sin);

        matrix.set([2, 0], axis.z * axis.x * C - axis.y * sin);
        matrix.set([2, 1], axis.z * axis.y * C + axis.x * sin);
        matrix.set([2, 2], cos + axis.z * axis.z * C);

        return matrix;
    }

    public static translate(translate: Vec3): Mat4 {
        let matrix: Mat4 = new Mat4();

        matrix.set([3, 0], translate.x);
        matrix.set([3, 1], translate.y);
        matrix.set([3, 2], translate.z);

        return matrix;
    }


    public equals(m: Mat4): boolean {
        return equals(
            4, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number) => m.get([x, y])
        );
    }

    public transpose(): Mat4 {
        let matrix: Mat4 = new Mat4();

        transpose(
            4, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number, v: number) => matrix.set([x, y], v),
        )

        return matrix;
    }

    public mult(m: Mat4): Mat4 {
        let matrix: Mat4 = new Mat4();

        mult(
            4, 
            (x: number, y: number) => this.get([x, y]),
            (x: number, y: number) => m.get([x, y]),
            (x: number, y: number, v: number) => matrix.set([x, y], v),
        )

        return matrix;
    }

}

export default Mat4;