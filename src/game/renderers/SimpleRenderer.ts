import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Mat4 from "../../engine/math/Mat4";
import Entity from "../../engine/core/Entity";
import Vec3 from "../../engine/math/Vec3";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";

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

    private distanceConfig = {
        7: [1.0,	0.7,	1.8],
        13:[1.0,	0.35,	0.44],
        20:[1.0,	0.22,	0.20],
        32:[1.0,	0.14,	0.07],
        50:[1.0,	0.09,	0.032],
        65:[1.0,	0.07,	0.017],
        100:[1.0,	0.045,	0.0075],
        160:[1.0,	0.027,	0.0028],
        200:[1.0,	0.022,	0.0019],
        325:[1.0,	0.014,	0.0007],
        600:[1.0,	0.007,	0.0002],
        3250: [1.0,	0.0014,	0.000007]
    };

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
            shader.setMatrix4x4('u_view', this._camera.getView());
            shader.setVector3('u_color',new Vector3(1,0.2,0.3));
            shader.setVector3("lightCamera.color.ambient", new Vector3(1,1,1));
            shader.setVector3("lightCamera.color.diffuse", new Vector3(0.5,0.5,0.5))
            shader.setVector3("lightCamera.color.specular",new Vector3(0.3,0.3,0.3));
            //shader.setFloat("u_light.cutOff",cos(toRadians(0))); AINDA NÃO SEI O QUE FAZER AQUI

            shader.setVector3("lightCamera.position",this._camera.getTransform().getTranslation().negate())
            const distance = this.distanceConfig[100];
            shader.setFloat("lightCamera.distance.constant", distance[0]);
            shader.setFloat("lightCamera.distance.linear", distance[1])
            shader.setFloat("lightCamera.distance.quadratic",distance[2]);
            shader.setFloat("lightCamera.shininess",32)
            
            this.getEntitiesByMaterial(material).forEach((entity: Entity,index : number) => {
                if(entity instanceof Lamp){
                    shader.setInt("applyLight",0);
                    const lamp = entity as Lamp;
                    const path = `pointLights[${index}]`;

                    shader.setVector3(path+".color.ambient", lamp.color);
                    shader.setVector3(path+".color.diffuse", lamp.color)
                    shader.setVector3(path+".color.specular",lamp.color);
                    const distance = this.distanceConfig[lamp.distance];
                    shader.setFloat(path+".distance.constant", distance[0]);
                    shader.setFloat(path+".distance.linear", distance[1])
                    shader.setFloat(path+".distance.quadratic",distance[2]);
                    shader.setFloat(path+".shininess",lamp.shininess);
                    shader.setVector3(path+".position",entity.getTransform().getTranslation().negate());
                }else{
                    shader.setInt("applyLight",1);
                }
                
                shader.setVector3("u_resolution",new Vector3(0,0,0))
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