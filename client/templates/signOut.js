Template.signOut.events({
  'click #signOut': function(event) {
    Meteor.logout();
  }
});
