import Vec2 from "./Vec2";

class Vec3 extends Vec2 {

    protected _z: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y);
        this._z = z;
    }

    public get z() : number {
        return this._z;
    }

    public set z(z: number) {
        this._z = z;
    }

    public assign(v: Vec3): void {
        super.assign(v);
        this._z = v.z
    }

    public equals(v: Vec3): boolean {
        return super.equals(v) && this._z === v.z;
    }

    public sum(v: Vec3): Vec3 {
        return new Vec3(this._x + v.x, this._y + v.y, this._z + v.z);
    }

    public sub(v: Vec3): Vec3 {
        return new Vec3(this._x - v.x, this._y - v.y, this._z - v.z);
    }

    public mult(v: number): Vec3 {
        return new Vec3(this._x*v, this._y*v, this._z*v);
    }

    public div(v: number): Vec3 {
        return new Vec3(this._x/v, this._y/v, this._z/v);
    }

    public cross(v: Vec3): Vec3 {
        return new Vec3(
            this._y*v.z + this._z*v.y, 
            this._z*v.x + this._x*v.z, 
            this._x*v.y + this._y*v.x,
        );
    }

    public dot(v: Vec3): number {
        return super.dot(v) + this._z*v.z;
    }

    public module(): number {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2) + Math.pow(this._z, 2));
    }
    
}

export default Vec3;