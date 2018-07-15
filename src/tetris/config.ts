const config = {
    sceneKeys: {
        playScene: 'PlayScene',
        menuScene: 'MenuScene',
    },
    atlasKeys: {
        uiSpriteAtlasKey: "uiSpriteAtlas",
        blockSpriteAtlasKey: "blockSpriteAtlas",
    },
    ui: {
        spacing: 20,
        colors: {
            white: {
                hex: 0xFFFFFF,
                string: '#FFFFFF',
            },
            yellow: {
                hex: 0xFFFF00,
                string: '#FFFF00',
            },
            orange: {
                hex: 0xFFA500,
                string: '#FFA500',
            },
            red: {
                hex: 0xFF0000,
                string: '#FF0000',
            },
        },
        countdown: {
            lineWidth: 9,
        },
        fonts: {
            scoreboard: {
                size: 18,
                font: {font: "16px Kenney Mini Square", fill: "#fff"},
            },
            small: {
                size: 22,
                font: {font: "20px Kenney Mini Square", fill: "#fff"},
            },
            large: {
                size: 42,
                font: {font: "40px Kenney Mini Square", fill: "#fff"},
            },
        },
    },
    field: {
        width: 10,
        height: 18,
        blockSize: 32,
    },
    graphics: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    serverAddress: "https://tetrisboi.herokuapp.com",
}

export default config;
