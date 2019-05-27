from sympy import sympify, Symbol, limit, diff, collect, trigsimp, simplify, init_printing, pprint, latex, oo, zoo, nan, I, pi #imports key sympy functions
from sympy.functions.elementary.trigonometric import sin, cos, tan, sec, csc, cot #imports all needed trig functions
from sympy.functions.elementary.exponential import exp, log #exponential functions
from random import random, normalvariate, choices #for randomness of function generation
import matplotlib.pyplot as latex_print #for output of latex

x = Symbol("x", real=True) #complex numbers will not be used

def interior(terms, cascade, level3):
    if random() < cascade and terms > 1:
        return "(" + generate(terms - 1, cascade, level3) + ")"
    else: return "(x)"

def generate(terms=4, cascade=0.3, level3=False):
    """
    Generates a random function.
    
    Terms influences the chance to add an extra term to the function.
    Cascade is the chance to use a function as an argument.
    Level 3 controls whether or not functions seen only at Level 3 are shown
    """
    function = "" #function is initially empty
    while random() > (1/terms) or function == "": #the function cannot be blank
        
        #adds a coefficient
        value = int(normalvariate(1,3))
        function += str(value) + "*"
        
        #give options for functions - other trig functions will be added
        if level3:
            options = ["poly", "exp", "log", "sin", "cos", "prod", "quot"]
            weights = [0.5, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05]
            option = choices(options, weights)[0]
        else:
            option = "poly"
        
        #polynomial
        if option == "poly":
            exponent = int(normalvariate(1.5,2))
            function += interior(terms, cascade, level3) + "**" + str(exponent)
        
        #exponential function
        elif option == "exp":
            function += "exp" + interior(terms, cascade, level3)
        
        #log function
        elif option == "log":
            function += "log" + interior(terms, cascade, level3)
        
        #sin function
        elif option == "sin":
            function += "sin" + interior(terms, cascade, level3)
        
        #cos function
        elif option == "cos":
            function += "cos" + interior(terms, cascade, level3)
        
        #product of two functions
        elif option == "prod":
            left = interior(terms, cascade, level3)
            right = interior(terms, cascade, level3)
            function += left + "*" + right
        
        #quotient of two functions
        elif option == "quot":
            left = interior(terms, cascade, level3)
            right = interior(terms, cascade, level3)
            function += left + "/" + right

        #add a + for the next term
        function += "+"
    return function[:-1] #the function has a trailing +

while True: #generates functions for testing purposes
    function = nan
    while function.has(oo, -oo, zoo, nan, I) or function == 0 or not(function.has("x")):
        string = generate(3, 0.35, True)
        collected = collect(sympify(string), x)
        function = simplify(collected)
        trig = trigsimp(collected)
    y = 2
    for item in collected, trig, function:
        tex = latex(item)
        latex_print.plot()
        latex_print.text(0, y, "$%s$"%tex)
        y -= 1
    latex_print.show()
    input("")

