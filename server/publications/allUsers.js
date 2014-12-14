Meteor.publish("allUsers", function () {	
	//var allUsers = Meteor.users.find({});	
	var allUsers = Meteor.users.find({_id: {$ne:this.userId}});	// dont offer current user in autocomplete

    return allUsers;
});