Meteor.startup(function(){
  Router.onBeforeAction(Iron.Router.bodyParser.json());
});
