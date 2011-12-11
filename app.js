
/**
 * Module dependencies.
 */

var express = require('express')
  , sio = require('socket.io')
  , routes = require('./routes')
  , env = require('./lib/env')
  , db = require('./lib/db');

console.log(process.versions);

var app = module.exports = express.createServer();
var io = sio.listen(app);

/**
 * アンケート定義
 */
var enquete = {
  title: "Node.js 入門",
  question: "Node.js 入門を受講してみてどう思いましたか？",
  selections: [ "役に立った", "役に立たなかかった", "どちらでもない" ]
};

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Socket
var updateSummary = function(fn) {
  db.getSummary(function(err, results) {
    if (err) {
      fn(err);
      return;
    }

    var data = {}
      , item;
    data.items = [];
    for (k in results) {
      item = [];
      item.push(k);
      item.push(results[k]);
      data.items.push(item);
    }
    fn(null, data);
  });
};

io.sockets.on('connection', function (socket) {
  updateSummary(function(err, data) {
    if (err) {
      return;
    }
    socket.emit('update', data);
  });
});

// Routes

/**
 * アンケート回答画面に遷移させます。
 *
 * @param req
 * @param res
 */
app.get('/', function(req, res) {
  res.render('index', { enquete: enquete })
});

/**
 * アンケートを提出します。
 *
 * @param req
 * @param res
 * @param next
 */
app.post('/submit', function(req, res, next) {
  var selection = req.param('selection');
  console.log(selection);
  if (selection) {
    db.saveAnswer(selection, function(err, docs) {
      if (err) {
        res.send(500);
      } else {
        res.send(200);
        updateSummary(function(err, data) {
          if (err) {
            return;
          }
          io.sockets.emit('update', data);
        });
      }
    });
  }
});

app.listen(process.env.PORT || 8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
