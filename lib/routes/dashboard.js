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
    publicGames: function(){
      return Games.find(
      {
        owner: {$ne: Meteor.userId()}
      },
      {
        isPublic: true
      });
    }
  },

  action: function() {
    this.render();
  },

  waitOn: function() {
    return [
      Meteor.subscribe('games'),
      Meteor.subscribe('publicGames'),
    ];
  }
});
