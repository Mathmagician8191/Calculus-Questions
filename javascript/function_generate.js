var result;
var terms;
var cascade;
var level;
var answer;
var box;
var difficulty;
var right = 0;
var wrong = 0;
var streak = 0;

if (!localStorage.streak) {
	localStorage.streak = JSON.stringify({
		diff: {
			level2: 0,
			easy: 0,
			medium: 0,
			hard: 0
		},
		intg: {
			level2: 0,
			easy: 0,
			medium: 0,
			hard: 0
		}
	});
}
var streakRecord = JSON.parse(localStorage.streak)

function interior(terms, cascade, level) {
	if (Math.random() < cascade && terms > 1) {
		return "(" + generate(terms - 1, cascade, level) + ")";
	}
	else {return "(x)";}
}

function generate(terms=4, cascade=0.3, level=0) {
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
		var options;
		var weights;
		switch (level) {
			case 2:
				options = ["poly", "exp", "log", "sin", "cos", "tan", "sinh", "cosh", "tanh", "arcsin", "arctan", "prod", "quot"];
				weights = [0.275, 0.375, 0.475, 0.575, 0.675, 0.775, 0.8, 0.825, 0.85, 0.875, 0.9, 0.95, 1];
				break;
			case 1:
				options = ["poly", "exp", "log", "sin", "cos", "tan", "prod", "quot"];
				weights = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1];
				break;
			case 0:
				options = ["poly"];
				weights = [1];
				break;
		}
		var rand = Math.random();
		var numOptions = weights.length;
		for (var i=0; i < numOptions; i++) {
			if (weights[i] > rand) {
				var option = options[i];
				break;
			}
		}
		switch (option) {
			//polynomial
			case "poly":
				var exponent = Math.floor(chance.normal({mean: 1.5, dev: 2}));
				func += interior(terms, cascade, level) + "^(" + exponent.toString() + ")";
				break;
			//miscellaneous functions
			case "exp":
			case "log":
			//trig functions
			case "sin":
			case "cos":
			case "tan":
			case "sinh":
			case "cosh":
			case "tanh":
			case "arcsin":
			case "arctan":
				func += option + interior(terms, cascade, level);
				break;
			//product of two functions
			case "prod":
				var left = interior(terms, cascade, level);
				var right = interior(terms, cascade, level);
				func += left + "*" + right;
				break;
			//quotient of two functions
			case "quot":
				var left = interior(terms, cascade, level);
				var right = interior(terms, cascade, level);
				func += left + "/" + right;
				break;
			default:
				console.log("Error! Could be cause of bug!")
				console.log(option)
		}
		func += "+";
	}
	return func.slice(0,-1);
}

function update() {
	//updates the difficulty
	difficulty = document.querySelector('input[name=difficulty]:checked').value;
	var colour = document.body.style;
	switch (difficulty) {
		case "level2":
			terms = 3;
			cascade = 0.05;
			level = 0;
			colour.background = "#e6ffcc";
			break;
		case "easy":
			terms = 3;
			cascade = 0.1;
			level = 1;
			colour.background = "#ffffcc";
			break;
		case "medium":
			terms = 4;
			cascade = 0.25;
			level = 1;
			colour.background = "#ffddcc";
			break;
		case "hard":
			terms = 5;
			cascade = 0.4;
			level = 1;
			colour.background = "#ffcccc";
			break;
		case "first-year":
			terms = 5;
			cascade = 0.5;
			level = 2;
			colour.background = "#cc9999";
			break;
	}
	document.getElementById("result").innerHTML = ""
	right = 0;
	wrong = 0;
	streak = 0;
	score();
	gen();
}

function preview() {
	//previews user function
	answer = box.value;
	var output = document.getElementById("result");
	katex.render(Algebrite.run("printlatex(" + answer + ")"), output, {throwOnError: false});
}

function enter () {
	//registers pressing enter
	if (answer == box.value) {
		submit();
	}
	else {preview()}
}

function score() {
	//update score
	streakOutput = document.getElementById("streak")
	streakOutput.innerHTML = "Correct: " + right.toString() + " Wrong: " + wrong.toString() + " Streak: " + streak.toString() + " Record: " + streakRecord[type][difficulty].toString();
}

generate();

document.addEventListener("DOMContentLoaded", function() {
	//stuff to do once page has loaded properly (DOM-related)
	table = document.getElementById("table")
	renderMathInElement(table)
	box = document.getElementById("answer");
	box.addEventListener("keydown", function (e) {
		if (e.keyCode == 13) {
			enter()
		}
	});
})
