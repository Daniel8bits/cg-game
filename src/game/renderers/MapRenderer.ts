import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import MapEntity from "../entities/MapEntity";
import FrameRenderer from "./FrameRenderer";
import DoorPanelEntity from "../entities/DoorPanelEntity";

class MapRenderer extends Renderer {

    private _projection: Matrix4;

    constructor(camera: CanvasCamera) {
        super('renderer1', camera)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })

        this._maximumRenderDistance = 110
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
            shader.setInt('onlyLights',FrameRenderer.mode == "mascara" ? 1 : 0);

            this.getEntitiesByMaterial(material).forEach((entity: Entity,index : number) => {
                if(!(entity instanceof MapEntity || entity instanceof Lamp)) {
                    return;
                }
                if(entity instanceof MapEntity) {
                    (entity as MapEntity).getLampList().forEach((lamp, i) => {
                        
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
                }

                if(entity instanceof DoorPanelEntity) {
                    shader.setInt('u_locked', Number((entity as DoorPanelEntity).isLocked()))
                }
                
                if(entity instanceof Lamp) {
                    shader.setInt("applyLight", 0);
                    shader.setVector3('u_lightColor', entity.color)
                } else {
                    shader.setInt("applyLight", 1);
                }

                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                material.getShader().setMatrix4x4('u_worldInverseTranspose',entity.getTransform().toMatrix().invert().transpose());
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })
            
            material.unbind()

        })


    }
}

export default MapRenderer