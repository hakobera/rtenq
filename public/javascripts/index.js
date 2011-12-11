$(function() {
  var cg = new html5jp.graph.circle("results");

  var socket = io.connect();
  socket.on('update', function (data) {
    console.log(data);
    cg.draw(data.items, { backgroundColor: '#ffffff' });
  });

  var processing = false;
  $('#submit').click(function(e) {
    console.log('clicked');
    e.preventDefault();
    if (!processing) {
      processing = true;
      var value = $('input[name=selection]:checked').val();
      if (value) {
        console.log(value);
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
