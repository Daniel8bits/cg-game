import OBJFile from 'obj-file-parser'
import VAO from '../buffer/VAO'
import VBO from '../buffer/VBO';
import FileUtils from '../utils/FileUtils';

class OBJLoader {
    

    public load(pathname: string): VAO {

        let vao = null

        FileUtils.load(
            pathname, 
            function onSuccess(file) {

                const data = new OBJFile(file).parse()

                const vbos = []
                const vertices = []
                const normals = []
                const uvCoords = []

                //console.log(data);

                data.models[0].faces.forEach((face) => {
                    const v0 = face.vertices[0].vertexIndex-1
                    const v1 = face.vertices[1].vertexIndex-1
                    const v2 = face.vertices[2].vertexIndex-1

                    vertices.push(data.models[0].vertices[v0].x)
                    vertices.push(data.models[0].vertices[v0].y)
                    vertices.push(data.models[0].vertices[v0].z)

                    vertices.push(data.models[0].vertices[v1].x)
                    vertices.push(data.models[0].vertices[v1].y)
                    vertices.push(data.models[0].vertices[v1].z)

                    vertices.push(data.models[0].vertices[v2].x)
                    vertices.push(data.models[0].vertices[v2].y)
                    vertices.push(data.models[0].vertices[v2].z)

                    if(
                        data.models[0].vertexNormals && 
                        data.models[0].vertexNormals.length > 0
                    ) {
                        const n0 = face.vertices[0].vertexNormalIndex-1
                        const n1 = face.vertices[1].vertexNormalIndex-1
                        const n2 = face.vertices[2].vertexNormalIndex-1
    
                        normals.push(data.models[0].vertexNormals[n0].x)
                        normals.push(data.models[0].vertexNormals[n0].y)
                        normals.push(data.models[0].vertexNormals[n0].z)
    
                        normals.push(data.models[0].vertexNormals[n1].x)
                        normals.push(data.models[0].vertexNormals[n1].y)
                        normals.push(data.models[0].vertexNormals[n1].z)
    
                        normals.push(data.models[0].vertexNormals[n2].x)
                        normals.push(data.models[0].vertexNormals[n2].y)
                        normals.push(data.models[0].vertexNormals[n2].z)
                    }

                    if(
                        data.models[0].textureCoords && 
                        data.models[0].textureCoords.length > 0
                    ) {
                        const uv0 = face.vertices[0].textureCoordsIndex-1
                        const uv1 = face.vertices[1].textureCoordsIndex-1
                        const uv2 = face.vertices[2].textureCoordsIndex-1
    
                        uvCoords.push(data.models[0].textureCoords[uv0].u)
                        uvCoords.push(data.models[0].textureCoords[uv0].v)
                        //normals.push(data.models[0].textureCoords[uv0].w)
    
                        uvCoords.push(data.models[0].textureCoords[uv1].u)
                        uvCoords.push(data.models[0].textureCoords[uv1].v)
                        //normals.push(data.models[0].textureCoords[uv1].w)
    
                        uvCoords.push(data.models[0].textureCoords[uv2].u)
                        uvCoords.push(data.models[0].textureCoords[uv2].v)
                        //normals.push(data.models[0].textureCoords[uv2].w)
                    }
                })

                vbos.push(new VBO(new Float32Array(vertices), 3, true))

                if(normals.length > 0) {
                    vbos.push(new VBO(new Float32Array(normals), 3, true))
                }
                if(uvCoords.length > 0) {
                    vbos.push(new VBO(new Float32Array(uvCoords), 2, true))
                }

                vao = new VAO(vbos)
                
            },
            function onError(err) {
                throw new Error(`Error trying to load object data: ${pathname}.\n ${err}`);
            },
        );

        return vao
    }


    public loadHitboxes(pathname: string): any {

        FileUtils.load(
            pathname, 
            function onSuccess(file) {
                const data = JSON.parse(file)

                console.log(data);
                
            },
            function onError(err) {
                throw new Error(`Error trying to load hitbox data: ${pathname}.\n ${err}`);
            },
        )

    }

}

export default OBJLoader