var result;
var terms;
var cascade;
var level3;


function interior(terms, cascade, level3) {
  if (Math.random() < cascade && terms > 1) {
    return "(" + generate(terms - 1, cascade, level3) + ")";
  }
  else {return "(x)";}
}

function generate(terms=4, cascade=0.3, level3=false) {
  /** Generates a random function
    * Terms influences the chance to add an extra term to a function
    * Cascade is the chance to use a function as an argument
    * Level 3 controls whether Level 3 functions are used.
    */
  var func = "";
  while ((Math.random() > (1/terms) || func == "") && func.length < (10*terms)/(1-cascade)) {
    //adds a coefficient
    var coefficient = Math.floor(chance.normal({mean: 1, dev: 3}));
    func += "(" + coefficient.toString() + ")*";
    
    //give options for functions
    if (level3) {
      var options = ["poly", "exp", "log", "sin", "cos", "tan", "prod", "quot"];
      var weights = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1];
      var rand = Math.random();
      for (var i=0; i < 11; i++) {
        if (weights[i] > rand) {
          var option = options[i];
          break;
        }
      }
    }
    else {var option = "poly";}
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
        func += option + interior(terms, cascade, level3);
        break;
      //product of two functions
      case "prod":
        var left = interior(terms, cascade, level3);
        var right = interior(terms, cascade, level3);
        func += left + "*" + right;
        break;
      //quotient of two functions
      case "quot":
        var left = interior(terms, cascade, level3);
        var right = interior(terms, cascade, level3);
        func += left + "/" + right;
        break;
    }
    func += "+";
  }
  return func.slice(0,-1);
}

function update() {
	var difficulty = document.querySelector('input[name=difficulty]:checked').value;
  var colour = document.body.style;
	switch (difficulty) {
		case "level2":
			terms = 3;
			cascade = 0.05;
			level3 = false;
			colour.background = "#99ff99";
			break;
		case "easy":
			terms = 3;
			cascade = 0.1;
			level3 = true;
			colour.background = "#ffff99";
			break;
		case "medium":
			terms = 4;
			cascade = 0.25;
			level3 = false;
			colour.background = "#ffcc99";
			break;
		case "hard":
			terms = 5;
			cascade = 0.4;
			level3 = true;
			colour.background = "#ff9999";
			break;
	}
	document.getElementById("result").innerHTML = ""
	gen()
}

function gen() {
	document.getElementById("latex").innerHTML = "Loading...";
	result = "";
	while (result == "") {
		try {
			result = Algebrite.simplify(generate(terms, cascade, level3)).toString();
			if (result == "" || !(result.includes("x"))) {
				result = "";
				throw "Not a valid equation";
			}
		}
		catch (err) {
			console.log(err);
		}
	}
	latex = document.getElementById("latex")
	katex.render(Algebrite.run("printlatex(" + result + ")").toString(),latex, {throwOnError: false});
	var box = document.getElementById("answer");
	box.addEventListener("keydown", function (e) {
		if (e.keyCode == 13) {
			submit()
		}
	});
}

function checkAnswer(derivative) {
	return Algebrite.simplify(derivative) == Algebrite.run("d(" + result + ")");
}

function submit() {
	var box = document.getElementById("answer");
	var answer = box.value;
	if (answer == "") {return}
	var output = document.getElementById("result");
	var correct = checkAnswer(answer);
	if (correct == true) {
		output.innerHTML = "Correct!";
	}
	else {
		output.innerHTML = "Incorrect! The derivative was: \\(" + Algebrite.run("printlatex(d(" + result + "))").toString() + "\\) not \\(" + Algebrite.run("printlatex(" + answer + ")").toString() + "\\)";
		renderMathInElement(output);
	}
	box.value = "";
	gen();
}

function preview() {
	var box = document.getElementById("answer");
	var answer = box.value;
	var output = document.getElementById("result");
	katex.render(Algebrite.run("printlatex(" + answer + ")"), output, {throwOnError: false});
}

generate();
