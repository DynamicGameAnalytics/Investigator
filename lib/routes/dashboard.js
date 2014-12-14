Router.route('/', {
  controller: 'DashboardController',
  name: 'dashboard'
});

DashboardController = RouteController.extend({
  template: 'dashboard',

  data: {
    games: function() {
      return Games.find({
        owner: Meteor.userId()
      });
    },
    publicGames: function() {
      return Games.find({
        owner: {
          $ne: Meteor.userId()
        },
        isPublic: true
      });
    },
    gameSharedToMe: function(){
      var sharedToMe = GameSharedToUser.find({
        sharedToUser: Meteor.user().publicUsername
      });
      console.log("sharedToMe " + sharedToMe.count() + " " +Meteor.user().publicUsername);
      var gameIds = sharedToMe.map(function(sGame){return sGame.game});
      var games = Games.find({_id: {$in: gameIds}});
      return games;
      //return [];
    }
  },

  action: function() {
    this.render();
  },

  waitOn: function() {
    return [
      Meteor.subscribe('games'),
      Meteor.subscribe('publicGames'),
      Meteor.subscribe('gameSharedToMe'),
      Meteor.subscribe('userPublicUsername')
    ];
  }
});
