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

Template.game.rendered = function() {
  var start = moment();

  var palette = new Rickshaw.Color.Palette({
    scheme: 'colorwheel'
  });

  var rawData = {};

  this.data.records.forEach(function(record) {
    var type = record.event.type;
    var time = moment(record.createdAt);
    time.milliseconds(0);
    time.seconds(0);

    var timeString = time.toISOString();
    var timeBefore = time.subtract(1, 'm').toISOString();
    var timeAfter = time.add(2, 'm').toISOString();
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

  var graph = new Rickshaw.Graph({
    element: document.querySelector('#records-graph'),
    renderer: 'bar',
    // interpolation: 'linear',
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
};
