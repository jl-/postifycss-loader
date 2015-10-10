### webpack loader for css purify and deduplicate, remove unused and duplicated css

---

```bash
npm install postifycss-loader --save-dev
```

```js
var PostifyCssPlugin = require('postifycss-loader/plugin');

function makeStyleLoader(isDev, isLocal) {
  let baseLoader = `css?importLoaders=${isDev ? 2 : 3}${isLocal ? '&modules&localIdentName=[name]_[local]_[hash:base64:5]' : ''}!autoprefixer${isDev ? '' : '!postifycss'}!sass`;
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
      makeStyleLoader(false, false),
    ]
  },
  plugins: [new PostifyCssPlugin({})]
}

```

---
`new PostifyCssPlugin(options)`
  - `staticContent` // String|Array [optional], absolute path of html or js files, contents will be concated and passed along to purifycss(contents,..);
  - `override` // boolean [optional], whether to override the output bundle css file, default `false`.

          `true` => emit the purified and deduplicated css file

          `false` => emit (the purified file) and (the purified & deduplicated file with suffixed filename)
  - `suffix` // string [optional], if `override!==true`, use this as the emited postified css filename suffix, default `.pf`;

case: 192kb -> 33kb
