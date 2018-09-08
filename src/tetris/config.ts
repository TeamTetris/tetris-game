const config = {
    sceneKeys: {
        playScene: 'PlayScene',
        menuScene: 'MenuScene',
        collectionScene: 'CollectionScene',
        lootboxScene: 'LootboxScene'
    },
    atlasKeys: {
        uiSpriteAtlasKey: "uiSpriteAtlas",
        blockSpriteAtlasKey: "blockSpriteAtlas",
        goldChestAtlasKey: "goldChestAtlas"
    },
    ui: {
        spacing: 20,
        colors: {
            white: {
                hex: 0xFFFFFF,
                string: '#FFFFFF',
            },
            grey: {
                hex: 0xA4A4A4,
                string: '#A4A4A4',
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
        fontKeys: {
            kenneyMini: "kenneyMini",
            kenneyMiniSquare: "kenneyMiniSquare",
        },
        fonts: {
            scoreboard: {
                size: 18,
                font: {font: "16px Kenney Mini Square", fill: "#fff", align: 'center'},
            },
            countdown: {
                size: 32,
                font: {font: "30px Kenney Mini Square", fill: "#fff", align: 'center'},
            },
            small: {
                size: 22,
                font: {font: "20px Kenney Mini Square", fill: "#fff", align: 'center'},
            },
            large: {
                size: 42,
                font: {font: "40px Kenney Mini Square", fill: "#fff", align: 'center'},
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
        height: window.innerHeight,
        noiseTextureKey: 'noise'
    },
    serverAddress: "https://tetrisboi.herokuapp.com",
};

export default config;
