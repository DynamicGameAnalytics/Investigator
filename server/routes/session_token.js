Router.route('/session_token/:game_token', {
  where: 'server'
})
.get(function() {
  var game_token = this.params.game_token;
  var game = Games.findOne({
    token: game_token
  });
  if (!game) {
    this.response.statusCode = 400;
    return this.response.end(JSON.stringify({
      error: 'game_token invalid'
    }));
  }
  var session_token = Sessions.insert({
    game_token: game_token
  });
  //var session_token = uuid.v4();
  this.response.end(JSON.stringify({
    session_token: session_token
  }));
});