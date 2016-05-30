/* jshint node: true */
/* eslint no-var: "off", object-shorthand: "off" */
'use strict';

var merge = require('lodash/merge');
var replace = require('broccoli-string-replace');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-rollbar',
  included: function(app) {
    var config = this.project.config(this.app.env).rollbar || {};
    var defaultEnabled = this.app.env !== 'development' && this.app.env !== 'test';
    var enabled = config.enabled == null ? defaultEnabled : config.enabled;
    if (enabled) {
      app.import('vendor/rollbar.js', {
        prepend: true
      });
    }
  },
  treeForVendor: function(vt) {
    var vendorTree = this._super.treeForVendor(vt);

    var config = this.project.config(this.app.env).rollbar || {};
    config = merge({
      enabled: this.app.env !== 'development' && this.app.env !== 'test',
      captureUncaught: true,
      payload: {
        environment: this.app.env
      }
    }, config);

    var clientTree = replace('client', {
      files: ['rollbar.js'],
      pattern: {
        match: /ROLLBAR_CONFIG/g,
        replacement: JSON.stringify(config)
      }
    });

    return mergeTrees([vendorTree, clientTree], {
      overwrite: true
    });
  }
};
