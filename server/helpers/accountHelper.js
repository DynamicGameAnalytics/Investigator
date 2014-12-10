Meteor.methods({
    getPublicUsername: function(user){
        var publicUsername;
		if(user.emails && user.emails[0] && user.emails[0].address){
			publicUsername = user.emails[0].address;
		}else if(user.services.github){
			publicUsername = user.services.github.username+"_github"; // adding service name, so that data us unique
		}else if(user.services.facebook){
			publicUsername = user.services.facebook.username+"_facebook";
		}else if(user.services.google){
			publicUsername = user.services.google.email+"_google";
		}else if(user.services.twitter){
			publicUsername = user.services.twitter.screenName+"_twitter"; // didn't actually test twitter
		}
		return publicUsername;
	}
});