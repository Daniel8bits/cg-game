import {LitElement, html} from 'lit'
//import {customElement} from 'lit/decorators.js'
import { WebComponent } from '../decorators/WebComponent'
import {ref, Ref, createRef} from 'lit/directives/ref.js';

@WebComponent('razor-ui-canvas')
class UICanvas extends LitElement {

    public canvas: Ref<HTMLCanvasElement> = createRef();

    
    
    public render() {
        return html`
            <canvas ${ref(this.canvas)}></canvas>
            TESTE
        `
    }
}