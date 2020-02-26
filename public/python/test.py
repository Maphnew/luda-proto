#!/usr/bin/env python3
import sys

a = sys.argv[1]
b = sys.argv[2]

def testMLFunction(a,b):
    print(a + b)
    return a + b

c = testMLFunction(a,b)
print('c:', c)