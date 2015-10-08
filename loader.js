var purify = require('purify-css');
var loaderUtils = require('loader-utils');
var qs = require('qs');

function loader(input) {
  var content = this._compilation._purifycss_content;
  this.cacheable && this.cacheable();
  return typeof content === 'undefined' ? input : purify(content, input, {info: true, rejected: true});
}

loader.pitch = function(remainingRequest, precedingRequest, data) {
  var loader;
  var query = loaderUtils.parseQuery(this.query), _query;
  if (!query.demodule) return;
  query.demodule = new RegExp(query.demodule);
  for (var i = this.loaderIndex - 1; ~i; i--) {
    loader = this.loaders[i];
    if (/\/css\-loader\//.test(loader.request)) {
      _query = loaderUtils.parseQuery(loader.query);
      if (_query.modules && query.demodule.test(this.resourcePath)) {
        delete _query.modules;
        delete _query.localIdentName;
        loader.query = '?' + qs.stringify(_query);
      }
      break;
    }
  }
};

module.exports = loader;
