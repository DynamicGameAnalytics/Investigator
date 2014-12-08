Meteor.publish('gameSharedToMe', function(game_id) {  
  var user = Meteor.users.findOne({_id: this.userId});	
  var sharedToMe = GameSharedToUser.find({    
    sharedToUser: user.emails[0].address
  });    
  var gameIds = sharedToMe.map(function(sGame){return sGame.game});
  var games = Games.find({_id: {$in: gameIds}});  
  return [sharedToMe, games];
});