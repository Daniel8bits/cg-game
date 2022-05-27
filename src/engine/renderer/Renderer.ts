import Entity from "../core/Entity";
import Scene from "../core/Scene";
import Shader from "../appearance/Shader";
import Material from "@razor/appearance/material/Material";

abstract class Renderer {

    private _name: string;

    private _scene: Scene;

    protected constructor(name: string) {
        this._name = name;
    }

    protected getEntitiesByMaterial(material: Material): Entity[] {
        return this._scene.filterVisible(
            (entity: Entity) => 
                entity.getRenderer().getName() === this._name &&
                entity.getMaterial() && 
                entity.getMaterial().getName() === material.getName()
        )
    }

    protected getEntitiesByShader(shader: Shader): Entity[] {
        return this._scene.filterVisible(
            (entity: Entity) => 
                entity.getRenderer().getName() === this._name &&
                entity.getMaterial().getShader().getName() === shader.getName()
        )
    }

    public abstract render(): void;

    public getName(): string { 
        return this._name
    }

    public setScene(scene: Scene) {
        this._scene = scene;
    }
}

export default Renderer