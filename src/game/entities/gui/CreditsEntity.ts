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

class CreditsEntity extends Entity {

    public static readonly CREDITS_ENTITY: string = "creditsEntity"

    private _texture : Texture
    private color : Vector3 = new Vector3(0,0,0);
    public alpha : number = 1;


    public constructor(renderer: Renderer) {
        super(CreditsEntity.CREDITS_ENTITY, null,null, renderer);
        
        this._loadCredits()

        this.setVAO(ResourceManager.getVAO("effect"));
        this.setMaterial(new DefaultMaterial(
            CreditsEntity.CREDITS_ENTITY,
            ResourceManager.getShader('text'),
            this._texture
        ))
        ResourceManager.addMaterials([this.getMaterial()]);
        this.getMaterial().create();
        const aspect = Razor.CANVAS.height/Razor.CANVAS.width;
        this.getTransform().setTranslation(new Vector3(800,400,1).negate())
        this.getTransform().setScale(new Vector3(800,800 * aspect,1));
        
    }

    public update(time: number, delta: number): void {
    }

    private _loadCredits(): void {
        const canvas = document.createElement("canvas");
        canvas.width = Razor.CANVAS.width;//Razor.CANVAS.width;
        canvas.height = Razor.CANVAS.height;//Razor.CANVAS.height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '20px serif';
        ctx.fillStyle = "white";

        FileUtils.load("/resources/CREDITS", 
            (file) => {
                const splitText = file.split("\n");
                for(let i=0;i<splitText.length;i++){
                    ctx.fillText(splitText[i], 0,50 + 20 * i);
                }
                const data = new Uint8Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data)
                this._texture = new Texture(ctx.canvas.width,ctx.canvas.height)
                this._texture.create();
                this._texture.setData(data);
            },
            function onError(err: string) {
                new Error(`Error trying to load credits.\n ${err}`)
            }
        )
        
    }
}

export default CreditsEntity