import Material from './Material'
import Texture from '../Texture'
import Shader from '../Shader'
import { gl } from '../../gl/GLUtils'

class EmptyMaterial extends Material {


    public constructor() {
        super("empty")
    }

    public create(): void {

    }

    public bind(): void {

    }

    public unbind(): void {

    }

    public destroy(): void {

    }


}

export default EmptyMaterial