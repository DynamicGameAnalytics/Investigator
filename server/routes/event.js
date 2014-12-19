Router.route('/event/:session_token/:event_type', {
    where: 'server',
    name: 'event'
  })
  .get(function() {
    var session_token = this.params.session_token;
    var event_type = this.params.event_type;

    this.response.setHeader('Access-Control-Allow-Origin', '*');
    this.response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    this.response.setHeader('Access-Control-Allow-Credentials', 'FALSE');
    this.response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

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
      event: {
        type: event_type
      }
    });
    this.response.end(JSON.stringify({
      type: event_type
    }));
  });
