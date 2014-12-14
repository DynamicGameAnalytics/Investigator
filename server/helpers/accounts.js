// create another field used for sharing games to users
Accounts.onCreateUser(function(options,user){	
	var publicUsername = Meteor.call('getPublicUsername',user);	
	user.publicUsername = publicUsername;
	return user;
});