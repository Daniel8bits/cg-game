
import { gl } from '../gl/GLUtils';
import IResource from '../appearance/IResource';
import VBO from './VBO';

export interface VAOType {
    name: string;
    objectData: string | VBO[] | (() => VAO);
}

class VAO implements IResource {

    private _vboList: VBO[];
    private _ibo: VBO;
    private _vertexCoordsOffset: number

    public constructor(vboList: VBO[], vertexCoordsOffset: number = 3) {
        this._vboList = [];
        vboList.forEach((vbo) => {
            if (vbo !== null && vbo !== undefined) {
                this._vboList.push(vbo);
                if (vbo.getType() === gl.ELEMENT_ARRAY_BUFFER) {
                    this._ibo = vbo;
                }
            }
        })
        if (vboList.length > 0 && !this._ibo) {
            this._ibo = vboList[0];
        }
        this._vertexCoordsOffset = vertexCoordsOffset
    }

    public addEmpty(n : number){
        const vbo = [] as VBO[];
        for(let i=0;i<n;i++) vbo.push(new VBO(new Float32Array([]), 2, true, gl.DYNAMIC_DRAW));
        this._vboList = vbo;
        this._ibo = this._vboList[0]
    }

    public create(): void {
        for (let i = 0; i < this._vboList.length; i++) {
            this._createVBO(i, this._vboList[i]);
        }
    }

    private _createVBO(target: number, vbo: VBO): void {
        if(vbo.getId() == null) vbo.setId(gl.createBuffer());
        gl.bindBuffer(vbo.getType(), vbo.getId());
        gl.bufferData(vbo.getType(), vbo.getBuffer(), vbo.getUsage());

        if (vbo.getType() === gl.ARRAY_BUFFER) {
            this._setAttributePointer(target, vbo);
        }

        gl.bindBuffer(vbo.getType(), undefined);
    }

    public bind(): void {
        for (let i = 0; i < this._vboList.length; i++) {
            gl.bindBuffer(this._vboList[i].getType(), this._vboList[i].getId());
            if (this._vboList[i].getType() !== gl.ELEMENT_ARRAY_BUFFER) {
                this._setAttributePointer(i, this._vboList[i])
                gl.enableVertexAttribArray(i);
            }
        }
    }

    public unbind(): void {
        for (let i = this._vboList.length - 1; i >= 0; i--) {
            gl.bindBuffer(this._vboList[i].getType(), this._vboList[i].getId());
            if (this._vboList[i].getType() !== gl.ELEMENT_ARRAY_BUFFER) {
                gl.disableVertexAttribArray(i);
            }
        }
    }

    public destroy(): void {
        for (let i = this._vboList.length - 1; i >= 0; i--) {
            gl.deleteBuffer(this._vboList[i].getId());
        }
    }

    private _setAttributePointer(target: number, vbo: VBO): void {

        const setAttributePointer = (dataType) => {
            gl.vertexAttribPointer(target, vbo.getOffset(), dataType, false, 0, 0);
        }

        if (vbo.getBuffer() instanceof Int8Array) {
            setAttributePointer(gl.BYTE);
        }
        if (vbo.getBuffer() instanceof Int16Array) {
            setAttributePointer(gl.SHORT);
        }
        if (vbo.getBuffer() instanceof Int32Array) {
            setAttributePointer(gl.INT);
        }
        if (vbo.getBuffer() instanceof Uint8Array) {
            setAttributePointer(gl.UNSIGNED_BYTE);
        }
        if (vbo.getBuffer() instanceof Uint16Array) {
            setAttributePointer(gl.UNSIGNED_SHORT);
        }
        if (vbo.getBuffer() instanceof Uint32Array) {
            setAttributePointer(gl.UNSIGNED_INT);
        }
        if (vbo.getBuffer() instanceof Float32Array) {
            setAttributePointer(gl.FLOAT);
        }

    }

    public getVbo(i: number): VBO {
        return this._vboList[i];
    }

    public getIbo(): VBO {
        return this._ibo;
    }

    public getLength(): number {
        if (!this._ibo) return 0;
        return this._ibo.getLength() / this._vertexCoordsOffset;
    }

}

export default VAO;