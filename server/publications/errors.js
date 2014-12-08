Meteor.publish('errors', function(game_id) {
  var game = Games.findOne({
    _id: game_id,
    // commented for now, so it works with shared games
    /*'$or': [{
      owner: this.userId
    }, {
      isSharableByLink: true
    }, {
      isPublic: true
    }]*/
  });
  
  if (!game) {
    return;
  }
  return Errors.find({
    game: game_id
  });
});
