Router.route('/newGame', {
  controller: 'NewGameController',
  name: 'newGame'
});

NewGameController = RouteController.extend({
  template: 'newGame',

  action: function() {
    this.render();
  }
});
