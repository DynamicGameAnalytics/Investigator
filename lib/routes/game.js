Router.route('/game/:id', {
  controller: 'GameController',
});

GameController = RouteController.extend({
  template: 'game',

  data: function() {
    var game = Games.findOne({
      _id: this.params.id,
    });
    if (!game) {
      return;
    }
    // game.records = Records.find();
    // game.errors = Errors.find();
    // game.chartData = this.getChartData(game);
    return game;
  },

  getChartData: function(game) {
    // var game = this.data() || {
    //   records: []
    // };

    var data = {
      labels: [],
      datasets: [{
        label: "Events",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
      }]
    };
    game.records.forEach(function(record) {
      var label = moment(record.createdAt).format('DD/MM/YYYY HH:mm');
      var index = data.labels.indexOf(label);
      if (index < 0) {
        index = data.labels.push(label) - 1;
        data.datasets[0].data.push(0);
      }
      ++data.datasets[0].data[index];
    });
    return {
      data: data,
      width: 1200,
      height: 400,
      options: {}
    };
  },

  action: function() {
    this.render();
  },

  waitOn: function() {
    return [
      Meteor.subscribe('games'),
      Meteor.subscribe('sharableGames'),
      Meteor.subscribe('records', this.params.id),
      Meteor.subscribe('errors', this.params.id),
    ];
  },
});
