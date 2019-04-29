const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM();

module.exports = {
  entry: {
    //react: "./node_modules/react/umd/react.development.js",
    //reactDom: "./node_modules/react-dom/umd/react-dom.development.js",
    app: './src/index.tsx',
    //static: './src/static.tsx',
  },
  plugins: [
    // This will clear out any downloaded data from `pull-data.sh`
    // new CleanWebpackPlugin(['dist']),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '/dist'),
    libraryTarget: 'umd', // required for static generation.
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      { test: /\.(png|svg|jpg|gif|txt|html)$/, loader: "file-loader" },

      {
        test: /\.po$/,
        use: [
          { loader: "json-loader" },
          { loader: "po-gettext-loader" }
        ]},
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // However, that doesn't work well with the HtmlWebpackPlugin.
  externals: {
    //"react": "React",
    //"react-dom": "ReactDOM"
  }
};
