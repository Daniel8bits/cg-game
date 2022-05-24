import { Vector3 } from "@math.gl/core";
import React, { useEffect, useState } from "react";
import styles from '../style.css';

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : {
        r: 0, g: 0, b: 0
    };
}
const listDistance = [7,
    13,
    20,
    32,
    50,
    65,
    100,
    160,
    200,
    325,
    600,
    3250];
const Lamp = ({ entity, updated }) => {

    const [color, setColor] = useState(new Vector3);
    const [distance, setDistance] = useState(0);
    const [shininess,setShininess] = useState(0);

    const changeValue = (type: string) => (e) => {
        let { name, value } = e.target;
        const valueDefault = value;
        value = parseFloat(valueDefault);
        if (value == null || value == undefined || value == NaN) value = 0;
        switch (type) {
            case "color":
                const { r, g, b } = hexToRgb(valueDefault);
                color[0] = r;
                color[1] = g;
                color[2] = b;
                entity.color = color;
                setColor(color);
                break;
            case "distance":
                entity.distance = value;
                setDistance(value);
            break;
            case "shininess":
                entity.shininess = value;
                setShininess(value);
            break;
        }
        updated(true);
    }

    useEffect(() => {
        setColor(entity.color);
        setDistance(entity.distance);
        setShininess(entity.shininess)
    }, []);
    return (
        <>
            <p><b>Color</b></p>
            <input type='color' value={rgbToHex(Math.round(color[0] * 255), Math.round(color[1] * 255), Math.round(color[2] * 255))} onChange={changeValue('color')} name='0' />
            <p><b>Distancia</b></p>
            <select onChange={changeValue('distance')} value={distance}>
                {listDistance.map((i) => <option>{i}</option>)}
            </select>
            <p><b>Shininess</b></p>
            <input type='number' value={shininess} onChange={changeValue('shininess')} />
            
        </>
    )
}
export default Lamp;