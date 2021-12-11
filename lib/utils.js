var PromiseProvider = require('./promise_provider');

/**
 * Helper method that combines two json objects
 * @method merge
 * @static
 * @param [defaults] {object} source object
 * @param [options] {object} target object
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

exports.onEvents = function (res, callback) {
  let data = '';
  res.setEncoding('utf8');

  res.on('data', function (chunk) {
    data += chunk;
  });

  res.on('end', function () {
    try {
      const json = JSON.parse(data);
      if (Object.prototype.hasOwnProperty.call(json, 'error')) callback(json, {});
      else callback(null, json);
    } catch (err) {
      callback(err, {});
    }
  });

  res.on('error', function (err) {
    callback(err, {});
  });
};

exports.promiseOrCallback = function promiseOrCallback(callback, fn) {
  if (typeof callback === 'function') {
    try {
      return fn(callback);
    } catch (error) {
      return process.nextTick(function () {
        throw error;
      })
      ;
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
    }
    )
    ;
  })
  ;
};