import { Vector3 } from "@math.gl/core";
import GameCore from '@razor/core/GameCore';
import ResourceManager from '@razor/core/ResourceManager';
import Scene from '@razor/core/scenes/Scene';
import Orientation from "@razor/math/Orientation";
import DefaultMaterial from '../engine/appearance/material/DefaultMaterial';
import CanvasCamera from './CanvasCamera';
import GuiRenderer from "./renderers/GuiRenderer";
import MapRenderer from './renderers/MapRenderer';

import VAO from "@razor/buffer/VAO";
import VBO from "@razor/buffer/VBO";
import Razor from "@razor/core/Razor";
import DoorPanelEntity from "./entities/DoorPanelEntity";
import DialogEntity from "./entities/gui/common/DialogEntity";
import ImageEntity from "./entities/gui/common/ImageEntity";
import DisplayEntity from "./entities/gui/DisplayEntity";
import Player from "./entities/player/Player";
import MonsterRenderer from "./renderers/MonsterRenderer";

import GameController from "./entities/gui/hud/GameController_old";
import Gun from "./entities/player/Gun";
import DoorPanelMaterial from "./materials/DoorPanelMaterial";
import PlayerRenderer from "./renderers/PlayerRenderer";
import GameOverScene from "./scenes/GameOverScene";
import LoadingScene from "./scenes/LoadingScene";
import MainScene from "./scenes/MainScene";
import CreditsMenu from "./scenes/menu/CreditsMenu";
import MainMenu from "./scenes/menu/MainMenu";

class GameTest extends GameCore {

    private _camera: CanvasCamera
    private _gameController: GameController;
    private static instance: GameTest;
    private _guiRenderer: GuiRenderer;
    public constructor() {
        super()
        GameTest.instance = this;
    }

    public static getInstance(): GameTest {
        return GameTest.instance;
    }

