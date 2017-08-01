# Optimize CSS Classnames

[![codecov](https://codecov.io/gh/vreshch/optimize-css-classnames-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/vreshch/optimize-css-classnames-plugin)
[![Build Status](https://travis-ci.org/vreshch/optimize-css-classnames-plugin.svg?branch=master)](https://travis-ci.org/vreshch/optimize-css-classnames-plugin)


Webpack plugin: Optimize css class names:

Minimize CSS class names and give minimization up to 70% for css files
and ~10% for html template minimization.

## Minification principle:

FROM :
```html
  <div class="long-class-name"></div>
```
```css
  .long-class-name {
  }
```
TO :
```html
  <div class="a"></div>
```
```css
  .a {
  }
```

## The plugin work together with other loaders:

* [optimize-css-classnames-html](https://github.com/vreshch/optimize-css-classnames-html)
* [optimize-css-classnames-angularjs](https://github.com/vreshch/optimize-css-classnames-angularjs)

## Webpack configuration example (for Jquery):

```js
const OptimizeCSSClassnamesPlugin = require('optimize-css-classnames-plugin');

module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
       },
       {
            test: /\.(html)$/,
            use: [{
                loader: 'html-loader'
            }, {
                loader: 'optimize-css-classnames-html'
            }]
       }]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new OptimizeCSSClassnamesPlugin({
            prefix: '_'
        })
    ]
}
```

## Configuratiob Examples:
* [Jquery](https://github.com/vreshch/optimize-css-classnames-examples/tree/master/src/1-jquery)
* [Angular 1.5](https://github.com/vreshch/optimize-css-classnames-examples/tree/master/2)
