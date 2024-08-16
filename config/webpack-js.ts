import { DefinePlugin, Configuration } from 'webpack'
import { join, resolve } from 'path'
import ESLintPlugin from 'eslint-webpack-plugin'
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts'
import { toCamelCase } from '../js/utils/text'
import { dependencies } from '../package.json'

const SOURCE_DIR = './js'

const babelConfig = {
	presets: [
		'@babel/preset-env',
		'@wordpress/babel-preset-default'
	],
	plugins: [
		['prismjs', {
			languages: ['php', 'php-extras'],
			plugins: ['line-highlight', 'line-numbers']
		}]
	]
}

export const jsWebpackConfig: Configuration = {
	entry: {
		edit: { import: `${SOURCE_DIR}/edit.tsx`, dependOn: 'editor' },
		editor: `${SOURCE_DIR}/editor.ts`,
		manage: `${SOURCE_DIR}/manage.ts`,
		mce: `${SOURCE_DIR}/mce.ts`,
		prism: `${SOURCE_DIR}/prism.ts`,
		settings: { import: `${SOURCE_DIR}/settings.ts`, dependOn: 'editor' }
	},
	output: {
		path: join(resolve(__dirname), '..', 'dist'),
		filename: '[name].js',
		clean: true
	},
	externalsType: 'window',
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'jquery': 'jQuery',
		'tinymce': 'tinymce',
		'codemirror': ['wp', 'CodeMirror'],
		...Object.fromEntries(
			Object.keys(dependencies)
				.filter(name => name.startsWith('@wordpress/'))
				.map(packageName => [
					packageName,
					['wp', toCamelCase(packageName.replace('@wordpress/', ''))]
				])
		)
	},
	resolve: {
		modules: [resolve(__dirname, '..', 'node_modules')],
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: babelConfig
				}
			}
		]
	},
	plugins: [
		new DefinePlugin({
			'process.arch': JSON.stringify('x64')
		}),
		new ESLintPlugin(),
		new RemoveEmptyScriptsPlugin()
	]
}
