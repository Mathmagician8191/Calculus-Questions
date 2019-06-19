var math = require("algebrite");
var normal = require("random-normal");

function interior(terms, cascade, level3) {
  if (Math.random() < cascade && terms > 1) {
    return "(" + generate(terms - 1, cascade, level3) + ")";
  }
  else {return "(x)"}
}

function generate(terms=4, cascade=0.3, level3=False) {
  /** Generates a random function
    * Terms influences the chance to add an extra term to a function
    * Cascade is the chance to use a function as an argument
    * Level 3 controls whether Level 3 functions are used.
    */
  var function = "";
  while (Math.random() > (1/terms) || function == "") {
    //adds a coefficient
    var coefficient = Math.floor(normal({mean: 1, dev: 3}));
    function += coefficient.toString() + "*";
    
    //give options for functions
    if (level3) {
      var options = ["poly", "exp", "log", "sin", "cos", "tan", "sec", "csc", "cot", "prod", "quot"];
      var weights = [0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
      rand = Math.random();
      for (var i=0; i < 11; i++) {
        if (weights[i] > rand) {
          var option = options[i];
        }
      }
    }
  }
  return function;
}
