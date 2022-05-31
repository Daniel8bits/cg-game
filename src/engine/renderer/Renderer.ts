import Entity from "../core/entities/Entity";
import Scene from "../core/scenes/Scene";
import Shader from "../appearance/Shader";
import Material from "@razor/appearance/material/Material";
import Camera from "@razor/core/Camera";

abstract class Renderer {

    private _name: string;

    private _scene: Scene;
    private _camera: Camera;

    protected _maximumRenderDistance: number

    protected constructor(name: string, camera: Camera) {
        this._name = name;
        this._camera = camera;
        this._maximumRenderDistance = -1
    }

    protected getEntitiesByMaterial(material: Material): Entity[] {
        return this._scene.filterVisible(
            (entity: Entity) => 
                entity.getRenderer() &&
                entity.getRenderer().getName() === this._name &&
                entity.getMaterial() && 
                entity.getMaterial().getName() === material.getName() &&
                (
                    this._maximumRenderDistance < 0 ||
                    this._camera.getTransform().getTranslation().distanceTo(entity.getTransform().getTranslation()) < this._maximumRenderDistance
                )
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

    public getCamera(): Camera { 
        return this._camera
    }
}

export default Renderer