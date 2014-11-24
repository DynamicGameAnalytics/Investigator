Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('signIn');
  } else {
    this.next();
  }
}, {
  except: ['sign_up']
});
