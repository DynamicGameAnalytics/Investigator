Meteor.publish('errors', function(game_id) {
  var game = Games.findOne(game_id);
  if (!game.isSharableByLink && game.owner != this.userId) {
    return;
  }
  return Errors.find({
    game: game_id
  });
});
