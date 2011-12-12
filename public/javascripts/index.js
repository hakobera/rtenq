$(function() {
  var cg = new html5jp.graph.circle("chart");

  var socket = io.connect();
  socket.on('update', function (data) {
    $('div', $('#chartContainer')).remove();
    cg.draw(data.items, { backgroundColor: '#ffffff' });
  });

  var processing = false;
  $('#submit').click(function(e) {
    e.preventDefault();
    if (!processing) {
      processing = true;
      var value = $('input[name=selection]:checked').val();
      if (value) {
        $.post('/submit', { selection: value  })
          .success(function() {
            console.log('ok');
          })
          .error(function() {
            console.log('error');
          })
          .done(function() {
            processing = false;
          })
      }
    } else {
      processing = false;
    }
  });
});
