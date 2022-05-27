import { Vector3, Quaternion, Matrix4 } from "@math.gl/core"
import GameCore from '@razor/core/GameCore'
import ResourceManager from '@razor/core/ResourceManager'
import Scene from '@razor/core/Scene';
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
import EntityFactory from "./entities/EntityFactory";
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
                name: 'hall-door',
                pathname: '/resources/objects/doors/hall-door-texture.png'
            },
            {
                name: 'door-panel-locked',
                pathname: '/resources/objects/panels/door-panel-locked.png'
            },
            {
                name: 'door-panel-unlocked',
                pathname: '/resources/objects/panels/door-panel-unlocked.png'
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
                'hall-door',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('hall-door'),
            ),
            new DefaultMaterial(
                'door-panel',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('door-panel-locked'),
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
                name: 'level-2',
                objectData: '/resources/objects/level/level-2.obj'
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
                name: 'hall-door',
                objectData: '/resources/objects/doors/hall-door.obj'
            },
            {
                name: 'door-panel',
                objectData: '/resources/objects/panels/door-panel.obj'
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
        
        const bottom = -Razor.CANVAS.height + 100;
        const guileft = new GuiEntity('guileft',guiRenderer);
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


        new EntityFactory(
            this.getSceneManager(),
            this.getRenderStrategy()
        ).load()
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        this._camera.update(delta)
    }

    public render() {
        super.render();
    }

}
export default GameTest