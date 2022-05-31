import { Vector3, Quaternion, Matrix4 } from "@math.gl/core"
import GameCore from '@razor/core/GameCore'
import ResourceManager from '@razor/core/ResourceManager'
import Scene from '@razor/core/scenes/Scene';
import SimpleRenderer from './renderers/SimpleRenderer'
import SimpleEntity from './entities/SimpleEntity'
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
import OBJLoader from "@razor/loader/OBJLoader";
import SelectEntity from "./entities/gui/SelectEntity";
import EmptyMaterial from "@razor/appearance/material/EmptyMaterial";
import DoorPanelEntity from "./entities/DoorPanelEntity";
import CircleHitbox from "@razor/physics/hitboxes/CircleHitbox";
import PhysicsScene from "@razor/core/scenes/PhysicsScene";
import MapRenderer from "./renderers/MapRenderer";
import Player from "./entities/Player";

class GameTest extends GameCore {

    private _camera: CanvasCamera
    private static instance : GameTest;

    public constructor() {
        super()
        GameTest.instance = this;
    }

    public static getInstance() : GameTest{
        return GameTest.instance;
    }

    public start() {

        this._camera = new CanvasCamera('main', new Vector3(51.1, 0, -88), new Orientation(0, -32));

        // ========= SHADER ==========

        /* Shader com Iluminação */
        ResourceManager.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/shader1/vert.glsl',
            fragmentShaderPathname: '/resources/shader/shader1/frag.glsl'
        }])

        ResourceManager.loadShader([{
            name: 'map',
            vertexShaderPathname: '/resources/shader/map/vert.glsl',
            fragmentShaderPathname: '/resources/shader/map/frag.glsl'
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
                'empty',
                ResourceManager.getShader('gui')
            ),
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
                'door-panel-2',
                ResourceManager.getShader('map'),
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
                    const vao = new VAO([],2);
                    vao.addEmpty(2);
                    return vao;
                }
            },
            {
                name: 'rectangle',
                objectData: () => {
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
        const mapRenderer = new MapRenderer(this._camera);
        this.getRenderStrategy().add(mapRenderer)

        this.getSceneManager().add(new PhysicsScene('scene1'), true)

        const bottom = -Razor.CANVAS.height + 100;
        const guileft = new GuiEntity('guileft',guiRenderer) as GuiEntity;
        this.getSceneManager().getActive().add(guileft);
        guileft.getTransform().setTranslation(new Vector3(0,bottom,0));

        
        const rectangle= guileft.addRectangle("rectangle_left");
        rectangle.setSize(200,100);
        const text = guileft.addText("text_rectangle_left");
        text.setText("loading")
        text.getTransform().setTranslation(new Vector3(-20,-40,-1))
        text.getTransform().setScale(new Vector3(2,2,2))
        
        

        /*this.getSceneManager().getActive().add(new GuiEntity(
            'guiright',
            guiRenderer
        ));*/
//        const guiright = this.getSceneManager().get('scene1').get('guiright');
//        guiright.getTransform().setTranslation(new Vector3(-Razor.CANVAS.width + 100,bottom,0))

        

        new EntityFactory(
            this.getSceneManager(),
            this.getRenderStrategy()
        ).load()
        
        
        const doorPanel = new DoorPanelEntity(
            'door-panel',
            new CircleHitbox(2),
            1,
                ResourceManager.getVAO('door-panel'),
                ResourceManager.getMaterial('door-panel-2'),
                mapRenderer
        )

        doorPanel.getTransform().setZ(10)

        this.getSceneManager().getActive().add(doorPanel)

        const player = new Player('player', new CircleHitbox(2), this._camera)

        player.getTransform().setTranslation(new Vector3(51.1, 0, -88))
        player.getTransform().setRotation(new Orientation(0, -32))

        this.getSceneManager().getActive().add(player)



        
        this.getSceneManager().add(new Scene('menu'), true)
        this.getSceneManager().setActive("menu");
        const select1 = new SelectEntity("select1",guiRenderer,this.getSceneManager().getActive());
        this.getSceneManager().getActive().add(select1)
        /*
        const rectangle2= select1.addRectangle("rectangle_left2");
        rectangle2.setSize(200,100);
        const text2 = select1.addText("text_rectangle_left2");
        text2.setText("loading")
        text2.getTransform().setTranslation(new Vector3(-20,-40,-1))
        text2.getTransform().setScale(new Vector3(2,2,2))
        */
        select1.addOption("comecar").setExecute(() => {
            this.getSceneManager().setActive("scene1")
        })
        select1.addOption("opcao 2")
        select1.addOption("opcao 3")
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