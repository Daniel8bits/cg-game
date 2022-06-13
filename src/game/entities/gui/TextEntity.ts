import { Matrix4, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import Razor from "@razor/core/Razor";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/entities/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import { PositionRelative, PositionOptions } from "./gui";

class TextEntity extends Entity {

    private _oldText: string = "";
    private _currentText: string = "";

    public constructor(name: string, material: Material, renderer: Renderer) {
        super(name, null, material, renderer);
        const vao = new VAO([], 2);
        vao.addEmpty(2);
        vao.create();
        this.setVAO(vao);
    }

    public setText(text: string) {
        this._currentText = text;
    }

    public render(): void {
        if (this._currentText == this._oldText) return;
        const text = Text.render(this._currentText);
        this.getVAO().getVbo(0).setBuffer(text.arrays.position);
        this.getVAO().getVbo(1).setBuffer(text.arrays.texcoord);
        this.getVAO().create();
        this._oldText = this._currentText;
    }

    public getSize() {
        const scale = this.getTransform().getScale();
        return { width: scale[0], height: scale[1] }
    }

    public updatePosition(position: PositionOptions, relativeTo: PositionRelative = "Razor") {
        const { width, height } = this.getSize();
        const relative = {
            width: relativeTo == "Razor" ? Razor.CANVAS.width : relativeTo.getTranslation().negate().x,
            height: relativeTo == "Razor" ? Razor.CANVAS.height : relativeTo.getTranslation().negate().y,
            z: relativeTo == "Razor" ? 1 : relativeTo.getTranslation().negate().z - 2
        }
        let top = 0, left = 0;
        if (relativeTo != "Razor") {
            top = relative.height;
            left = relative.width;
            console.log(relative)
        }
        switch (position.vertical) {
            case "center":
            case "bottom":
                top = relative.height;
                if (position.vertical == "bottom") top = - height;
                if (position.vertical == "center") top = top / 2 - height / 2;
                break;
            case "top":
                break;
            default:
                const [, x, metric] = position.vertical.split(/([0-9]+)(px|%)/);
                if (metric == "px") {
                    top = Number(x);
                } else {
                    top = relative.height * Number(x) / 100;
                }

        }
        switch (position.horizontal) {
            case "center":
            case "right":
                left = relative.width;
                if (position.horizontal == "right") left -= width;
                if (position.horizontal == "center") left = left / 2 - width / 2;
                break;
            case "left":
                break;
            default:
                const [, x, metric] = position.horizontal.split(/([0-9]+)(px|%)/);
                if (metric == "px") {
                    left = Number(x);
                } else {
                    left = relative.width * Number(x) / 100;
                }
        }
        console.log(top, left)
        this.getTransform().setTranslation(new Vector3(left, top, relative.z).negate())
    }

    public update(time: number, delta: number): void {

    }
}

export default TextEntity