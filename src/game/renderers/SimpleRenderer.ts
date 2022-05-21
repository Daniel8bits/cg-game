import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Mat4 from "../../engine/math/Mat4";
import Entity from "../../engine/core/Entity";
import Vec3 from "../../engine/math/Vec3";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";

class SimpleRenderer extends Renderer {

    private _projection: Matrix4;
    private _camera: CanvasCamera

    constructor(camera: CanvasCamera) {
        super('renderer1')
        this._camera = camera
        //this._projection = Mat4.perspective(70, window.innerWidth / window.innerHeight, 1, 1000)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })
        /*
        this._ortho = Mat4.orthographic(
            0, 
            window.innerWidth,
            0,
            window.innerHeight,
            -1,
            100
        );
        */
    }

    public render() {

        /*
        ResourceManager.forEachShader((shader) => {
            shader.bind();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', Mat4.view(
                this._camera.getTransform().getTranslation(),
                this._camera.getTransform().getRotation(),
            ));

            gl.activeTexture(gl.TEXTURE0);
            ResourceManager.getTexture('level-texture').bind();
            shader.setInt('u_texture', 0)
            //shader.setTexture('u_texture');

            this.getEntitiesByShader(shader). forEach((entity: Entity) => {
                shader.setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })
        })
        */

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', this._camera.getView())
            shader.setVector3('u_camera_view', this._camera.getTransform().getTranslation());
            shader.setVector3('u_light.position',new Vector3(20,0,30).negate())//this._camera.getTransform().getTranslation().negate());
            shader.setVector3('u_light.direction',new Vector3(10,0,10))//this._camera.getTransform().getRotation());
            shader.setFloat("u_light.cutOff",cos(toRadians(12)));
            shader.setFloat("u_shininess",32);//new Vector3(20,0,30).negate())//,
            shader.setVector3('u_lightColor', [1,1,1]);
            shader.setVector3('u_diffuseColor', [0.5,0.5,0.5])
            shader.setVector3('u_specularColor',[0.3,0.3,0.3]);
            /*
            shader.setMatrix4x4('');
            material.getShader().setMatrix4x4('u_view', Mat4.view(
                this._camera.getTransform().getTranslation(),
                this._camera.getTransform().getRotation(),
            ));
            */

            this.getEntitiesByMaterial(material).forEach((entity: Entity) => {
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                
                material.getShader().setMatrix4x4('u_worldInverseTranspose',entity.getTransform().toMatrix().invert().transpose());
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })

            material.unbind()

        })

    }
}

export default SimpleRenderer