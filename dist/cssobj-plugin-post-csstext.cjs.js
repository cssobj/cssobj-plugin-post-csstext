'use strict';

// ensure obj[k] as array, then push v into it
function arrayKV (obj, k, v, reverse, unique) {
  obj[k] = k in obj ? [].concat(obj[k]) : []
  if(unique && obj[k].indexOf(v)>-1) return
  reverse ? obj[k].unshift(v) : obj[k].push(v)
}

function cssobj_plugin_post_csstext(callback) {

  var cb = function(str) {
    str = str.replace(/^\s*html\s*{\s*}/).replace(/^\s*body\s*{\s*}/)
    typeof callback=='function' && callback(str)
  }

  return function getCSSText(result) {

    var dom = result.cssdom

    if(!dom) return cb(''), result
    var sheet = dom.sheet || dom.styleSheet
    if(sheet.cssText) return cb(sheet.cssText), result

    var str = ''
    var rules = sheet.cssRules || sheet.rules
    for(var i = 1, len = rules.length; i < len; i++) {
      str += rules[i].cssText + '\n'
    }

    return cb(str), result
  }
}

// helper function to add plugin
cssobj_plugin_post_csstext.addPlugin = function(result, callback) {
  arrayKV(result.options.plugins, 'post', cssobj_plugin_post_csstext(callback))
}

module.exports = cssobj_plugin_post_csstext;