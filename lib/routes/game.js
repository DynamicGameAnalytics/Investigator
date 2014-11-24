Router.route('/game/:id', function() {
  this.render('game', {
    data: function() {
      var game = Games.findOne({
        _id: this.params.id,
        owner: Meteor.userId()
      });
      if (!game)
        return;
      game.records = Records.find({
        game: this.params.id
      });
      game.errors = Errors.find({
        game: this.params.id
      });
      return game;
    }
  });
});
