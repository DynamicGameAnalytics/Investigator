Router.route('/', {
  controller: 'IndexController',
});

IndexController = RouteController.extend({
  template: 'dashboard',

  data: {
    games: function() {
      return Games.find();
    }
  },

  action: function() {
    this.render();
  },

  waitOn: function() {
    return Meteor.subscribe('games');
  }
});
