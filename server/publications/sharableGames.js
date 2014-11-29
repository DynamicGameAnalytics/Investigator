Meteor.publish('sharableGames', function() {
  return Games.find({
    isSharableByLink: true
  });
});