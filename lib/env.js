/*
 * 環境変数の読み出しで、
 * ローカル開発環境とdotcloud環境の差異を吸収するためのラッパー
 */

var path = require('path')
  , fs = require('fs');

var DOTCLOUD_ENV_FILE = '/home/dotcloud/environment.json';

var env = process.env;

// dotcloud は v0.4 系なので、JSON はrequire できない
if (path.existsSync(DOTCLOUD_ENV_FILE)) {
  env = JSON.parse(fs.readFileSync(DOTCLOUD_ENV_FILE, 'utf-8'));
}

module.exports = env;
