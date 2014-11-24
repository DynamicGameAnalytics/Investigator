Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('signIn');
  } else {
    this.next();
  }
}, {
  except: ['sign_up', 'event', 'session_token']
});
