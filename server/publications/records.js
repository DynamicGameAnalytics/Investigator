Meteor.publish('records', function(game_id) {
  var game = Games.findOne({
    _id: game_id,
    '$or': [{
      owner: this.userId
    }, {
      isSharableByLink: true
    }, {
      isPublic: true
    }]
  });
  
  if (!game) {
    return;
  }
  return Records.find({
    game: game_id
  });
});
