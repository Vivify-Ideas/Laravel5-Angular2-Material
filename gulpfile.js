process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir'),
    path = require('path'),
    webpack = require('webpack'),
    fast = process.argv.indexOf('--fast') > -1,
    webpackInput = {
        vendor: 'vendor.ts',
        app: 'main.ts'
    };

if (fast) {
    delete webpackInput.vendor;
}

require('laravel-elixir-livereload');
require('laravel-elixir-webpack-ex');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    if (!fast) {
        mix.sass('app.scss');
    }

    /**
     * Scripts webpack bundling and copying
     **/
    mix.webpack(webpackInput, {
        debug: true,
        devtool: 'source-map',
        resolve: {
            extensions: ['', '.ts', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.html$/, loader: 'raw-loader'
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                '__decorate': 'typescript-decorate',
                '__extends': 'typescript-extends',
                '__param': 'typescript-param',
                '__metadata': 'typescript-metadata'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'app',
                filename: 'app.js',
                minChunks: 4,
                chunks: [
                    'app'
                ]
            })
        ].concat(fast ? [] : [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.js',
                minChunks: Infinity
            })
        ])
    }, 'public/js', 'resources/assets/typescript');

    mix.version([ 'js/app.js' ].concat(fast ? [] : [ 'js/vendor.js', 'css/app.css' ]));

    /**
     * LiveReload
     **/
    mix.livereload([
        'public/build/css/*',
        'public/build/js/*'
    ]);
});