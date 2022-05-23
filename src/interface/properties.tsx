import { Vector3 } from "@math.gl/core";
import React, { useEffect, useState } from "react"
import styles from './style.css';

const Properties = ({entity}) => {
    
    const [update,setUpdate] = useState<Boolean>(false);
    const [translation,setTranslation] = useState(new Vector3);

    useEffect(() => {
        const transform = entity.getTransform();
        setTranslation(transform.getTranslation());
    },[entity])

    const changeTranslation = (e) => {
        let {name,value} = e.target;
        value = parseFloat(value);
        const translation = entity.getTransform().getTranslation();
        console.log(translation[name] = value)
        entity.getTransform().setTranslation(translation); 
        setTranslation(translation);
        setUpdate(!update)
    }

    useEffect(() => {
        console.log( entity.getTransform().getTranslation())
    },[update])

    return (
        <div>
            <p><b>Position</b></p>
            <div className={styles.fieldGroup}>
                <input type='number' onChange={changeTranslation} name='0' value={translation[0]} />
                <input type='number' onChange={changeTranslation} name='1' value={translation[1]} />
                <input type='number' onChange={changeTranslation} name='2' value={translation[2]} />
            </div>
        </div>
    )
}
export default Properties