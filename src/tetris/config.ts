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
    defaultToplistFontStyle: {font: "16px Kenney Mini Square", fill: "#fff"},
    defaultSmallFontStyle: {font: "20px Kenney Mini Square", fill: "#fff"},
    defaultLargeFontStyle: {font: "40px Kenney Mini Square", fill: "#fff"},
}

export default config;
