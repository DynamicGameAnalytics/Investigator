Template.insertGameForm.events({
  // 'submit form': function(event) {
  //   event.preventDefault();
  //   var name = event.target.name.value;
  //   if (!Meteor.userId()) {
  //     console.log('not signed in');
  //     return;
  //   }
  //   Games.insert({
  //     name: name,
  //     owner: Meteor.userId()
  //   }, function(err) {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     console.log('Game created');
  //   });
  // }
});

function redrawRecordsGraph() {
  var start = moment();

  var dataStart = moment().subtract(1, Session.get('graphs.records.dataInterval'));
  var dataEnd = moment();
  var records = Records.find({
    createdAt: {
      "$gte": dataStart.toDate(),
      "$lt": dataEnd.toDate()
    }
  });

  var palette = new Rickshaw.Color.Palette({
    scheme: 'colorwheel'
  });

  var rawData = {};

  rawData.timeScaler = {};
  rawData.timeScaler[dataStart.toISOString()] = 0;
  rawData.timeScaler[dataEnd.toISOString()] = 0;

  records.forEach(function(record) {
    var type = record.event.type;
    var dataUnit = Session.get('graphs.records.dataUnit');
    var time = moment(record.createdAt).startOf(dataUnit);

    var timeString = time.toISOString();
    var timeBefore = time.subtract(1, dataUnit).toISOString();
    var timeAfter = time.add(2, dataUnit).toISOString();
    // console.log("time: " + timeString);
    // console.log("after: " + timeAfter);
    rawData[type] = rawData[type] || {};
    rawData[type][timeBefore] = rawData[type][timeBefore] || 0;
    rawData[type][timeString] = rawData[type][timeString] || 0;
    rawData[type][timeAfter] = rawData[type][timeAfter] || 0;
    ++rawData[type][timeString];
  });
  // console.log(rawData);
  for (var i in rawData) {
    // console.log('i: ' + i);
    for (var j in rawData) {
      // console.log('j: ' + j);
      if (i === j)
        continue;
      for (var time in rawData[j]) {
        rawData[i][time] = rawData[i][time] || 0;
        // console.log ('set rawData[' + i + '][' + time + '] to ' + rawData[i][time])
      }
    }
  }

  var series = new Array();
  for (var type in rawData) {
    var serie = {
      name: type,
      color: palette.color(),
      data: new Array(),
    };
    for (var time in rawData[type]) {
      serie.data.push({
        x: moment(time).unix(),
        y: rawData[type][time]
      });
    }
    serie.data = serie.data.sort(function(a, b) {
      return a.x - b.x;
    });
    // console.log(serie.data);
    series.push(serie);
  }

  // console.log(series);

  var element = document.querySelector('#records-graph');
  element.innerHTML = '';
  var graph = new Rickshaw.Graph({
    element: element,
    // renderer: 'bar',
    interpolation: 'linear',
    // stack: false,
    series: series
  });

  var timeAxis = new Rickshaw.Graph.Axis.Time({
    graph: graph
  });

  var countAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph
  });

  // var hoverDetail = new Rickshaw.Graph.HoverDetail({
  //   graph: graph
  // });

  // var slider = new Rickshaw.Graph.RangeSlider({
  //   graph: graph,
  //   element: document.querySelector('#records-slider')
  // });

  graph.render();
  var end = moment();
  console.log('graph rendering took ' + end.diff(start) + 'ms');
}


Template.game.rendered = function() {
  var oldInterval = undefined;
  Session.setDefault('graphs.records.dataUnit', 'm');
  Session.setDefault('graphs.records.dataInterval', 'h');
  Session.setDefault('graphs.records.updateInterval', 'm');

  Tracker.autorun(function(){
    if (oldInterval){
      Meteor.clearInterval(oldInterval);
    }
    var interval = moment.duration(1, Session.get('graphs.records.updateInterval'));
    oldInterval = Meteor.setInterval(redrawRecordsGraph, interval.asMilliseconds());
  });

  Tracker.autorun(redrawRecordsGraph);
};

Template.game.events({
  "click .toggleIsSharableByLink": function (event, template) {
    Games.update(this._id, {$set: {isSharableByLink: ! this.isSharableByLink}});
    if(this.isSharableByLink){
      Games.update(this._id, {$set: {isPublic: false}});
      template.find(".toggleIsPublic").checked = false;
    }
    console.log("IsSharableByLink changed");
  },
  "click .toggleIsPublic": function (event, template) {
    Games.update(this._id, {$set: {isPublic: ! this.isPublic}});
    if(! this.isPublic){
      Games.update(this._id, {$set: {isSharableByLink: true}});
      template.find(".toggleIsSharableByLink").checked = true;
    }
    console.log("IsPublic changed");
  },
  "change #recordsGraphDataUnit": function(event, template){
    Session.set("graphs.records.dataUnit", event.target.value);
  },
  "change #recordsGraphUpdateInterval": function(event, template){
    Session.set("graphs.records.updateInterval", event.target.value);
  },
  "change #recordsGraphDataInterval": function(event, template){
    Session.set("graphs.records.dataInterval", event.target.value);
  },
  "click .shareToUser": function(event){
    GameSharedToUser.insert({
      game: this._id,
      sharedToUser: document.getElementById("inputShareToUser").value
    });
    document.getElementById("inputShareToUser").value = "";
  }
});

Template.game.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
});

Template.game.settings = function() {
  return {
   position: "top",
   limit: 1,
   rules: [
     {
       //token: '@',
       collection: Meteor.users,
       field: "emails.0.address",
       //field: "_id",
       template: Template.userPill
     },
   ]
  }
};

Template.userPill.helpers({
  getEmail: function(){
    return this.emails[0].address;
  }
});