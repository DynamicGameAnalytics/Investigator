Router.route('/event/:session_token', {
    where: 'server',
    name: 'event'
  })
  .post(function() {
    var session_token = this.params.session_token;

    // var eventString = this.request.body.event;
    // var eventData = JSON.parse(eventString);
    var eventData = this.request.body.event;
    console.log(eventData);
    if (!eventData) {
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
      event: eventData
    });
    this.response.end(JSON.stringify(eventData));
  });
