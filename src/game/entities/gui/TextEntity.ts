import { Matrix4 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";

class TextEntity extends Entity {

    private _oldText: string = "";
    private _currentText: string = "";

    public constructor(name: string,  material: Material, renderer: Renderer) {
        super(name, null, material, renderer);
        /*
        ResourceManager.loadVAO([{
            name,
            objectData: () => {
               
            }
        }])*/
        const vao = new VAO([],2);
        vao.addEmpty(2);
        vao.create();
        this.setVAO(vao);
//        return vao;
        //this.setVAO(ResourceManager.getVAO(name));
    }

    public setText(text: string) {
        this._currentText = text;
    }

    public render(): void {
        if(this._currentText == this._oldText) return;
        const text = Text.render(this._currentText);
        console.log(this.getVAO())
        this.getVAO().getVbo(0).setBuffer(text.arrays.position);
        this.getVAO().getVbo(1).setBuffer(text.arrays.texcoord);
        this.getVAO().create();
        this._oldText = this._currentText;
    }

    public update(time: number, delta: number): void {

    }
}

export default TextEntity