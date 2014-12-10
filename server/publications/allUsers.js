Meteor.publish("allUsers", function () {
	var allUsers = Meteor.users.find({});	
    return allUsers;
});