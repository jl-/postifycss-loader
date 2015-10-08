### webpack loader for css purify and deduplication

---

```bash
npm install postifycss-loader --save-dev
```

```js
var PostifyCssPlugin = require('postifycss-loader/plugin');
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
    loaders: [
      makeStyleLoader(isDev, false),
      makeStyleLoader(isDev, true)
    ]
  },
  plugins: [new PostifyCssPlugin({staticContent: /*String|Array optional,absolute path of html or js files*/})]
}

```

case: 192kb -> 33kb
