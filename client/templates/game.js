Template.createGameForm.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = event.target.name.value;
    if (!Meteor.userId()) {
      console.log('not signed in');
      return;
    }
    Games.insert({
      name: name,
      owner: Meteor.userId()
    }, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Game created');
    });
  }
});
