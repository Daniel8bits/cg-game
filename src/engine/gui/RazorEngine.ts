import {LitElement, html} from 'lit'
//import {customElement} from 'lit/decorators.js'
import { WebComponent } from './decorators/WebComponent'
import {ref, Ref, createRef} from 'lit/directives/ref.js';

import './components/UICanvas'

@WebComponent('razor-engine')
class RazorEngine extends LitElement {

    public canvas: Ref<HTMLCanvasElement> = createRef();

    public constructor() {
        super()

        this.attachShadow({mode: 'open'})
    }

    public connectedCallback() {
        this.shadowRoot.append(`${this.render()}`)
    }
    
    public render() {
        debugger
        return html`
            <razor-ui-canvas></razor-ui-canvas>
            Teste
        `
    }
}
