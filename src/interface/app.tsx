import React, { useEffect, useState } from 'react'
import Event from 'src/event'
import Modal from './modal';
import Properties from './properties';

import styles from './style.css';
const App = () => {

    const [open,setOpen] = useState<Boolean>(false);
    const [scene,setScene] = useState<any>(null);
    const [current,setCurrent] = useState(null);

    useEffect(() => {
        Event.on('loadScene', function (scene) {
            setCurrent(null);
            setScene(scene);
        })
    }, []);

    const changeEntity = (e) => {
        const {value} = e.target;
        if(value == "-1") setCurrent(null);
        else setCurrent(value);
    }
    if(!scene) return <>Loading</>;
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