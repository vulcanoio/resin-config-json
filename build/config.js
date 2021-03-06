
/*
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

/**
 * @module config
 */
var imagefs, rindle, stringToStream, utils;

imagefs = require('resin-image-fs');

rindle = require('rindle');

stringToStream = require('string-to-stream');

utils = require('./utils');


/**
 * @summary Read a config.json from an image
 * @function
 * @public
 *
 * @param {String} image - image or drive path
 * @param {String} type - device type slug
 *
 * @fulfil {Object} - config.json
 * @returns {Promise}
 *
 * @example
 * config.read('/dev/disk2', 'raspberry-pi').then (config) ->
 * 	console.log(config)
 */

exports.read = function(image, type) {
  return utils.getConfigPartitionInformationByType(type).then(function(configuration) {
    return imagefs.read({
      image: image,
      partition: configuration.partition,
      path: configuration.path
    });
  }).then(rindle.extract).then(JSON.parse);
};


/**
 * @summary Write a config.json to an image
 * @function
 * @public
 *
 * @param {String} image - image or drive path
 * @param {String} type - device type slug
 * @param {Object} config - config.json
 *
 * @returns {Promise}
 *
 * @example
 * config.write '/dev/disk2', 'raspberry-pi',
 * 	username: 'foobar'
 * .then ->
 * 	console.log('Done!')
 */

exports.write = function(image, type, config) {
  config = JSON.stringify(config);
  return utils.getConfigPartitionInformationByType(type).then(function(configuration) {
    return imagefs.write({
      image: image,
      partition: configuration.partition,
      path: configuration.path
    }, stringToStream(config));
  }).then(rindle.wait);
};
