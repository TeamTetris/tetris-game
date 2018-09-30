const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.min.js');

module.exports = {
	entry: './src/tetris/game.ts',
	mode: 'production',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	node: {
		fs: 'empty'
	},
	devServer: {
		contentBase: path.resolve(__dirname, './'),
		publicPath: '/build/',
		host: '127.0.0.1',
		port: 8080,
		open: true
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		alias: {
			'phaser': phaser,
			'tetris': path.resolve(__dirname, 'src/tetris'),
		}
	},
	module: {
		rules: [
			{test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/'},
			{test: /phaser\.min\.js$/, loader: 'expose-loader?Phaser'},
			{test:/\.(s*)css$/, use:['style-loader','css-loader', 'sass-loader']}
		]
	},
	optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'libs',
          chunks: 'all'
        }
      }
    }
  }
};
