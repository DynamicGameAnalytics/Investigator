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

  var rawData = {};
  this.data.records.forEach(function(record) {
    var type = record.event.type;
    var time = moment(record.createdAt);
    time.milliseconds(0);
    time.seconds(0);

    var timeString = time.toISOString();
    // console.log(timeString);
    rawData[type] = rawData[type] || {};
    rawData[type][timeString] = rawData[type][timeString] || 0;
    ++rawData[type][timeString];
  });

  var series = new Array();
  for (var type in rawData) {
    var serie = {
      name: type,
      color: 'steelblue',
      data: new Array(),
    };
    for (var time in rawData[type]) {
      serie.data.push({
        x: moment(time).unix(),
        y: rawData[type][time]
      });
    }
    serie.data.sort(function(a, b){
      return a.x - b.x;
    });
    series.push(serie);
  }

  // console.log(series);

  var graph = new Rickshaw.Graph({
    element: document.querySelector('#records-graph'),
    renderer: 'bar',
    series: series
  });

  var axes = new Rickshaw.Graph.Axis.Time({
    graph: graph
  });

  graph.render();
};
