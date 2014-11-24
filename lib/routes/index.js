Router.route('/', function() {
  this.render('index', {
    data: {
      games: function() {
        return Games.find({
          owner: Meteor.userId()
        });
      }
    }
  });
});
