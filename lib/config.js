Router.configure({
  layoutTemplate: 'mainLayout',
  data: {
    games: function() {
      return Games.find({
        owner: Meteor.userId()
      });
    }
  }
});
