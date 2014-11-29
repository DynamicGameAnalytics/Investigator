Records = new Mongo.Collection('records');

Records.attachSchema(new SimpleSchema({
  game: {
    type: String,
    index: true
  },
  session: {
    type: String
  },
  event: {
    type: Object,
    blackbox: true
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
}));
