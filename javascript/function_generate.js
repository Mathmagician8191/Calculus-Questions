var result

function interior(terms, cascade, level3) {
  if (Math.random() < cascade && terms > 1) {
    return "(" + generate(terms - 1, cascade, level3) + ")";
  }
  else {return "(x)"}
}

function generate(terms=4, cascade=0.3, level3=false) {
  /** Generates a random function
    * Terms influences the chance to add an extra term to a function
    * Cascade is the chance to use a function as an argument
    * Level 3 controls whether Level 3 functions are used.
    */
  var func = "";
  while ((Math.random() > (1/terms) || func == "") && func.length < (terms*(1+Math.floor(level3)))/(1-cascade)) {
    //adds a coefficient
    var coefficient = Math.floor(chance.normal({mean: 1, dev: 3}));
    func += "(" + coefficient.toString() + ")*";
    
    //give options for functions
    if (level3) {
      var options = ["poly", "exp", "log", "sin", "cos", "tan", "sec", "csc", "cot", "prod", "quot"];
      var weights = [0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
      rand = Math.random();
      for (var i=0; i < 11; i++) {
        if (weights[i] > rand) {
          var option = options[i];
          break;
        }
      }
    }
    else {var option = "poly"}
    switch (option) {
      //polynomial
      case "poly":
        var exponent = Math.floor(chance.normal({mean: 1.5, dev: 2}));
        func += interior(terms, cascade, level3) + "^(" + exponent.toString() + ")";
        break;
      //miscellaneous functions
      case "exp":
      case "log":
      //trig functions
      case "sin":
      case "cos":
      case "tan":
      case "sec":
      case "csc":
      case "cot":
        func += option + interior(terms, cascade, level3);
        break;
      //product of two functions
      case prod:
        left = interior(terms, cascade, level3);
        right = interior(terms, cascade, level3);
        func += left + "*" + right;
        break;
      //quotient of two functions
      case quot:
        left = interior(terms, cascade, level3);
        right = interior(terms, cascade, level3);
        func += left + "/" + right;
        break;
    }
    func += "+"
  }
  return func.slice(0,-1);
}

function gen() {
	result = "";
	while (result == "") {
		try {
			result = Algebrite.simplify(generate()).toString()
			if (result == 0) {
				throw "Not a valid equation"
			}
		}
		catch (err) {
			console.log(err)
		}
	}
	document.getElementById("latex").innerHTML += "\\(" + Algebrite.run("printlatex(" + result + ")").toString() + "\\)"
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function checkAnswer(derivative) {
	return Algebrite.simplify(derivative) == Algebrite.run("d(" + result + ")")
}
generate()
