Router.route('/event/:session_token', {
  where: 'server'
})
.post(function() {
  var session_token = this.params.session_token;
  if (!session_token) {
    this.response.statusCode = 400;
    return this.response.end(JSON.stringify({
      error: 'session_token required'
    }));
  }

  var event = this.request.body.event;
  if (!event) {
    this.response.statusCode = 400;
    return this.response.end(JSON.stringify({
      error: 'event required'
    }));
  }

  var session = Sessions.findOne(session_token);
  if (!session) {
    this.response.statusCode = 400;
    return this.response.end(JSON.stringify({
      error: 'session_token invalid'
    }));
  }

  Records.insert({
    game: session.game_token,
    session: session._id,
    event: event
  });
  this.response.end(JSON.stringify(event));
});
