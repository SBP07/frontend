import webpack           from 'webpack';
import config            from '../../config';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const paths = config.get('utils_paths');

const webpackConfig = {
  name    : 'client',
  target  : 'web',
  entry   : {
    app : [
      paths.project(config.get('dir_src')) + '/app.js'
    ],
    vendor : config.get('vendor_dependencies')
  },
  output : {
    filename   : '[name].js',
    path       : paths.project(config.get('dir_dist')),
    publicPath : '/'
  },
  plugins : [
    new webpack.DefinePlugin(config.get('globals')),
    new webpack.ProvidePlugin({
      'Promise': 'exports?global.Promise!es6-promise',
      'fetch': 'exports?self.fetch!whatwg-fetch'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template : paths.src('index.html'),
      hash     : true,
      filename : 'index.html',
      inject   : 'body'
    })
  ],
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias      : config.get('utils_aliases')
  },
  module : {
    loaders : [
      {
        test : /\.(js|jsx)$/,
        exclude : /node_modules/,
        loader  : 'babel',
        query   : {
          stage    : 0,
          optional : ['runtime'],
          env      : {
            development : {
              plugins : ['react-transform'],
              extra   : {
                'react-transform' : {
                  transforms : [{
                    transform : 'react-transform-catch-errors',
                    imports   : ['react', 'redbox-react']
                  }]
                }
              }
            }
          }
        }
      },
      {
        test    : /\.scss$/,
        loaders : [
          'style-loader',
          'css-loader',
          'autoprefixer?browsers=last 2 version',
          'sass-loader'
        ]
      },
      /* eslint-disable */
      { test: /\.woff(\?.*)?$/,  loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?.*)?$/, loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf(\?.*)?$/,   loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?.*)?$/,   loader: "file-loader?prefix=fonts/&name=[path][name].[ext]" },
      { test: /\.svg(\?.*)?$/,   loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml" },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" }
      /* eslint-enable */
    ]
  },
  sassLoader : {
    includePaths : paths.src('styles')
  }
};

// NOTE: this is a temporary workaround. I don't know how to get Karma
// to include the vendor bundle that webpack creates, so to get around that
// we remove the bundle splitting when webpack is used with Karma.
const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
  'vendor', '[name].js'
);
commonChunkPlugin.__KARMA_IGNORE__ = true;
webpackConfig.plugins.push(commonChunkPlugin);

export default webpackConfig;
