function setChartData() {
  var element = document.querySelector('#records-graph');
  if (!element){
    return;
  }
  var start = moment();

  var dataStart = moment().subtract(1, Session.get('graphs.records.dataInterval'));
  var dataEnd = moment();

  var rawData = {};

  rawData[dataStart.toISOString()] = {};
  rawData[dataEnd.toISOString()] = {};

  var cols = [{
    type: 'datetime'
  }];
  var types = [];

  Records.find({
    createdAt: {
      "$gte": dataStart.toDate(),
      "$lt": dataEnd.toDate()
    }
  }).forEach(function(record) {
    var type = record.event.type;
    var dataUnit = Session.get('graphs.records.dataUnit');
    var time = moment(record.createdAt).startOf(dataUnit);

    var timeString = time.toISOString();
    var timeBefore = time.subtract(1, dataUnit).toISOString();
    var timeAfter = time.add(2, dataUnit).toISOString();
    rawData[timeBefore] = rawData[timeBefore] || {};
    rawData[timeString] = rawData[timeString] || {};
    rawData[timeAfter] = rawData[timeAfter] || {};

    rawData[timeBefore][type] = rawData[timeBefore][type] || 0;
    rawData[timeString][type] = rawData[timeString][type] || 0;
    rawData[timeAfter][type] = rawData[timeAfter][type] || 0;
    ++rawData[timeString][type];
    types.push(type);
  });
  if (types.length === 0) {
    types.push('no data');
  }


  _.uniq(types).forEach(function(type) {
    cols.push({
      type: 'number',
      label: type
    });
  });
  element.cols = cols;

  var rows = [];

  _.keys(rawData).forEach(function(datetime) {
    var row = [moment(datetime).toDate()];
    _.uniq(types).forEach(function(type) {
      var value = rawData[datetime][type] || 0;
      row.push(value);
    });
    rows.push(row);
  });
  element.rows = rows;

  var end = moment();
  console.log('graph rendering took ' + end.diff(start) + 'ms');
}

Template.realtimeGraph.rendered = function() {
  var oldInterval = undefined;
  Session.setDefault('graphs.records.dataUnit', 'm');
  Session.setDefault('graphs.records.dataInterval', 'h');
  Session.setDefault('graphs.records.updateInterval', 's');

  Tracker.autorun(function() {
    if (oldInterval) {
      Meteor.clearInterval(oldInterval);
    }
    var interval = moment.duration(1, Session.get('graphs.records.updateInterval'));
    oldInterval = Meteor.setInterval(setChartData, interval.asMilliseconds());
  });

  Tracker.autorun(setChartData);
  setChartData();
};

Template.realtimeGraph.events({
  "change #recordsGraphDataUnit": function(event, template) {
    Session.set("graphs.records.dataUnit", event.target.value);
  },
  "change #recordsGraphUpdateInterval": function(event, template) {
    Session.set("graphs.records.updateInterval", event.target.value);
  },
  "change #recordsGraphDataInterval": function(event, template) {
    Session.set("graphs.records.dataInterval", event.target.value);
  },
});
