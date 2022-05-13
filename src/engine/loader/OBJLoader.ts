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

                const indices = []
                const vertices = []
                const normals = []

                data.models[0].faces.forEach((face) => {
                    indices.push(face.vertices[0].vertexIndex-1)
                    indices.push(face.vertices[1].vertexIndex-1)
                    indices.push(face.vertices[2].vertexIndex-1)
                })

                data.models[0].vertices.forEach(vertex => {
                    vertices.push(vertex.x)
                    vertices.push(vertex.y)
                    vertices.push(vertex.z)
                })

                data.models[0].vertexNormals.forEach(normal => {
                    normals.push(normal.x)
                    normals.push(normal.y)
                    normals.push(normal.z)
                })

                vao = new VAO([
                    new VBO(new Float32Array(vertices), 3, true),
                    new VBO(new Float32Array(normals), 3, true),
                    new VBO(new Uint16Array(indices), 1, false),
                ])
                
            },
            function onError(err) {
                throw new Error('Error trying to load object data: ' + pathname + '.\n' + err);
            },
        );

        return vao
    }

}

export default OBJLoader