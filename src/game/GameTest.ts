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
import Player from "./entities/player/Player";
import Texture from "@razor/appearance/Texture";
import TextureLoader from "@razor/loader/TextureLoader";
import DisplayEntity from "./entities/DisplayEntity";
import ImageEntity from "./entities/gui/ImageEntity";
import DialogEntity from "./entities/gui/DialogEntity";

import MainScene from "./scenes/MainScene";
import DoorPanelMaterial from "./materials/DoorPanelMaterial";
import PlayerRenderer from "./renderers/PlayerRenderer";
import Gun from "./entities/player/Gun";
import GameController from "./GameController";
import Framebuffer from "@razor/buffer/FrameBuffer";
import FrameRenderer from "./renderers/FrameRenderer";

class GameTest extends GameCore {

    private _camera: CanvasCamera
    private _gameController: GameController;
    private static instance: GameTest;
    private _frameBuffer: FrameRenderer[] = [];

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
            name: 'map',
            vertexShaderPathname: '/resources/shader/map/vert.glsl',
            fragmentShaderPathname: '/resources/shader/map/frag.glsl'
        }])

        /* Shader com Iluminação para o DoorPanelEntity */
        ResourceManager.loadShader([{
            name: 'door-panel',
            vertexShaderPathname: '/resources/shader/door-panel/vert.glsl',
            fragmentShaderPathname: '/resources/shader/door-panel/frag.glsl'
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

        /* Shader do Effect */
        ResourceManager.loadShader([{
            name: 'effect',
            vertexShaderPathname: '/resources/shader/effect/vert.glsl',
            fragmentShaderPathname: '/resources/shader/effect/frag.glsl'
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
                name: 'door-panel-display-map',
                pathname: '/resources/objects/panels/display-map.png'
            },
            {
                name: 'lamp',
                pathname: '/resources/objects/lamp/lamp-texture.png'
            },////
            {
                name: 'hand',
                pathname: '/resources/objects/gun/hand-texture.png'
            },
            {
                name: 'gun',
                pathname: '/resources/objects/gun/gun-texture.png'
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
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('level'),
            ),
            new DefaultMaterial(
                'elevator',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('elevator'),
            ),
            new DefaultMaterial(
                'elevator-door',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('elevator-door'),
            ),
            new DefaultMaterial(
                'hall-door',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('hall-door'),
            ),
            new DoorPanelMaterial(),
            new DefaultMaterial(
                'lamp',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('lamp'),
            ),
            new DefaultMaterial(
                'hand',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('hand'),
            ),
            new DefaultMaterial(
                'gun',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('gun'),
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
                name: 'hand',
                objectData: '/resources/objects/gun/hand.obj'
            },
            {
                name: 'gun-receiver',
                objectData: '/resources/objects/gun/receiver.obj'
            },
            {
                name: 'gun-slider',
                objectData: '/resources/objects/gun/slider.obj'
            },
            {
                name: 'rectangle',
                objectData: () => {
                    const positions = [
                        0, 0,
                        1, 0,
                        0, 1,
                        0, 1,
                        1, 0,
                        1, 1,
                    ];
                    const vao = new VAO([new VBO(new Float32Array(positions), 2, true)], 2);
                    //   vao.addEmpty(1);
                    return vao;
                }
            },
            {
                name: 'effect',
                objectData: () => {
                    const positions = [
                        -1, -1,
                        1, -1,
                        -1, 1,
                        -1, 1,
                        1, -1,
                        1, 1,
                    ];
                    const vp = [
                        0, 0,
                        1, 0,
                        0, 1,
                        0, 1,
                        1, 0,
                        1, 1,
                    ];
                    const vbo = [] as VBO[];
                    vbo.push(new VBO(new Float32Array(positions), 2, true));
                    vbo.push(new VBO(new Float32Array(vp), 2, true));
                    const vao = new VAO(vbo, 2);
                    //   vao.addEmpty(1);
                    return vao;
                }
            }
        ])
            .forEachVAO((vao) => {
                vao.create();
            })
        this._frameBuffer = [new FrameRenderer(this._camera)];

        const guiRenderer = new GuiRenderer(this._camera);
        this.getRenderStrategy().add(guiRenderer)
        const simpleRenderer = new SimpleRenderer(this._camera);
        this.getRenderStrategy().add(simpleRenderer)
        const mapRenderer = new MapRenderer(this._camera);
        this.getRenderStrategy().add(mapRenderer)
        const playerRenderer = new PlayerRenderer(this._camera);
        this.getRenderStrategy().add(playerRenderer)

        const scene1 = new MainScene(this.getRenderStrategy(), this._camera)
        //scene1.getProperties().gravity = 0

        this.getSceneManager().add(scene1, true)

        playerRenderer.setPlayer(
            scene1.get('player') as Player,
            scene1.get('gun') as Gun
        )

        const guiAmmunition = new DisplayEntity('guiAmmunition', guiRenderer);
        const bottom = -Razor.CANVAS.height + 100;
        this.getSceneManager().getActive().add(guiAmmunition);
        guiAmmunition.getTransform().setTranslation(new Vector3(0, bottom, 0));
        GameController.setDisplay("ammunition", guiAmmunition, new Vector3(0.2, 0.9, 0.9));
        //guiAmmunition.setText("123", new Vector3(0.2, 0.9, 0.9));
        //// https://www.pngwing.com/pt/free-png-stupy/download
        guiAmmunition.setImage(new ImageEntity("ammunition", "/resources/images/ammunition.png", guiRenderer));

        const guiLife = new DisplayEntity('guiLife', guiRenderer);
        this.getSceneManager().getActive().add(guiLife);
        guiLife.getTransform().setTranslation(new Vector3(0, bottom - 50, 0));
        GameController.setDisplay("life", guiLife, new Vector3(1, 0.2, 0.2));
        //guiLife.setText("123", new Vector3(1, 0.2, 0.2));
        //https://www.onlinewebfonts.com/icon/146242
        guiLife.setImage(new ImageEntity("life", "/resources/images/life.png", guiRenderer));

        const dialog = new DialogEntity("display", guiRenderer);
        this.getSceneManager().getActive().add(dialog);
        dialog.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
        dialog.init();
        dialog.animateText("bem vindo ao inferno", 50, { vertical: '10%', horizontal: 'center' }, function () {
            setTimeout(() => this.remove(), 5000);
        });
        /*
                const pauseContainer = new GuiEntity("pause_container",guiRenderer);
                this.getSceneManager().getActive().add(pauseContainer);
                const rectanglePause = pauseContainer.addRectangle("pause_rectangle");
                rectanglePause.getTransform().setScale(new Vector3(Razor.CANVAS.width,Razor.CANVAS.height,1));
                rectanglePause.color = new Vector3(0.1,0.1,0.1);
                const textPause = pauseContainer.addText("pause_text").setText("Pause");
        */

        this.getSceneManager().add(new Scene('credits'), true)



        this.getSceneManager().add(new Scene('menu'), true)

        const select1 = new SelectEntity("select1", guiRenderer, this.getSceneManager().getActive());
        this.getSceneManager().getActive().add(select1)
        select1.addOption("comecar").setExecute(() => {
            this.getSceneManager().setActive("main")
        })
        select1.addOption("opcao 2")
        select1.addOption("creditos").setExecute(() => {
            this.getSceneManager().setActive("credits");
        })

        this.getSceneManager().setActive("main");

    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        this._camera.update(delta)
    }

    public render() {
        this._frameBuffer[0].bind();
        super.render();
        this._frameBuffer[0].unbind();
        this._frameBuffer[0].render();
    }

}
export default GameTest