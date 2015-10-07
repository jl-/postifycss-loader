# webpack loader for css purify and deduplication

---

```js
function makeStyleLoader(isDev, isLocal) {
  let baseLoader = `css?importLoaders=${isDev ? 2 : 3}${isLocal ? '&modules&localIdentName=[name]__[local]___[hash:base64:5]' : ''}!autoprefixer${isDev ? '' : '!postifycss'}!sass?${sassLoaderConf}`;
  let conf =  {
    test: /\.(css|scss)$/,
    loader: isDev ? `style!${baseLoader}` : ExtractTextPlugin.extract('style', baseLoader, extractTextConf)
  };
  conf[isLocal ? 'exclude' : 'include'] = /statics\/libs/;
  return conf;
}

...

{
  entry:
  output:
  resolve:
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: [PATHS.SRC]
    }, makeStyleLoader(isDev, false), makeStyleLoader(isDev, true), {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg)/,
      loader: 'url?limit=30000&name=[name]-[hash].[ext]'
    }]
  }
}

```
