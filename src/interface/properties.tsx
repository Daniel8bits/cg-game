import { Vector3 } from "@math.gl/core";
import Orientation from "@razor/math/Orientation";
import React, { useEffect, useState } from "react"
import Lamp from "./components/lamp";
import styles from './style.css';

const Properties = ({entity}) => {
    const className = entity.constructor.name;
    const [update,setUpdate] = useState<Boolean>(false);
    const [translation,setTranslation] = useState(new Vector3);
    const [scale,setScale] = useState(new Vector3);
    const [rotation,setRotation] = useState(new Orientation);

    useEffect(() => {
        const transform = entity.getTransform();
        setTranslation(transform.getTranslation());
        setRotation(transform.getRotation());
        setScale(transform.getScale());
    },[entity])

    const updated = (only = false) => {
        if(!only){
            const transform = entity.getTransform();
            transform.setTranslation(translation); 
            transform.setRotation(rotation);
            transform.setScale(scale);
        }
        setUpdate(!update);
    }

    const changeValue = (type : string) => (e) => {
        let {name,value} = e.target;
        value = parseFloat(value);
        if(value == null || value == undefined || value == NaN) value = 0;
        //const translation = entity.getTransform().getTranslation();
        switch(type){
            case "translation":
                translation[name] = value
                setTranslation(translation);
            break;
            case "rotation":
                rotation[name] = value
                setRotation(rotation);
            break;
            case "scale":
                scale[name] = value;
                setScale(scale);
            break;
        }
        updated();
    }

    return (
        <div>
            <p><b>Position</b></p>
            <div className={styles.fieldGroup}>
                <input type='number' step="0.01" onChange={changeValue('translation')} name='0' value={translation[0]} />
                <input type='number' step="0.01" onChange={changeValue('translation')} name='1' value={translation[1]} />
                <input type='number' step="0.01" onChange={changeValue('translation')} name='2' value={translation[2]} />
            </div>
            <p><b>Rotation</b></p>
            <div className={styles.fieldGroup}>
                <input type='number' step="0.01" onChange={changeValue('rotation')} name='0' value={rotation[0]} />
                <input type='number' step="0.01" onChange={changeValue('rotation')} name='1' value={rotation[1]} />
                <input type='number' step="0.01" onChange={changeValue('rotation')} name='2' value={rotation[2]} />
            </div>
            <p><b>Scale</b></p>
            <div className={styles.fieldGroup}>
                <input type='number' step="0.01" onChange={changeValue('scale')} name='0' value={scale[0]} />
                <input type='number' step="0.01" onChange={changeValue('scale')} name='1' value={scale[1]} />
                <input type='number' step="0.01" onChange={changeValue('scale')} name='2' value={scale[2]} />
            </div>
            {className == "Lamp" && <Lamp entity={entity} updated={updated} />}
        </div>
    )
}
export default Properties