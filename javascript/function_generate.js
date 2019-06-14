var math = require("algebrite")

function interior(terms, cascade, level3) {
  if (Math.random() < cascade && terms > 1) {
    return "(" + generate(terms - 1, cascade, level3) + ")"
  }
  else {return "(x)"}
}

function generate(terms=4, cascade=0.3, level3=False) {
  /** Generates a random function
    * Terms influences the chance to add an extra term to a function
    * Cascade is the chance to use a function as an argument
    * Level 3 controls whether Level 3 functions are used.
    */
  return 0
}
