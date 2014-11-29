Meteor.publish('publicGames', function() {
  return Games.find({
    isPublic: true
  });
});