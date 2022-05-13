//import "../gui/components/UICanvas";
//import {UICanvas} from "../gui/components/UICanvas";

export var gl : WebGLRenderingContext = null;

class GLUtils {

    public static init(): HTMLCanvasElement {
        let canvas = document.createElement('canvas') as HTMLCanvasElement;
        document.body.appendChild(canvas);
        gl = canvas.getContext('webgl');
        if(gl === undefined) {
            throw new Error('Unable to initialize WebGL!');
        }

        return canvas;
    }

}

export default GLUtils;
