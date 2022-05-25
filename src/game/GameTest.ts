import { Vector3, Quaternion, Matrix4 } from "@math.gl/core"
import GameCore from '@razor/core/GameCore'
import ResourceManager from '../engine/core/ResourceManager'
import Scene from '../engine/core/Scene';
import SimpleRenderer from './renderers/SimpleRenderer'
import SimpleEntity from './entities/SimpleEntity'
import Vec3 from '../engine/math/Vec3';
import CanvasCamera from './CanvasCamera'
import DefaultMaterial from '../engine/appearance/material/DefaultMaterial';
import Orientation from "@razor/math/Orientation";
import Lamp from "./entities/Lamp";
import GuiRenderer from "./renderers/GuiRenderer";

import Event from "src/event"; // @temp
import FileUtils from "@razor/utils/FileUtils";
import Text from "./gui/Text";
import VAO from "@razor/buffer/VAO";
import VBO from "@razor/buffer/VBO";
import TextTexture from "./gui/TextTexture";
import { gl } from "@razor/gl/GLUtils";
import Razor from "@razor/core/Razor";

class GameTest extends GameCore {

    private _camera: CanvasCamera

    public constructor() {
        super()
    }

    public start() {

        this._camera = new CanvasCamera('main', new Vector3(5, 0, 35), new Orientation(0, 90));

        // ========= SHADER ==========

        /* Shader com Iluminação */
        ResourceManager.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/shader1/vert.glsl',
            fragmentShaderPathname: '/resources/shader/shader1/frag.glsl'
        }])

        /* Shader sem Iluminação */
        ResourceManager.loadShader([{
            name: 'gui',
            vertexShaderPathname: '/resources/shader/gui/vert.glsl',
            fragmentShaderPathname: '/resources/shader/gui/frag.glsl'
        }])

        /* Shader de Texto */
        ResourceManager.loadShader([{
            name: 'text',
            vertexShaderPathname: '/resources/shader/text/vert.glsl',
            fragmentShaderPathname: '/resources/shader/text/frag.glsl'
        }])

        ResourceManager.loadTextures([
            {
                name: 'level',
                pathname: '/resources/objects/level/level-texture.png'
            },
            {
                name: 'elevator',
                pathname: '/resources/objects/level/elevator-texture.png'
            },
            {
                name: 'elevator-door',
                pathname: '/resources/objects/doors/elevator-door-texture.png'
            },
            {
                name: 'lamp',
                pathname: '/resources/objects/lamp/lamp-texture.png'
            },
            {
                name: 'text',
                /*
                texture: () => {
                    var image = new Image();
                    image.src = "/resources/objects/8x8-font.png";
                    const texture = new TextTexture(image);

                    return texture;
                }*/
                pathname: '/resources/objects/8x8-font.png'
            }
        ])

        ResourceManager.addMaterials([
            new DefaultMaterial(
                'level',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('level'),
            ),
            new DefaultMaterial(
                'elevator',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('elevator'),
            ),
            new DefaultMaterial(
                'elevator-door',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('elevator-door'),
            ),
            new DefaultMaterial(
                'lamp',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('lamp'),
            ),
            new DefaultMaterial(
                'gui',
                ResourceManager.getShader('gui')
            ),
            new DefaultMaterial(
                'text',
                ResourceManager.getShader('text'),
                ResourceManager.getTexture('text'),
            )
        
        ])
            .forEachMaterial((material) => {
                material.create()
            })

        ResourceManager.loadVAO([
            {
                name: 'level',
                objectData: '/resources/objects/level/level.obj'
            },
            {
                name: 'hall',
                objectData: '/resources/objects/level/hall.obj'
            },
            {
                name: 'elevator',
                objectData: '/resources/objects/level/elevator.obj'
            },
            {
                name: 'elevator-door',
                objectData: '/resources/objects/doors/elevator-door.obj'
            },
            {
                name: 'lamp',
                objectData: '/resources/objects/lamp/lamp.obj'
            },
            {
                name: 'text',
                objectData: () => {
                    const text = Text.render("cd");
                    const vbos = [];
                    vbos.push(new VBO(text.arrays.position, 2, true, gl.DYNAMIC_DRAW));
                    vbos.push(new VBO(text.arrays.texcoord, 2, true, gl.DYNAMIC_DRAW));
                    return new VAO(vbos,2);
                }
            },
            {
                name: 'gui',
                objectData: () => {
                    const width = 100;
                    const height = 100;
                    const positions = [
                        0,0,
                        0,width,
                        width,height,
                        width,height,
                        width,0,
                        0,0
                    ]
                    return new VAO([new VBO(new Float32Array(positions),2,true)], 2);
                }
            }
        ])
            .forEachVAO((vao) => {
                vao.create();
            })


        const guiRenderer = new GuiRenderer(this._camera);
        this.getRenderStrategy().add(guiRenderer)
        const simpleRenderer = new SimpleRenderer(this._camera);
        this.getRenderStrategy().add(simpleRenderer)

        this.getSceneManager().add(new Scene('scene1'), true)

        this.getSceneManager().get("scene1").add(new Lamp(
            'lamp',
            ResourceManager.getVAO("lamp"),
            ResourceManager.getMaterial("lamp"),
            simpleRenderer,
            new Vector3(0.6,0.6,0.6)
        ));

        const entity4 = this.getSceneManager().get('scene1').get('lamp');
        entity4.getTransform().setTranslation(new Vector3(20, 0, 30))

        this.getSceneManager().get("scene1").add(new Lamp(
            'lamp2',
            ResourceManager.getVAO("lamp"),
            ResourceManager.getMaterial("lamp"),
            simpleRenderer,
            new Vector3(0.6,0.4,0.2)
        ));

        const entity5 = this.getSceneManager().get('scene1').get('lamp2');
        entity5.getTransform().setTranslation(new Vector3(-20, 0, -30))
        
        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'guileft',
            ResourceManager.getVAO("gui"),
            ResourceManager.getMaterial("gui"),
            guiRenderer
        ));
        const guileft = this.getSceneManager().get('scene1').get('guileft');
        const bottom = -Razor.CANVAS.height + 100;
        guileft.getTransform().setTranslation(new Vector3(0,bottom,0))

        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'guiright',
            ResourceManager.getVAO("gui"),
            ResourceManager.getMaterial("gui"),
            guiRenderer
        ));
        const guiright = this.getSceneManager().get('scene1').get('guiright');
        guiright.getTransform().setTranslation(new Vector3(-Razor.CANVAS.width + 100,bottom,0))
        //test.getTransform().setScale(new Vector3(0.1, 0.3,0.1))
        
        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'text',
            ResourceManager.getVAO("text"),
            ResourceManager.getMaterial("text"),
            simpleRenderer
        ));
        const text = this.getSceneManager().get('scene1').get('text');
        text.getTransform().setTranslation(new Vector3(15, 2, 25))
        text.getTransform().setRotation(new Orientation(0, 90))
        const translation = text.getTransform().getTranslation();
        /* start Gambiarra temporária */
        var fromEye = normalize(translation);
        var amountToMoveTowardEye = 150;  // because the F is 150 units long

        var desiredTextScale = -1 / gl.canvas.height * 2;  // 1x1 pixels
        var viewZ = translation[2] - fromEye[2] * amountToMoveTowardEye;
        var scale = viewZ * desiredTextScale;
        text.getTransform().setScale(new Vector3(scale,scale,1));
        /* end Gambiarra temporária */

        Event.trigger("loadScene", this.getSceneManager().getActive());

        this.importAll()
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        this._camera.update(delta)
    }

    public render() {
        super.render();
    }


    public importAll(): void {

        interface EntityImportJSON {
          [name: string]: {
            translation: {
              x: number
              y: number
              z: number
            },
            rotation: {
              x: number
              y: number
              z: number
            },
            scale: {
              x: number
              y: number
              z: number
            },
          }
        }

        function getCorrespondingMaterialName(object: string): string {
            switch (object) {
                case 'hall':
                    return 'level'
                default:
            }
            return object
        }
    
        FileUtils.load('/resources/entities.json',
          (data) => {
    
            const entities: EntityImportJSON = JSON.parse(data)
    
            Object.keys(entities).forEach(key => {
              const data = entities[key]
    
              const vaoName = ((): string => {
                for(let i = key.length-1; i >= 0; i--) {
                  if(key[i] === '_') {
                    return key.substring(0, i)
                  }
                }
                return '';
              })();
    
              const entity = new SimpleEntity(
                key,
                ResourceManager.getVAO(vaoName), 
                ResourceManager.getMaterial(getCorrespondingMaterialName(vaoName)),
                this.getRenderStrategy().get('renderer1')
              )
    
              entity.getTransform().setTranslation(new Vector3(
                data.translation.x,
                data.translation.y,
                data.translation.z,
              ))
              entity.getTransform().setRotation(new Orientation(
                data.rotation.x,
                data.rotation.y*2,
                data.rotation.z,
              ))
              entity.getTransform().setScale(new Vector3(
                data.scale.x,
                data.scale.y,
                data.scale.z,
              ))
    
              this.getSceneManager().getActive().add(entity)
    
            })
    
    
          },
          function onError(err) {
            console.error('Could not import entities from json: ', err);
          },
        )
      } 


}

function normalize(v) {
    const dst = new Float32Array(3);
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
        dst[0] = v[0] / length;
        dst[1] = v[1] / length;
        dst[2] = v[2] / length;
    }
    return dst;
}
export default GameTest