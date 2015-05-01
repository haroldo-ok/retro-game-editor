define(["model", "model/onetomany", "model/tileset"],
function(model, OneToMany, TileSet){
  var Project = model("Project", {
    constructor: function() {
      this.resources = new OneToMany(this, [TileSet], 'projectId');
      Project.BaseModel.apply(this, arguments);
    }
  });
  return Project;
});
