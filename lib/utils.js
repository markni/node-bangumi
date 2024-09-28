var PromiseProvider = require('./promise_provider');

/**
 * Helper method that combines two JSON objects
 * @param {object} [defaults] - Source object
 * @param {object} [options] - Target object
 * @returns {object} - Merged object
 */
exports.merge = function (defaults, options) {
  defaults = defaults || {};
  if (options && typeof options === 'object') {
    var keys = Object.keys(options);
    for (var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if (options[k] !== undefined) defaults[k] = options[k];
    }
  }
  return defaults;
};


/**
 * Executes a function and returns either a Promise or uses a callback
 * @param {function} [callback] - Optional callback function
 * @param {function} fn - Function to execute, should accept a callback as its argument
 * @returns {Promise|undefined} Returns a Promise if no callback is provided, otherwise undefined
 * @throws {Error} Throws an error if no Promise provider is set and no callback is provided
 */
exports.promiseOrCallback = function promiseOrCallback(callback, fn) {
  if (typeof callback === 'function') {
    try {
      return fn(callback);
    } catch (error) {
      return process.nextTick(function () {
        throw error;
      });
    }
  }

  var Promise = PromiseProvider.get();

  if (!Promise) throw new Error('Please assign a promise provider via Bangumi.Promise');

  return new Promise(function (resolve, reject) {
    fn(function (error, res) {
      if (error != null) {
        return reject(error);
      }
      if (arguments.length > 2) {
        return resolve(Array.prototype.slice.call(arguments, 1));
      }
      resolve(res);
    });
  });
};