import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import SimpleEntity from "../entities/SimpleEntity";

class LampConfig{

    constructor(public lamp: Lamp,public distance: number){

    }
}

class SimpleRenderer extends Renderer {

    private _projection: Matrix4;

    constructor(camera: CanvasCamera) {
        super('renderer1', camera)
        //this._projection = Mat4.perspective(70, window.innerWidth / window.innerHeight, 1, 1000)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })

        this._maximumRenderDistance = 150

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

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', this.getCamera().getView());
            const cameraPosition = this.getCamera().getTransform().getTranslation();
            shader.setVector3('u_camera_position',cameraPosition.negate())
            shader.setVector3('u_color',new Vector3(1,0.2,0.3));
            shader.setVector3("lightCamera.color.ambient", new Vector3(1,1,1));
            shader.setVector3("lightCamera.color.diffuse", new Vector3(0.5,0.5,0.5))
            shader.setVector3("lightCamera.color.specular",new Vector3(0.3,0.3,0.3));
            //shader.setFloat("u_light.cutOff",cos(toRadians(0))); AINDA NÃO SEI O QUE FAZER AQUI

            shader.setVector3("lightCamera.position",cameraPosition.negate())
            const distance = this.distanceConfig[100];
            shader.setFloat("lightCamera.distance.constant", distance[0]);
            shader.setFloat("lightCamera.distance.linear", distance[1])
            shader.setFloat("lightCamera.distance.quadratic",distance[2]);
            shader.setFloat("lightCamera.shininess",32)
            

            this.getEntitiesByMaterial(material).forEach((entity: Entity,index : number) => {
                (entity as SimpleEntity).getLampList().forEach((lamp, i) => {
                    
                    const path = `pointLights[${i}]`;
                    shader.setVector3(path+".color.ambient", lamp.color);
                    shader.setVector3(path+".color.diffuse", lamp.color)
                    shader.setVector3(path+".color.specular",lamp.color);
                    const distance = this.distanceConfig[lamp.distance];
                    shader.setFloat(path+".distance.constant", distance[0]);
                    shader.setFloat(path+".distance.linear", distance[1])
                    shader.setFloat(path+".distance.quadratic",distance[2]);
                    shader.setFloat(path+".shininess",lamp.shininess);
                    shader.setVector3(path+".position",lamp.getTransform().getTranslation().negate());
                    
                })
                
                shader.setInt("applyLight", entity instanceof Lamp ? 0 : 1);
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                material.getShader().setMatrix4x4('u_worldInverseTranspose',entity.getTransform().toMatrix().invert().transpose());
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })
            
            material.unbind()

        })


    }

    /*
    public render() {

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', this._camera.getView());
            const cameraPosition = this._camera.getTransform().getTranslation();
            shader.setVector3('u_camera_position',cameraPosition.negate())
            shader.setVector3('u_color',new Vector3(1,0.2,0.3));
            shader.setVector3("lightCamera.color.ambient", new Vector3(1,1,1));
            shader.setVector3("lightCamera.color.diffuse", new Vector3(0.5,0.5,0.5))
            shader.setVector3("lightCamera.color.specular",new Vector3(0.3,0.3,0.3));
            //shader.setFloat("u_light.cutOff",cos(toRadians(0))); AINDA NÃO SEI O QUE FAZER AQUI

            shader.setVector3("lightCamera.position",cameraPosition.negate())
            const distance = this.distanceConfig[100];
            shader.setFloat("lightCamera.distance.constant", distance[0]);
            shader.setFloat("lightCamera.distance.linear", distance[1])
            shader.setFloat("lightCamera.distance.quadratic",distance[2]);
            shader.setFloat("lightCamera.shininess",32)
            
            let lampCount = 0;
            const listLamps = new Map<string,LampConfig>();
            this.getEntitiesByMaterial(material).forEach((entity: Entity,index : number) => {
                if(entity instanceof Lamp){
                    const lamp = entity as Lamp;
                    const distance = lamp.getTransform().getTranslation().distanceTo(cameraPosition);
                    if(distance < 100 && !listLamps.has(lamp.getName())){
                        listLamps.set(lamp.getName(),new LampConfig(lamp,distance));
                    }
                    return;
                }
                /*
                    shader.setInt("applyLight",0);
                    //console.log(lamp.getTransform().getTranslation(),cameraPosition);
                    const path = `pointLights[${lampCount++}]`;

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
                }*
                
                shader.setInt("applyLight",1);
                shader.setVector3("u_resolution",new Vector3(0,0,0))
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                
                material.getShader().setMatrix4x4('u_worldInverseTranspose',entity.getTransform().toMatrix().invert().transpose());
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })
            if(listLamps.size > 0){
               Array.from(listLamps,([,value]) => value).sort((a,b) => {
                    if(a.distance > b.distance) return 1;
                    if(a.distance < b.distance) return -1;
                    return 0;
                }).slice(0,5).map(({lamp},index) => {
                    shader.setInt("applyLight",0);
                    //console.log(lamp.getTransform().getTranslation(),cameraPosition);
                    const path = `pointLights[${lampCount++}]`;

                    shader.setVector3(path+".color.ambient", lamp.color);
                    shader.setVector3(path+".color.diffuse", lamp.color)
                    shader.setVector3(path+".color.specular",lamp.color);
                    const distance = this.distanceConfig[lamp.distance];
                    shader.setFloat(path+".distance.constant", distance[0]);
                    shader.setFloat(path+".distance.linear", distance[1])
                    shader.setFloat(path+".distance.quadratic",distance[2]);
                    shader.setFloat(path+".shininess",lamp.shininess);
                    shader.setVector3(path+".position",lamp.getTransform().getTranslation().negate());
                    shader.setVector3("u_resolution",new Vector3(0,0,0))
                    material.getShader().setMatrix4x4('u_transform', lamp.getTransform().worldMatrix());
                    
                    material.getShader().setMatrix4x4('u_worldInverseTranspose',lamp.getTransform().toMatrix().invert().transpose());
                    lamp.getVAO().bind()
                    GLUtils.draw(lamp.getVAO().getLength())
                    lamp.getVAO().unbind();
                })
            }
            material.unbind()

        })

    }
    */
}

export default SimpleRenderer