import { gl } from "@razor/gl/GLUtils";

class Framebuffer {

    private fbo : any;
    private rbo : any;
    //private texture : any;

    //private framebuffer : any;
    private textureColorBuffer : any;

    constructor() {
        this.create();
        this.bindInit();
        this.set();
    }

    private create() {

        this.fbo = gl.createFramebuffer();
        this.rbo = gl.createRenderbuffer();
        //this.framebuffer = gl.createFramebuffer();

        return this;
    }

    private bindInit() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        //if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE){}
            //good to go
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
        //gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        return this;
    }

    private set() {

        const width = 800;
        const height = 600;
        const border = 0;

        // generate texture
        this.textureColorBuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.textureColorBuffer);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, border, gl.RGB, gl.UNSIGNED_BYTE, null);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, 0);
        
        // attach it to currently bound framebuffer object
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureColorBuffer, 0);

        this.rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);

        //2nd parameter should be gl.DEPTH24_STENCIL8, but apparently have trouble with WebGL2
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);

        gl.bindRenderbuffer(gl.RENDERBUFFER, 0);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.rbo);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            console.log("Error at Framebuffer setting.");
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, 0);

        return this;
    }

    public bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    }

    public unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
    }

    public delete() {
        gl.deleteFramebuffer(this.fbo);
        gl.deleteRenderbuffer(this.rbo);
    }

    public configTest() {
        // first pass
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // we're not using the stencil buffer now
        gl.enable(gl.DEPTH_TEST);
        //ATTENTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //DrawScene();
        
        // second pass
        gl.bindFramebuffer(gl.FRAMEBUFFER, 0); // back to default
        gl.clearColor(1.0, 1.0, 1.0, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        //ATTENTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //screenShader.use();  
        //Use something like glVertexAttribPointer instead of below
        //glBindVertexArray(quadVAO);
        gl.disable(gl.DEPTH_TEST);
        gl.bindTexture(gl.TEXTURE_2D, this.textureColorBuffer);
        //This is basic draw
        //glDrawArrays(GL_TRIANGLES, 0, 6); 
    }
}

export default Framebuffer