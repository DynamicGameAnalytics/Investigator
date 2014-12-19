Router.route('/game/:_id', {
  controller: 'GameController',
  name: 'game.show'
});

GameController = RouteController.extend({
  template: 'game',

  data: function() {
    var game = Games.findOne({
      _id: this.params._id,
    });
    if (!game) {
      this.render('notFound');
      return;
    }
    // game.records = Records.find();
    // game.errors = Errors.find();

    var gameSharedToUser = GameSharedToUser.find({game: game._id});
    game.gameSharedToUser = gameSharedToUser;

    return game;
  },

  action: function() {
    this.render();
  },

  waitOn: function() {
    return [
      Meteor.subscribe('games'),
      Meteor.subscribe('sharableGames'),
      Meteor.subscribe('records', this.params._id),
      Meteor.subscribe('errors', this.params._id),
      Meteor.subscribe('allUsers'),
      Meteor.subscribe('gameSharedToUser', this.params._id),
      Meteor.subscribe('gameSharedToMe'),
      Meteor.subscribe('files')
    ];
  },
});
