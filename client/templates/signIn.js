Template.signInForm.events({
  'submit form': function(event) {
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
});
