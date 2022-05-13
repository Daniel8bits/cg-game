
class UIResourceManager extends HTMLElement {
    constructor() {
        super()
        this.init()
    }

    public init(): void {
        this.attachShadow({mode: 'open'})

        
    }
}

export default UIResourceManager