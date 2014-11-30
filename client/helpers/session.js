UI.registerHelper("session", function(key) {
  return Session.get(key);
});

UI.registerHelper("sessionEquals", function(key, value){
  return Session.equals(key, value);
});
