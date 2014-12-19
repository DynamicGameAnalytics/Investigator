Router.route('/files/:id', {
  where: 'server',
  name: 'files'
})
.get(function() {
  var file = Files.findOne(this.params.id);
  if (!file){
    this.response.statusCode = 400;
    this.response.end();
  }
  this.response.end(file.data);
});
