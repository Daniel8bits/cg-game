import { Matrix4, Vector3 } from "@math.gl/core";
import DefaultMaterial from "@razor/appearance/material/DefaultMaterial";
import VBO from "@razor/buffer/VBO";
import Razor from "@razor/core/Razor";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import TextureLoader from "@razor/loader/TextureLoader";
import Material from "../../../../engine/appearance/material/Material";
import VAO from "../../../../engine/buffer/VAO";
import Entity from "../../../../engine/core/entities/Entity";
import Renderer from "../../../../engine/renderer/Renderer";
import Text from "../../../utils/Text";
import GuiEntity from "./GuiEntity";
import RectangleEntity from "./RectangleEntity";
import TextEntity from "./TextEntity";

type metric = "px" | "%";
type LengthMetric = `${number}${metric}`;

interface DialogPosition {
    vertical: 'top' | 'center' | 'bottom' | LengthMetric
    horizontal: 'left' | 'center' | 'right' | LengthMetric
}

class DialogEntity extends GuiEntity {

    private _text: TextEntity;
    private _rectangle: RectangleEntity;
    private paddingTop = 5;
    private paddingLeft = 5;
    private static _dialogs: Map<string, DialogEntity> = new Map;

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
        DialogEntity._dialogs.set(name, this);
    }

    public static getDialog(name: string) {
        return DialogEntity._dialogs.get(name);
    }

    public init(color: Vector3 = new Vector3(0.9, 0.9, 0.9)): void {
        this._rectangle = this.addRectangle(this.getName() + "_rectangle_left");
        this._rectangle.color = color;
        this._rectangle.getTransform().parent = this.getTransform();
        this._text = this.addText(this.getName() + "_text_rectangle_left");
        this._text.setText("")
        this._text.getTransform().setTranslation(new Vector3(this.paddingLeft, this.paddingTop, 1).negate())
        this._text.getTransform().setScale(new Vector3(2, 2, 2))
    }

    public setImage(image: Entity) {
        image.getTransform().setTranslation(new Vector3(0, 0, 1).negate());
        image.getTransform().setScale(new Vector3(0.09, 0.09, 1));
        this.getScene().add(image);
        image.getTransform().parent = this.getTransform();
    }

    public remove(){
        this._text.setText("");
        this._rectangle.setSize(0,0);
    }

    public updateText(name: string, position: DialogPosition) {
        this._text.setText(name);
        const length = name.toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, '').length;
        /* Tamanho */
        const diff = Math.abs(name.length - length) - 2;
        const width = 8 * 2 * length + this.paddingLeft * 2 + 8 * diff;
        const height = 8 * 2 + this.paddingTop * 2;
        this._rectangle.setSize(width, height);
        this.updatePosition(position);
        /* Posição */
    }

    public updatePosition(position: DialogPosition) {
        const { width, height } = this._rectangle.getSize();
        let top = 0, left = 0;
        switch (position.vertical) {
            case "center":
            case "bottom":
                top = Razor.CANVAS.height;
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
                    top = Razor.CANVAS.height * Number(x) / 100;
                }

        }
        switch (position.horizontal) {
            case "center":
            case "right":
                left = Razor.CANVAS.width;
                if (position.horizontal == "right") left -= width;
                if (position.horizontal == "center") left = left / 2 - width / 2;
                break;
            case "left":
                break;
            default:
                const [, x, metric] = position.vertical.split(/([0-9]+)(px|%)/);
                if (metric == "px") {
                    left = Number(x);
                } else {
                    left = Razor.CANVAS.width * Number(x) / 100;
                }
        }
        this.getTransform().setTranslation(new Vector3(left, top, 0).negate())

    }

    public animateText(name: string, wordPerSeconds = 1, position: DialogPosition, callback?: Function) {
        let i = 1;
        const length = name.length;
        const intervalText = setInterval(() => {
            if (i == length) {
                if(callback) callback.apply(this);
                clearInterval(intervalText)
            }
            this.updateText(name.slice(0, i++), position);
        }, 1 / wordPerSeconds * 1000);
    }

    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {

    }
}

export default DialogEntity