Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('index');
  } else {
    this.next();
  }
}, {
  except: ['session_token', 'event', 'error']
});
