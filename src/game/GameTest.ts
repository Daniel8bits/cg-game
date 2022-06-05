import { Vector3, Quaternion, Matrix4, Vector2 } from "@math.gl/core"
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
import Texture from "@razor/appearance/Texture";
import TextureLoader from "@razor/loader/TextureLoader";
import DisplayEntity from "./entities/DisplayEntity";
import ImageEntity from "./entities/gui/ImageEntity";
import DialogEntity from "./entities/gui/DialogEntity";

import { 
    bhaskara,
    circunferenceEquationOf,
    distanceBetweenPointAndLine, 
    intersectionPointsBetweenLineAndCircunference,
    LineEquation, 
    lineEquationOf 
  } from "@razor/math/math";

class GameTest extends GameCore {

    private _camera: CanvasCamera
    private static instance: GameTest;

    public constructor() {
        super()
        GameTest.instance = this;
    }

    public static getInstance(): GameTest {
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

        /* Shader da Imagem */
        ResourceManager.loadShader([{
            name: 'image',
            vertexShaderPathname: '/resources/shader/image/vert.glsl',
            fragmentShaderPathname: '/resources/shader/image/frag.glsl'
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
                name: 'rectangle',
                objectData: () => {
                    const vao = new VAO([], 2);
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

        const scene1 = new PhysicsScene('scene1')
        scene1.getProperties().gravity = 0

        this.getSceneManager().add(scene1, true)

        const guiAmmunition = new DisplayEntity('guiAmmunition', guiRenderer);
        const bottom = -Razor.CANVAS.height + 100;
        this.getSceneManager().getActive().add(guiAmmunition);
        guiAmmunition.getTransform().setTranslation(new Vector3(0, bottom, 0));
        guiAmmunition.setText("123", new Vector3(0.2, 0.9, 0.9));
        //// https://www.pngwing.com/pt/free-png-stupy/download
        guiAmmunition.setImage(new ImageEntity("ammunition", "/resources/images/ammunition.png", guiRenderer));

        const guiLife = new DisplayEntity('guiLife', guiRenderer);
        this.getSceneManager().getActive().add(guiLife);
        guiLife.getTransform().setTranslation(new Vector3(0, bottom - 50, 0));
        guiLife.setText("123", new Vector3(1, 0.2, 0.2));
        //https://www.onlinewebfonts.com/icon/146242
        guiLife.setImage(new ImageEntity("life", "/resources/images/life.png", guiRenderer));

        const dialog = new DialogEntity("dialog", guiRenderer);
        this.getSceneManager().getActive().add(dialog);
        dialog.getTransform().setTranslation(new Vector3(100,100,-1).negate())
        dialog.init();
        dialog.animateText("salve salve familia",50,{vertical:'10%',horizontal:'center'});
        /*
                const pauseContainer = new GuiEntity("pause_container",guiRenderer);
                this.getSceneManager().getActive().add(pauseContainer);
                const rectanglePause = pauseContainer.addRectangle("pause_rectangle");
                rectanglePause.getTransform().setScale(new Vector3(Razor.CANVAS.width,Razor.CANVAS.height,1));
                rectanglePause.color = new Vector3(0.1,0.1,0.1);
                const textPause = pauseContainer.addText("pause_text").setText("Pause");
        */
        new EntityFactory(
            this.getSceneManager(),
            this.getRenderStrategy()
        ).load()
        
        
        const doorPanel = new DoorPanelEntity(
            'teste',
            new CircleHitbox(2),
            1,
            ResourceManager.getVAO('door-panel'),
            ResourceManager.getMaterial('door-panel-2'),
            mapRenderer
        )

        scene1.add(doorPanel)

        const player = new Player('player', new CircleHitbox(2), this._camera)

        player.getTransform().setTranslation(new Vector3(51.1, 0, -88))
        player.getTransform().setRotation(new Orientation(0, -32))

        this.getSceneManager().getActive().add(player)



        
        this.getSceneManager().add(new Scene('menu'), true)

        const select1 = new SelectEntity("select1", guiRenderer, this.getSceneManager().getActive());
        this.getSceneManager().getActive().add(select1)
        select1.addOption("comecar").setExecute(() => {
            this.getSceneManager().setActive("scene1")
        })
        select1.addOption("opcao 2")
        select1.addOption("opcao 3")

        this.getSceneManager().setActive("scene1");



        console.log('eq0: ', lineEquationOf(new Vector2(1,1), new Vector2(6,5)));
        console.log('eq1: ', circunferenceEquationOf(new Vector2(1,-4), 4));
        console.log('eq2: ', intersectionPointsBetweenLineAndCircunference(
            {a: 3, b: 0, c: -2},
            {a: 2, b: 1, r: 2}
        ));

        console.log('eq3: ', bhaskara({a: 2, b: -3, c: -3}))

        console.log('eq4: ', lineEquationOf(new Vector2(6, 5), new Vector2(1, 1)));
        
        
        
        
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