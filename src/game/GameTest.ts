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
import Text from "./utils/Text";
import VAO from "@razor/buffer/VAO";
import VBO from "@razor/buffer/VBO";
import { gl } from "@razor/gl/GLUtils";
import Razor from "@razor/core/Razor";
import TextEntity from "./entities/gui/TextEntity";
import GuiEntity from "./entities/gui/GuiEntity";

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
                pathname: '/resources/objects/8x8-font.png'
            }
        ])
        //const textTexture = ResourceManager.getTexture("text");

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
                'rectangle',
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
                    
                    //const text = Text.render("vida");
                    //const vbos = [];
                    //vbos.push(new VBO(new Float32Array([]), 2, true, gl.DYNAMIC_DRAW));
                    //vbos.push(new VBO(new Float32Array([]), 2, true, gl.DYNAMIC_DRAW));
                    const vao = new VAO([],2);
                    vao.addEmpty(2);
                    return vao;
                }
            },
            {
                name: 'rectangle',
                objectData: () => {
                    /*const width = 200;
                    const height = 100;
                    var x1 = 0;
                    var x2 = 0 + width;
                    var y1 = 0;
                    var y2 = 0 + height;
                    const positions = [
                        x1, y1,
                        x2, y1,
                        x1, y2,
                        x1, y2,
                        x2, y1,
                        x2, y2,
                    ]
                    return new VAO([new VBO(new Float32Array(positions),2,true)], 2);
                    */
                    const vao = new VAO([],2);
                    vao.addEmpty(1);
                    return vao;
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
        
        const bottom = -Razor.CANVAS.height + 100;
        const guileft = new GuiEntity('guileft',guiRenderer) as GuiEntity;
        guileft.getTransform().setTranslation(new Vector3(0,bottom,0));

        this.getSceneManager().get("scene1").add(guileft);
        
        const rectangle= guileft.addRectangle("rectangle_left");
        rectangle.setSize(200,100);
        this.getSceneManager().get("scene1").add(rectangle);
        const text = guileft.addText("text");
        this.getSceneManager().get("scene1").add(text);

        this.getSceneManager().get("scene1").add(new GuiEntity(
            'guiright',
            guiRenderer
        ));
        const guiright = this.getSceneManager().get('scene1').get('guiright');
        guiright.getTransform().setTranslation(new Vector3(-Razor.CANVAS.width + 100,bottom,0))
/*
        this.getSceneManager().get("scene1").add(new TextEntity(
            'text',
            ResourceManager.getVAO("text"),
            ResourceManager.getMaterial("text"),
            guiRenderer
        ));
        const text = this.getSceneManager().get('scene1').get('text');
        text.transform.parent = guileft;*/
        text.getTransform().setTranslation(new Vector3(-20,-40,-1))
        text.getTransform().setScale(new Vector3(2,2,2))


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
export default GameTest