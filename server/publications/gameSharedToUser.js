Meteor.publish('gameSharedToUser', function(game_id) {  
  return GameSharedToUser.find({
    game: game_id
  });
});