Router.route('/', function() {
  this.render('dashboard', {
    data: {
      games: function() {
        return Games.find({
          owner: Meteor.userId()
        });
      }
    }
  });
});
