import Texture from '../tools/Texture';

class TextureLoader {
    

  public load(pathname: string): Texture {

    const texture = new Texture()
    const img = new Image();

    img.onload = () => {
      texture.setWidth(img.naturalWidth)
      texture.setHeight(img.naturalHeight)  
      texture.setData(img)
    }

    img.onerror = (err) => {
      throw new Error(`Error trying to load image: ${pathname}.\n ${err}`);
    }

    img.src = pathname

    return texture
  }

}

export default TextureLoader