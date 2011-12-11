var db = require('../lib/db');

/**
 * アンケート定義
 */
var enquete = {
  title: "Node.js 入門",
  question: "Node.js 入門を受講してみてどう思いましたか？",
  selections: [ "役に立った", "役に立たなかかった", "どちらでもない" ]
};

/**
 * アンケート回答画面に遷移させます。
 * 
 * @param req
 * @param res
 */
exports.index = function(req, res){
  res.render('index', { enquete: enquete })
};

/**
 * アンケートを提出します。
 * 
 * @param req
 * @param res
 * @param next
 */
exports.submit = function(req, res, next) {
  var selection = req.param('selection');
  if (selection) {
    db.saveAnswer(selection, function(err, docs) {
      if (err) {
        next(err);
      }
      res.render('index', { enquete: enquete });
    });
  }
};