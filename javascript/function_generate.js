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
  }
  return function;
}
