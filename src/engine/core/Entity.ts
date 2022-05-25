import VAO from "../buffer/VAO";
import Renderer from "../renderer/Renderer";
import Transform from "../math/Transform"
import Material from "../appearance/material/Material";
import Scene from "./Scene";
import { Matrix4 } from "@math.gl/core";


abstract class Entity {

    private _name: string;

    private _vao: VAO;
    private _material: Material;
    private _renderer: Renderer;

    private _transform: Transform

    public constructor(name: string, vao?: VAO, material?: Material, renderer?: Renderer) {
        this._name = name;
        this._vao = vao;
        this._material = material;
        this._renderer = renderer;
        this._transform = new Transform()
        this.transform.setEntity(this);
    }

    //public abstract start() : void;

    public abstract update(time: number, delta: number): void;

    public render(): void{

    }

    public setVAO(vao: VAO) {
        this._vao = vao
    }
    
    public setMaterial(material: Material) {
        this._material = material
    }

    public setRenderer(renderer: Renderer) {
        this._renderer = renderer;
    }
    
    public getVAO() : VAO {
        return this._vao
    }
    
    public getMaterial() : Material {
        return this._material
    }

    public getRenderer(): Renderer {
        return this._renderer;
    }

    public getName(): string {
        return this._name;
    }

    public getTransform() : Transform {
        return this._transform
    }

    public get transform() :Transform{
        return this._transform;
    }

}

export default Entity;