import Material from "../../engine/appearance/material/Material";
import VAO from "../../engine/buffer/VAO";
import Entity from "../../engine/core/entities/Entity";
import Renderer from "../../engine/renderer/Renderer";
import Lamp from "./Lamp";

class SimpleEntity extends Entity {

    private _lampList: Lamp[]

    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
        this._lampList = []
    }
    public update(time: number, delta: number): void {
        /*

        this.getTransform().getRotation().y += 15 * delta
        this.getTransform().getRotation().x += 20 * delta

        if(this.getTransform().getRotation().y >= 360) {
            this.getTransform().getRotation().y %= 360
        }

        if(this.getTransform().getRotation().x >= 360) {
            this.getTransform().getRotation().x %= 360
        }

        */

    }

    public setLampList(lampList: Lamp[]): void {
        this._lampList = lampList
    }

    public getLampList(): Lamp[] {
        return this._lampList
    }
}

export default SimpleEntity