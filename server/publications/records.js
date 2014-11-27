Meteor.publish('records', function(game_id) {
  var game = Games.findOne(game_id);
  if (game.owner != this.userId) {
    return;
  }
  return Records.find({
    game: game_id
  });
});
