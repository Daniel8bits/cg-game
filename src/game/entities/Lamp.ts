import Material from "../../engine/appearance/material/Material";
import VAO from "../../engine/buffer/VAO";
import Entity from "../../engine/core/Entity";
import Renderer from "../../engine/renderer/Renderer";

class Lamp extends Entity {

    public _color : number[] = [1.0,1.0,1.0];

    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
        this._color = [Math.random(),Math.random(),Math.random()];
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
}

export default Lamp;