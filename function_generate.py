from math import e, log, sin, cos
from sympy import sympify, Symbol, limit, diff, collect, trigsimp
from random import random, normalvariate, choices

x = Symbol("x", real=True)

def generate(terms=4, cascade=0.3, level3=False):
    function = ""
    while random() > (1/terms) or function == "":
        coefficient = False
        value = int(normalvariate(1,3))
        if value < 0:
            function = function[:-1] + "-"
            value = abs(value)
        if value == 0:
            continue
        elif value == 1:
            pass
        else:
            function += str(value) + "*"
            coefficient = True
        if level3:
            options = ["poly", "exp", "log", "sin", "cos", "prod", "quot"]
            weights = [0.5, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05]
            option = choices(options, weights)[0]
        else:
            option = "poly"
        if option == "poly":
            exponent = int(normalvariate(1.5,2))
            if exponent == 0:
                if coefficient:
                    function = function[:-1]
                else: function += "1"
            elif random() < cascade and terms > 1:
                function += "(" + generate(terms-1, cascade, level3) + ")"
            else: function += "x"
            if exponent not in [0,1]:
                function += "**" + str(exponent)
        elif option == "exp":
            function += "e**"
            if random() < cascade and terms >1:
                function += "(" + generate(terms-1, cascade, level3) + ")"
            else:
                function += "x"
        elif option == "log":
            function += "log("
            if random() < cascade and terms >1:
                function += generate(terms-1, cascade, level3) + ")"
            else:
                function += "x)"
        elif option == "sin":
            function += "sin("
            if random() < cascade and terms >1:
                function += generate(terms-1, cascade, level3) + ")"
            else:
                function += "x)"
        elif option == "cos":
            function += "cos("
            if random() < cascade and terms >1:
                function += generate(terms-1, cascade, level3) + ")"
            else: function += "x)"
        elif option == "prod":
            if random() < cascade and terms > 1:
                left = "(" + generate(terms-1, cascade, level3) + ")"
            else: left = "x"
            if random() < cascade and terms > 1:
                right = "(" + generate(terms-1, cascade, level3) + ")"
            else: right = "x"
            function += left + "*" + right
        elif option == "quot":
            if random() < cascade and terms > 1:
                left = "(" + generate(terms-1, cascade, level3) + ")"
            else: left = "x"
            if random() < cascade and terms > 1:
                right = "(" + generate(terms-1, cascade, level3) + ")"
            else: right = "x"
            function += left + "/" + right
        function += "+"
    return function[:-1]

def value(function, x):
    return eval(function)

def gradient(function, x, gap=8**-7):
    return (value(function, x+gap) - value(function, x-gap)/(2 * gap))

while True:
    function = collect(sympify(generate(5, 0.35, True)), x)
    print(function)
    input("")

