import VAO from "../../buffer/VAO";
import Renderer from "../../renderer/Renderer";
import Transform from "../../math/Transform"
import Material from "../../appearance/material/Material";
import Scene from "../scenes/Scene";
import Updater from "../updater/Updater";

type Constructor<T> = { new (...args: any[]): T };

type NonConstructorKeys<T> = ({[P in keyof T]: T[P] extends new () => any ? never : P })[keyof T];
type NonConstructor<T> = Pick<T, NonConstructorKeys<T>>;
export type ModelStatic<M extends Entity> = NonConstructor<typeof Entity> & { new(...args: any[]): M };

abstract class Entity {

    private _name: string;

    private _vao: VAO;
    private _material: Material;
    private _renderer: Renderer;

    private _transform: Transform
    private _scene : Scene;

    private static _listEntities: Map<string,Entity> = new Map();

    public constructor(name: string, vao?: VAO, material?: Material, renderer?: Renderer) {
        Entity._listEntities.set(name,this);
        this._name = name;
        this._vao = vao;
        this._material = material;
        this._renderer = renderer;
        this._transform = new Transform()
        this.getTransform().setEntity(this);
    }

    public static Find<T extends Entity>(this : ModelStatic<T>,name: string) : T{
        return Entity._listEntities.get(name) as T;
    }

    //public abstract start() : void;

    public abstract update(
        time: number, 
        delta: number,
        currentScene : Scene,
        updater: Updater
    ): void;

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

    public setScene(scene : Scene) : void{
        this._scene = scene;
    }

    public getScene() : Scene{
        return this._scene;
    }

}

export default Entity;