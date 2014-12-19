// code to convert accounts that were inserted before into same type of accounts as the new accounts
Meteor.startup(function () {
	var users = Meteor.users.find({});
	users.forEach(function(user){
		if(!user.publicUsername){
			var publicUsername = Meteor.call('getPublicUsername',user);
			Meteor.users.update({_id: user._id}, {$set : {publicUsername: publicUsername}});
		}
	});

	Houston.add_collection(Meteor.users);
	Houston.add_collection(Houston._admins);
});
