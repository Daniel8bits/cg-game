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

export enum DialogEntityStates {
    DONE,
    ANIMATING
}

class DialogEntity extends GuiEntity {

    private _textEntity: TextEntity;
    private _rectangle: RectangleEntity;
    private paddingTop = 5;
    private paddingLeft = 5;
    private static _dialogs: Map<string, DialogEntity> = new Map;

    private _text: string
    private _textPosition: DialogPosition
    private _state: DialogEntityStates
    private _animationTime: number
    private _animationCounter: number
    private _animationWordCounter: number
    private _animationCallback: (dialog: DialogEntity) => void

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
        DialogEntity._dialogs.set(name, this);
        this._resetAnimation()
    }

    public static getDialog(name: string) {
        return DialogEntity._dialogs.get(name);
    }

    public init(color: Vector3 = new Vector3(0.9, 0.9, 0.9)): void {
        this._rectangle = this.addRectangle(this.getName() + "_rectangle_left");
        this._rectangle.color = color;
        this._rectangle.getTransform().parent = this.getTransform();
        this._textEntity = this.addText(this.getName() + "_text_rectangle_left");
        this._textEntity.setText("")
        this._textEntity.getTransform().setTranslation(new Vector3(this.paddingLeft, this.paddingTop, 1).negate())
        this._textEntity.getTransform().setScale(new Vector3(2, 2, 2))
    }

    public setImage(image: Entity) {
        image.getTransform().setTranslation(new Vector3(0, 0, 1).negate());
        image.getTransform().setScale(new Vector3(0.09, 0.09, 1));
        this.getScene().add(image);
        image.getTransform().parent = this.getTransform();
    }

    public remove(){
        this._textEntity.setText("");
        this._rectangle.setSize(0,0);
        this._resetAnimation()
    }

    private _resetAnimation(): void {
        this._state = DialogEntityStates.DONE
        this._text = ""
        this._animationTime = 0
        this._animationCounter = 0
        this._animationWordCounter = 0
        this._animationCallback = null
    }

    public updateText(name: string, position: DialogPosition) {
        this._textEntity.setText(name);
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

    public animateText(name: string, wordPerSeconds = 1, position: DialogPosition, callback?: (dialog: DialogEntity) => void) {
        this._text = name
        this._animationTime = 1 / wordPerSeconds
        this._textPosition = position
        this._animationCallback = callback
        this._state = DialogEntityStates.ANIMATING
    }

    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {

        if(this._state === DialogEntityStates.ANIMATING) {

            if(this._animationCounter >= this._animationTime) {
                if (this._animationWordCounter >= this._text.length) {
                    if(this._animationCallback) {
                        this._animationCallback(this);
                    }
                    this._state = DialogEntityStates.DONE
                }
                this._animationWordCounter += Math.floor(this._animationCounter / this._animationTime)
                this.updateText(this._text.slice(0, this._animationWordCounter), this._textPosition);
                this._animationCounter -= this._animationTime;
            }

            this._animationCounter += delta

        }

    }
}

export default DialogEntity