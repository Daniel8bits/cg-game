import { Matrix4 } from "@math.gl/core";
import DefaultMaterial from "@razor/appearance/material/DefaultMaterial";
import VBO from "@razor/buffer/VBO";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import TextureLoader from "@razor/loader/TextureLoader";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/entities/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import GuiEntity from "./GuiEntity";

class ImageEntity extends GuiEntity {

    private size = { width: 0, height: 0 };
    public constructor(name: string, pathname: string, renderer: Renderer) {
        super(name, renderer);
        this.createMaterial(pathname).then(() => {

            this.createVAO();
        })
    }
    private createMaterial(pathname: string) {
        return new Promise((resolve) => {

            new TextureLoader().load(pathname, (texture) => {
                this.size = {
                    width: texture.getWidth(),
                    height: texture.getHeight()
                }
                const defaultMaterial = new DefaultMaterial(this.getName(), ResourceManager.getShader("image"), texture)
                defaultMaterial.create();
                this.setMaterial(defaultMaterial)
                ResourceManager.addMaterials([defaultMaterial]);
                resolve(null);
            });
        })
    }
    private createVAO() {
        const vbo = [];
        var x1 = 0;
        var x2 = 0 + this.size.width;
        var y1 = 0;
        var y2 = 0 + this.size.height;
        vbo.push(new VBO(new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), 2, true));
        vbo.push(new VBO(new Float32Array([0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,]), 2, true));
        const vao = new VAO(vbo, 2);
        vao.create();
        this.setVAO(vao);

    }

    public update(time: number, delta: number): void {

    }
}

export default ImageEntity