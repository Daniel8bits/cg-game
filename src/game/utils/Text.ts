class Text {
    private static fontInfo = {
        letterHeight: 8,
        spaceWidth: 8,
        spacing: -1,
        textureWidth: 64,
        textureHeight: 40,
        glyphInfos: {
            'a': { x: 0, y: 0, width: 8, },
            'b': { x: 8, y: 0, width: 8, },
            'c': { x: 16, y: 0, width: 8, },
            'd': { x: 24, y: 0, width: 8, },
            'e': { x: 32, y: 0, width: 8, },
            'f': { x: 40, y: 0, width: 8, },
            'g': { x: 48, y: 0, width: 8, },
            'h': { x: 56, y: 0, width: 8, },
            'i': { x: 0, y: 8, width: 8, },
            'j': { x: 8, y: 8, width: 8, },
            'k': { x: 16, y: 8, width: 8, },
            'l': { x: 24, y: 8, width: 8, },
            'm': { x: 32, y: 8, width: 8, },
            'n': { x: 40, y: 8, width: 8, },
            'o': { x: 48, y: 8, width: 8, },
            'p': { x: 56, y: 8, width: 8, },
            'q': { x: 0, y: 16, width: 8, },
            'r': { x: 8, y: 16, width: 8, },
            's': { x: 16, y: 16, width: 8, },
            't': { x: 24, y: 16, width: 8, },
            'u': { x: 32, y: 16, width: 8, },
            'v': { x: 40, y: 16, width: 8, },
            'w': { x: 48, y: 16, width: 8, },
            'x': { x: 56, y: 16, width: 8, },
            'y': { x: 0, y: 24, width: 8, },
            'z': { x: 8, y: 24, width: 8, },
            '0': { x: 16, y: 24, width: 8, },
            '1': { x: 24, y: 24, width: 8, },
            '2': { x: 32, y: 24, width: 8, },
            '3': { x: 40, y: 24, width: 8, },
            '4': { x: 48, y: 24, width: 8, },
            '5': { x: 56, y: 24, width: 8, },
            '6': { x: 0, y: 32, width: 8, },
            '7': { x: 8, y: 32, width: 8, },
            '8': { x: 16, y: 32, width: 8, },
            '9': { x: 24, y: 32, width: 8, },
            '-': { x: 32, y: 32, width: 8, },
            '*': { x: 40, y: 32, width: 8, },
            '!': { x: 48, y: 32, width: 8, },
            '?': { x: 56, y: 32, width: 8, },
        },
    };
    static render(s : string) {
        const fontInfo = this.fontInfo;
        var len = s.length;
        var numVertices = len * 6;
        var positions = new Float32Array(numVertices * 2);
        var texcoords = new Float32Array(numVertices * 2);
        var offset = 0;
        var x = 0;
        var maxX = fontInfo.textureWidth;
        var maxY = fontInfo.textureHeight;
        for (var ii = 0; ii < len; ++ii) {
            var letter = s[ii];
            var glyphInfo = fontInfo.glyphInfos[letter];
            if (glyphInfo) {
                var x2 = x + glyphInfo.width;
                var u1 = glyphInfo.x / maxX;
                var v1 = (glyphInfo.y + fontInfo.letterHeight - 1) / maxY;
                var u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX;
                var v2 = glyphInfo.y / maxY;

                // 6 vertices per letter
                positions[offset + 0] = x;
                positions[offset + 1] = 0;
                texcoords[offset + 0] = u1;
                texcoords[offset + 1] = v2;//v1;

                positions[offset + 2] = x2;
                positions[offset + 3] = 0;
                texcoords[offset + 2] = u2;
                texcoords[offset + 3] = v2;//v1;

                positions[offset + 4] = x;
                positions[offset + 5] = fontInfo.letterHeight;
                texcoords[offset + 4] = u1;
                texcoords[offset + 5] = v1;//v2;

                positions[offset + 6] = x;
                positions[offset + 7] = fontInfo.letterHeight;
                texcoords[offset + 6] = u1;
                texcoords[offset + 7] = v1;//v2;

                positions[offset + 8] = x2;
                positions[offset + 9] = 0;
                texcoords[offset + 8] = u2;
                texcoords[offset + 9] = v2;//v1;

                positions[offset + 10] = x2;
                positions[offset + 11] = fontInfo.letterHeight;
                texcoords[offset + 10] = u2;
                texcoords[offset + 11] = v1;//v2;

                x += glyphInfo.width + fontInfo.spacing;
                offset += 12;
            } else {
                // we don't have this character so just advance
                x += fontInfo.spaceWidth;
            }
        }

        // return ArrayBufferViews for the portion of the TypedArrays
        // that were actually used.
        return {
            arrays: {
                position: new Float32Array(positions.buffer, 0, offset),
                texcoord: new Float32Array(texcoords.buffer, 0, offset),
            },
            numVertices: offset / 2,
        };
    }

}
export default Text;