Meteor.publish('games', function() {
  return Games.find({
    owner: this.userId
  });
});
