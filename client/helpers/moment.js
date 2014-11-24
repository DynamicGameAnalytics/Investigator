UI.registerHelper("timeFormat", function(datetime, format) {
  if (format)
    return moment(datetime).format(format);
  return moment(datetime).format();
});

UI.registerHelper('fromNow', function(datetime){
  return moment(datetime).fromNow();
});
