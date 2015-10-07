var path = require('path');
var fs = require('fs');
var postcss = require('postcss');
var purifycss = require('purify-css');
var RawSource = require('webpack/lib/RawSource');

function PostifyCssPlugin(options) {
}

function dedupe(root) {
  root.each(function (node) {
    if (node.nodes) { dedupe(node); }
  });

  root.each(function (node) {
    if (node.type === 'comment') { return; }

    var nodeStr = node.toString();
    while (node = node.next()) {
      if (node.toString() === nodeStr) {
        node = [node.prev(), node.remove()][0];
      }
    }
  });
}


PostifyCssPlugin.prototype.apply = function(compiler) {
  compiler.plugin('this-compilation', function(compilation) {
    compilation.plugin('optimize-tree', function(chunks, modules, cb) {
      var cssModules = modules.filter(function(module) {
        return module.chunks.length && path.extname(module.request) === '.css';
      });
      function rebuildModule(cb) {
        var module = cssModules.pop(), content = '';
        if (!module) return cb();
        module.chunks.forEach(function(chunk) {
          chunk.modules.forEach(function(m) {
            if (m._source && m._source._name.indexOf('.css') === -1 && m._source._name.indexOf('.scss') === -1) {
              content += m._source._value;
            }
          });
        });
        compilation._purifycss_content = content;
        compilation.rebuildModule(module, function(err) {
          if (err) console.log(err);
          rebuildModule(cb);
        });
      }
      rebuildModule(cb);
    });
  });
  compiler.plugin('emit', function(compilation, cb) {
    var assets = compilation.assets;
    Object.keys(assets).forEach(function(assetName) {
      if (path.extname(assetName) === '.css') {
        var asset = assets[assetName];
        var root = postcss.parse(asset.source(), {map: {prev: false}});
        //var root = postcss.parse('a, b {color: red; width: 10px; color: red; color: red; color: red; width: 10px; height: 20px;} c {color: yellow;} d {color: red;} c {color: yellow;} e {color: blue;}');
        dedupe(root);
        assets[assetName + '2.css'] = new RawSource(root.toResult().css);
      }
    });
    cb();
  });
};

module.exports = PostifyCssPlugin;
