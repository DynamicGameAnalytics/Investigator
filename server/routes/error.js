Router.route('/error/:session_token', {
    where: 'server',
    name: 'error'
  })
  .post(function() {
    var session_token = this.params.session_token;
    var errorData = this.request.body.error;

    if (!errorData) {
      this.response.statusCode = 400;
      return this.response.end(JSON.stringify({
        error: 'error object required'
      }));
    }

    var session = Sessions.findOne(session_token);
    if (!session) {
      this.response.statusCode = 400;
      return this.response.end(JSON.stringify({
        error: 'session_token invalid'
      }));
    }

    Errors.insert({
      game: session.game_token,
      session: session._id,
      error: errorData
    });
    this.response.end(JSON.stringify(errorData));
  });
