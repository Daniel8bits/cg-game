import { Matrix4, Vector3, cos, Vector4 } from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import Razor from "@razor/core/Razor";
import ImageEntity from "../entities/gui/common/ImageEntity";
import BloomRenderer from "./BloomRenderer";

class GuiRenderer extends Renderer {

    private _projection: Matrix4;

    constructor(camera: CanvasCamera) {
        super('guirenderer',camera)
        this._projection = new Matrix4().ortho({
            top: 0,
            left: 0,
            right: Razor.CANVAS.width,
            bottom: Razor.CANVAS.height,
            near: -1,
            far: 100
        })
    }

    public render() {
        gl.disable(gl.CULL_FACE)
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
/*
        const rectangleMaterial = ResourceManager.getMaterial("rectangle")
        const textMaterial = ResourceManager.getMaterial("text")

        this.getEntitiesByMaterial(rectangleMaterial)
            .concat(this.getEntitiesByMaterial(textMaterial))
            .sort((entityA, entityB) => entityA.getTransform().getZ() - entityB.getTransform().getZ())
            .forEach(entity => {
                entity.getMaterial().bind()
                const shader = entity.getMaterial().getShader();
                shader.setFloat('u_onlyLights',FrameRenderer.mode == "mascara" ? 1 : 0);
                shader.setMatrix4x4('u_projection', this._projection);

                if('color' in entity){
                    //@ts-ignore
                    let color = entity.color;
                    //@ts-ignore
                    color = new Vector4(color.x,color.y,color.z,'alpha' in entity ? entity.alpha : 0.1);
                    shader.setVector4('u_color',color);
                }

                shader.setMatrix4x4('u_transform', entity.getTransform().worldMatrixIgnoringZ());
                entity.render();
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
                entity.getMaterial().unbind()
            })
*/

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            shader.setFloat('u_onlyLights',BloomRenderer.mode == "mascara" ? 1 : 0);
            shader.setMatrix4x4('u_projection', this._projection);
            this.getEntitiesByMaterial(material).forEach((entity: Entity, index: number) => {
                if('color' in entity){
                    //@ts-ignore
                    let color = entity.color;
                    //@ts-ignore
                    color = new Vector4(color.x,color.y,color.z,'alpha' in entity ? entity.alpha : 0.1);
                    shader.setVector4('u_color',color);
                }

                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                entity.render();
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();

            })

            material.unbind()

        })
       // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.enable(gl.CULL_FACE)

    }
}

export default GuiRenderer