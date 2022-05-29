import Texture from '../appearance/Texture';

class TextureLoader {
    

  public load(pathname: string,callback?: (texture : Texture) => void): Texture {
    
    const texture = new Texture()
    const img = new Image();

    img.onload = () => {
      texture.setWidth(img.naturalWidth)
      texture.setHeight(img.naturalHeight)  

      //document.body.append(img)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = img.naturalWidth
      tempCanvas.height = img.naturalHeight
      const ctx = tempCanvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
      const data = new Uint8Array(ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data)

      texture.setData(data)
      if(callback) callback(texture);
    }

    img.onerror = (err) => {
      throw new Error(`Error trying to load image: ${pathname}.\n ${err}`);
    }

    img.src = pathname

    return texture
  }

}

export default TextureLoader