    public start() {

        ResourceManager.addSounds([
            //https://freesound.org/people/michorvath/sounds/427598/
            {
                name: "gun",
                pathname: "/resources/sound/gun.wav"
            },
            //https://freesound.org/people/KlawyKogut/sounds/154934/#
            {
                name: "empty_gun",
                pathname: "/resources/sound/empty_gun.wav"
            },
            //https://freesound.org/people/thencamenow/sounds/31236/
            {
                name: "door",
                pathname: "/resources/sound/door.mp3"
            },
            //https://freesound.org/people/julius_galla/sounds/193692/
            {
                name: "music",
                pathname: "/resources/sound/music.wav",
                options: {
                    volume: 50
                }
            },
            //https://freesound.org/people/dkiller2204/sounds/366111/
            {
                name: "step",
                pathname: "/resources/sound/footstep.wav"
            },
            //https://freesound.org/people/victorium183/sounds/476816/
            {
                name: "menu",
                pathname: "/resources/sound/menu.wav",
                options: {
                    volume: 20
                }
            },
            //https://freesound.org/people/joedeshon/sounds/368738/
            {
                name: "elevator",
                pathname: "/resources/sound/elevator.wav"
            },
            //https://freesound.org/people/Deathscyp/sounds/404109/
            {
                name: "damage",
                pathname: "/resources/sound/damage.wav"
            },
        ])

        this._camera = new CanvasCamera('main', new Vector3(51.1, 0, -88), new Orientation(0, -32));
        CanvasCamera.setMainCamera(this._camera);

        // ========= SHADER ==========

        /* Shader com Iluminação */
        ResourceManager.loadShader([{
            name: 'map',
            vertexShaderPathname: '/resources/shader/map/vert.glsl',
            fragmentShaderPathname: '/resources/shader/map/frag.glsl'
        }])

        /* Shader do monstro */
        ResourceManager.loadShader([{
            name: 'monster',
            vertexShaderPathname: '/resources/shader/monster/vert.glsl',
            fragmentShaderPathname: '/resources/shader/monster/frag.glsl'
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
                name: 'monster',
                pathname: '/resources/objects/monster/monster-texture.png'
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
                'monster',
                ResourceManager.getShader('monster'),
                ResourceManager.getTexture('monster'),
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
                name: 'monster',
                objectData: '/resources/objects/monster/monster.obj'
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

        const scene1 = new MainScene(this._camera)

        const mapRenderer = new MapRenderer(this._camera);
        scene1.getRenderStrategy().add(mapRenderer)
        const monsterRenderer = new MonsterRenderer(this._camera);
        scene1.getRenderStrategy().add(monsterRenderer)
        const playerRenderer = new PlayerRenderer(this._camera);
        scene1.getRenderStrategy().add(playerRenderer)
        const guiRenderer = this._guiRenderer = new GuiRenderer(this._camera);
        scene1.getRenderStrategy().add(guiRenderer)

        scene1.init()

        //scene1.getProperties().gravity = 0

        this.getSceneManager().add(scene1, true)

        playerRenderer.setPlayer(
            scene1.get('player') as Player,
            scene1.get('gun') as Gun
        )
        monsterRenderer.setPlayer(scene1.get('player') as Player)

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
        /*
        dialog.animateText("bem vindo ao inferno", 50, { vertical: '10%', horizontal: 'center' }, function () {
            setTimeout(() => this.remove(), 5000);
        });*/
        //elevator
        /*
                        const pauseContainer = new GuiEntity("pause_container",guiRenderer);
                        pauseContainer.getTransform().setTranslation(new Vector3(0,0,-1));
                        this.getSceneManager().getActive().add(pauseContainer);
                        const rectanglePause = pauseContainer.addRectangle("pause_rectangle");
                        rectanglePause.setAlpha(1);
                        rectanglePause.getTransform().setScale(new Vector3(Razor.CANVAS.width,Razor.CANVAS.height,1));
                        rectanglePause.color = new Vector3(0.1,0.1,0.1);
                        const textPause = pauseContainer.addText("pause_text");
                        textPause.setText("Pause");
                        textPause.updatePosition({horizontal:"left",vertical:"top"})
                        textPause.getTransform().setTranslation(new Vector3(0,0,-1));
                */

        /* Credits Scene */
        this.getSceneManager().add(new CreditsMenu(guiRenderer));
        // const sceneScredits = new Scene('credits');
        // sceneScredits.getRenderStrategy().add(guiRenderer)
        // this.getSceneManager().add(sceneScredits, true)

        
        /* GameOver Scene */
        this.getSceneManager().add(new GameOverScene(guiRenderer));
       

        /* Loading Scene */
        this.getSceneManager().add(new LoadingScene(guiRenderer));
        //const sceneLoading = new Scene('loading');
        

        /* End Scene */
        const sceneEnd = new Scene('end');
        sceneEnd.getRenderStrategy().add(guiRenderer)
        this.getSceneManager().add(sceneEnd, true);
        const endDisplay = new DialogEntity("endDisplay", guiRenderer);
        this.getSceneManager().getActive().add(endDisplay);
        endDisplay.getTransform().setTranslation(new Vector3(100, 100, -1).negate())
        //endDisplay.init();

        /* Menu Scene */
        this.getSceneManager().add(new MainMenu(guiRenderer));
        
        /*
        const credits =     new RectangleEntity("credits_rect", ResourceManager.getVAO("rectangle"), ResourceManager.getMaterial("rectangle"), guiRenderer)
        credits.updatePosition({horizontal:"center",vertical:"center"});
        */


        this.setScene(MainMenu.MAIN_MENU);
        /*
        const attachemnts = this._frameBuffer.map((item) => item.attachemnt)
        GLUtils.drawBuffer(attachemnts);
        const pathFinding = new PathFinding()
        
        pathFinding.loadNodes()
        const destiny = pathFinding.getNodes().get('node_21')
        pathFinding.find(pathFinding.getNodes().get('node_0'), destiny)

        let current = destiny
        do {
            console.log('n: ', current.getName());
            current = current.getPath()
        } while(current)
        
*/
        const playerEntity = Player.Find("player");
        playerEntity.setEndPoint(DoorPanelEntity.Find("elevator_1").getTransform())
    }

    public changeScene(scene: Scene): void {
        const gameTest = this;
        switch (scene.getName()) {
            case "main":
                DialogEntity.Find("display").animateText("chegue ate o elevador", 50, { vertical: '10%', horizontal: 'center' }, function () {
                    setTimeout(() => this.remove(), 5000);
                });
                break;
            case "loading":
                ResourceManager.getSound("elevator").play(false)
                DialogEntity.Find("loadingDisplay").animateText("bem vindo ao inferno", 50, { vertical: '10%', horizontal: 'center' }, function () {
                    setTimeout(() => {
                        this.remove()
                        gameTest.setScene("main");
                    }, 5000);
                });
                break;
            case "end":
                this._camera.getTransform().setTranslation(new Vector3(51.1, 0, -88))
                this._camera.getTransform().setRotation( new Orientation(0, -32));
                ResourceManager.forEachSound(sound => sound.pause())
                ResourceManager.getSound("elevator").play(false)
                const endDisplay = DialogEntity.Find("endDisplay");
                endDisplay.init();
                endDisplay.animateText("voce chegou no fim", 50, { vertical: '10%', horizontal: 'center' }, function () {
                    setTimeout(() => {
                        this.remove()
                        window.location.reload()
                    }, 5000);
                });
                break;
            case "gameover":
                ResourceManager.forEachSound(sound => sound.pause())
                const gameoverDisplay = DialogEntity.Find("gameoverDisplay");
                gameoverDisplay.init();
                gameoverDisplay.animateText("game over", 50, { vertical: '10%', horizontal: 'center' }, function () {
                    setTimeout(() => {
                        this.remove()
                        window.location.reload()
                    }, 5000);
                });
                break;
        }
    }

    public update(time: number, delta: number) {
        super.update(time, delta);
        this._camera.update(delta)
        /*
        const translation = this._camera.getTransform().getTranslation();
        const rotation = this._camera.getTransform().getRotation();
        document.querySelector("#log").innerHTML = `
            <p><b>Translation</b></p>
            <p><b>x</b> ${translation.x}</p>
            <p><b>y</b> ${translation.y}</p>
            <p><b>z</b> ${translation.z}</p>
            <hr>
            <p><b>Rotation</b></p>
            <p><b>x</b> ${rotation.x}</p>
            <p><b>y</b> ${rotation.y}</p>
            <p><b>z</b> ${rotation.z}</p>
        `;*/
    }

    public render() {
        super.render();
    }

}
export default GameTest