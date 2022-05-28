import { Matrix4 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../engine/appearance/material/Material";
import VAO from "../../engine/buffer/VAO";
import Entity from "../../engine/core/entities/Entity";
import Renderer from "../../engine/renderer/Renderer";

class SimpleEntity extends Entity {
    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
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

export default SimpleEntity