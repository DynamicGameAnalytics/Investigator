Meteor.publish("allUsers", function () {
	var allUsers = Meteor.users.find({});
	/*allUsers.map(function (user) {	  
	  user.oneEmail = user.emails[0].address;
	  console.log(user.oneEmail);
	});*/
	//console.log("eee");
	//console.log(allUsers);
    return allUsers;
});