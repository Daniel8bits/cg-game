import StaticEntity from '@razor/core/entities/StaticEntity';
import Scene from '@razor/core/scenes/Scene';
import Updater from '@razor/core/updater/Updater';
import Hitbox from '@razor/physics/hitboxes/HitBox';
import Material from "../../engine/appearance/material/Material";
import VAO from "../../engine/buffer/VAO";
import Renderer from "../../engine/renderer/Renderer";
import { IEntityWithLight } from './IEntityWithLight';
import Lamp from "./Lamp";

class MapEntity extends StaticEntity implements IEntityWithLight {

    private _lampList: Lamp[]

    public constructor(
      name: string, 
      hitbox: Hitbox,
      friction: number,
      vao: VAO, 
      material: Material, 
      renderer: Renderer
    ) {
        super(name, hitbox, friction, vao, material, renderer);
        this._lampList = []
    }

    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {
        
    }

    public setLampList(lampList: Lamp[]): void {
        this._lampList = lampList
    }

    public getLampList(): Lamp[] {
        return this._lampList
    }
}

export default MapEntity