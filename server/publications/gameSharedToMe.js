Meteor.publish('gameSharedToMe', function(game_id) {  
  var user = Meteor.users.findOne({_id: this.userId});
  if(!user){
    console.log("error " + this.userId);
    return [];
  }
  var sharedToMe = GameSharedToUser.find({    
    sharedToUser: user.publicUsername
  });    
  var gameIds = sharedToMe.map(function(sGame){return sGame.game});
  var games = Games.find({_id: {$in: gameIds}});  
  return [sharedToMe, games];
});