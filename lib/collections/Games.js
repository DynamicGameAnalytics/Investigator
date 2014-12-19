Games = new Mongo.Collection('games', {
  transform: function(doc){
    doc.cover = Files.findOne(doc.coverID);
    return doc;
  }
});

Games.attachSchema(new SimpleSchema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  owner: {
    type: String,
    autoValue: function(){
      if (this.isInsert) {
        return this.userId;
      } else if (this.isUpsert) {
        return {$setOnInsert: this.userId};
      }
    }
  },
  coverID: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
  isSharableByLink: {
    type: Boolean,
    optional: true
  },
  isPublic: {
    type: Boolean,
    optional: true
  }
}));
