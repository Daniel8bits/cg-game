import { LitElement } from "lit";

export function WebComponent(name: string) {
    return (component: new () => LitElement) => {
        if(!customElements.get(name)) {
            customElements.define(name, component);
        }
    }
}