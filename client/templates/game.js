



Template.game.events({
  "click .toggleIsSharableByLink": function(event, template) {
    Games.update(this._id, {
      $set: {
        isSharableByLink: !this.isSharableByLink
      }
    });
    if (this.isSharableByLink) {
      Games.update(this._id, {
        $set: {
          isPublic: false
        }
      });
      template.find(".toggleIsPublic").checked = false;
    }
    console.log("IsSharableByLink changed");
  },
  "click .toggleIsPublic": function(event, template) {
    Games.update(this._id, {
      $set: {
        isPublic: !this.isPublic
      }
    });
    if (!this.isPublic) {
      Games.update(this._id, {
        $set: {
          isSharableByLink: true
        }
      });
      template.find(".toggleIsSharableByLink").checked = true;
    }
    console.log("IsPublic changed");
  },
  "click .shareToUser": function(event) {
    var email = document.getElementById("inputShareToUser").value;
    if (GameSharedToUser.find({
        game: this._id,
        sharedToUser: email
      }).count() === 0) {
      GameSharedToUser.insert({
        game: this._id,
        sharedToUser: email
      });
    }
    document.getElementById("inputShareToUser").value = "";
  },
  "click .deleteShare": function(event) {
    //alert(this._id +" "+ this.sharedToUser);
    GameSharedToUser.remove({
      _id: this._id
    });
  },
  "change #fileUpload": function(evt) {
    var self = this;
    _.each(evt.target.files, function(file) {
      Files.insert(file, function(err, result) {
        if (err) {
          console.error(err);
          return;
        }
        Games.update(self._id, {
          $set: {
            coverID: result._id
          }
        }, function(err, num) {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    }, this);
  }
});

Template.game.helpers({
  isOwner: function() {
    return this.owner === Meteor.userId();
  },
  settings: function() {
    return {
      position: "top",
      limit: 5,
      rules: [{
        //token: '@',
        collection: Meteor.users,
        field: "publicUsername",
        //field: "_id",
        template: Template.userPill
      }, ]
    }
  },
  // cover: function(){
  //   var cover = Files.findOne(this.coverID);
  //   return cover;
  // }
});

Template.deleteGame.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete game "' + doc.name + '"?')) {
        this.remove();
        Router.go("/");
      }
    };
  }
});
