import { Matrix4, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import Entity from "@razor/core/entities/Entity";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Renderer from "@razor/renderer/Renderer";
import GameTest from "src/game/GameTest";
import Texture from '@razor/appearance/Texture';
import DefaultMaterial from "@razor/appearance/material/DefaultMaterial";
import Razor from "@razor/core/Razor";
import FileUtils from "@razor/utils/FileUtils";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";

class CreditsEntity extends Entity {

    public static readonly CREDITS_ENTITY: string = "creditsEntity"

    private _texture : Texture
    private color : Vector3 = new Vector3(0,0,0);
    public alpha : number = 1;

    private _height: number
    private _running: boolean


    public constructor(renderer: Renderer) {
        super(CreditsEntity.CREDITS_ENTITY, null,null, renderer);
        this._running = false
        this.resetHeight()
        
        this._loadCredits()

        this.setVAO(ResourceManager.getVAO("effect"));
        this.setMaterial(new DefaultMaterial(
            CreditsEntity.CREDITS_ENTITY,
            ResourceManager.getShader('text'),
            this._texture
        ))
        ResourceManager.addMaterials([this.getMaterial()]);
        this.getMaterial().create();
        this.getTransform().setTranslation(new Vector3(-Razor.CANVAS.width/2 - 32, this._height, -1))
        this.getTransform().setScale(new Vector3(Razor.CANVAS.width/2, (Razor.CANVAS.height*3)/2, 1))
    }

    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {
        if(this._running) {
            this._height += delta*20
            this.getTransform().setY(this._height)
            if(this._height >= Razor.CANVAS.height) {
                this.resetHeight()   
            }
        }
    }

    private _loadCredits(): void {
        const canvas = document.createElement("canvas");
        canvas.width = Razor.CANVAS.width;
        canvas.height = Razor.CANVAS.height*3;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px serif';
        ctx.fillStyle = "white";

        FileUtils.load("/resources/CREDITS", 
            (file) => {
                const splitText = file.split("\n");
                for(let i=0;i<splitText.length;i++){
                    ctx.fillText(splitText[i], 0, 50 + 20 * i);
                }
                const data = new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data)
                this._texture = new Texture(ctx.canvas.width, ctx.canvas.height)
                this._texture.create();
                this._texture.setData(data);
            },
            function onError(err: string) {
                new Error(`Error trying to load credits.\n ${err}`)
            }
        )
        
    }

    public resetHeight(): void {
        this._height = -Razor.CANVAS.height*2.5
    }

    public setRunning(running: boolean): void {
        this._running = running
    }
}

export default CreditsEntity