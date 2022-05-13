import VAO from "../../engine/buffer/VAO";
import Entity from "../../engine/core/Entity";
import Renderer from "../../engine/renderer/Renderer";
import Shader from "../../engine/tools/Shader";

class SimpleEntity extends Entity {
    public constructor(name: string, vao: VAO, shader: Shader, renderer: Renderer) {
        super(name, vao, shader, renderer);
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