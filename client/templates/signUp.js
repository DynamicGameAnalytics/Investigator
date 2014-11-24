Template.createAccountForm.events({
  'submit form': function(event) {
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Accounts.createUser({
      email: email,
      password: password
    }, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          console.log(err);
          return;
        }
      });
    });
  }
});
