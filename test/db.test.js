var db = require('../lib/db')

var should = require('should');

describe('db', function() {

  describe('#saveAnswer', function() {
    it('should save answer and return it', function(done) {
      var answer = Math.floor(Math.random() * 10).toString();
      db.saveAnswer(answer, function(err, docs) {
        should.not.exist(err);
        docs.should.be.lengthOf(1);

        var result = docs[0];
        result.should.have.property('_id');
        result.should.have.property('value', answer);
        
        done();
      });
    });
  });

  describe('#getSummary', function() {
    it('should return count of each selection', function(done) {
      db.getSummary(function(err, results) {
        should.not.exist(err);
        console.log(results);

        done();
      });
    });
  });

});