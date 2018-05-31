const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = {
	entry: './src/tetris/game.ts',
	mode: 'production',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	devServer: {
		contentBase: path.resolve(__dirname, './'),
		publicPath: '/build/',
		host: '127.0.0.1',
		port: 8080,
		open: true
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'phaser': phaser,
			'tetris': path.resolve(__dirname, 'src/tetris'),
		}
	},
	module: {
		rules: [
			{test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/'},
			{test: /phaser\.js$/, loader: 'expose-loader?Phaser'}
		]
	}
};
