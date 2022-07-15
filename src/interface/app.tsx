import Razor from '@razor/core/Razor';
import Scene from '@razor/core/scenes/Scene';
import React, { useEffect, useState } from 'react'
import Event from 'src/event'
import GameTest from 'src/game/GameTest';
import Modal from './modal';
import Properties from './properties';

import styles from './style.css';
const App = () => {

    const [open,setOpen] = useState<Boolean>(false);
    const [scene,setScene] = useState<Scene>(null);
    const [current,setCurrent] = useState(null);

    useEffect(() => {

        Event.on('loadScene', function (scene) {
            setCurrent(null);
            setScene(scene);
        })

        const engine = new Razor(new GameTest());
        engine.start();
        window.onresize = () => {
            engine.resize();
        }

    }, []);

    const changeEntity = (e) => {
        const {value} = e.target;
        if(value == "-1") setCurrent(null);
        else setCurrent(value);
    }
    if(!scene) return <div className={styles.loading}>LOADING. . .</div>;
    return (
        <div>
            <a className={styles.openModal} onClick={() => setOpen(!open)}>Abrir Interface</a>
            <Modal active={open}>
                <select onChange={changeEntity}>
                    <option value='-1'>Selecione um</option>
                    {scene.getKeys().map((item) => <option>{item}</option>)}
                </select>
                {current && scene.has(current) && <Properties entity={scene.get(current)}/>}
            </Modal>
        </div>
    )
}

export default App