Meteor.publish('userPublicUsername', function () {
	return pp = Meteor.users.find(
		{_id:this.userId},
		 {fields: {publicUsername: 1} }
	);		
});