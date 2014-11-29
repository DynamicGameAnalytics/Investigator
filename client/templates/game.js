Template.createGameForm.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = event.target.name.value;
    if (!Meteor.userId()) {
      console.log('not signed in');
      return;
    }
    Games.insert({
      name: name,
      owner: Meteor.userId()
    }, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Game created');
    });
  }
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
    var time = moment(record.createdAt).startOf(Session.get('graphs.records.dataUnit'));

    var timeString = time.toISOString();
    var timeBefore = time.subtract(1, Session.get('graphs.records.dataUnit')).toISOString();
    var timeAfter = time.add(2, Session.get('graphs.records.dataUnit')).toISOString();
    // console.log(timeString);
    // console.log(timeAfter);
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
    renderer: 'bar',
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
