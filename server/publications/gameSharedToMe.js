Meteor.publish('gameSharedToMe', function(game_id) {  

  var user = Meteor.users.findOne({_id: this.userId});	
  var sharedToMe = GameSharedToUser.find({    
    sharedToUser: user.emails[0].address
  });
  console.log("userId " + this.userId);
  sharedToMe.forEach(function(tt){console.log(tt)});
  var gameIds = sharedToMe.map(function(sGame){return sGame.game});
  var games = Games.find({_id: {$in: gameIds}});
  console.log("eee");
  games.forEach(function(tt){console.log(tt)});
  return [sharedToMe, games];
});