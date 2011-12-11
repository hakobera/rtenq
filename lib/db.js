var mongo = require('mongoskin')
  , env = require('./env');

// コレクション名

/**
 * 回答データのコレクション名
 * @constant
 */
var COLLECTION_ANSWER = 'answer';

/**
 * 接続する MongoDB の URLです。
 * dotcloud 環境では、環境変数から URL を取得します。
 * @constant
 */
var MONGODB_URL = env.MONGOHQ_URL || 'localhost/rtenq';
console.log('MONGODB_URL=%s', MONGODB_URL);

/**
 * MongoDB コネクションオブジェクト
 * @private
 */
var db = mongo.db(MONGODB_URL);

/**
 * アンケートの回答データを保存します。
 *
 * @param {String} answer アンケート回答
 * @param {Function} fn コールバック関数
 */
exports.saveAnswer = function(answer, fn) {
  var obj = {
    value: answer,
    createdAt: Date.now()
  };
  db.collection(COLLECTION_ANSWER).insert(obj, { safe: true }, function(err, docs) {
    fn = fn || function(){};
    if (err) {
      fn(err);
      return;
    }
    fn(null, docs);
  });
};

/**
 * 選択肢ごとの回答数を集計して返します。
 *
 * @param {Function} fn コールバック関数
 */
exports.getSummary = function(fn) {
  db.collection(COLLECTION_ANSWER).group([], {}, { "count": {} }, "function (obj, prev) { if (prev.count[obj.value]) { prev.count[obj.value]++; } else { prev.count[obj.value] = 1; } }", true, function(err, results) {
    fn = fn || function(){};
    if (err) {
      fn(err);
      return;
    }
    fn(null, results[0].count);
  });
};
