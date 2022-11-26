#!/usr/bin/env python
# -*-coding:utf-8 -*

import sys
import re

i=0
documento = ""
linea = ""
for line in sys.stdin:
    if i==0:
        line = re.sub(r'\W+',' ',line.strip())
        #documento = "documento1.txt"
        documento = line
        i+=1
    else:
        line = re.sub(r'\W+',' ',line.strip())
        words = line.split()

        for word in words:
            print('{}\t{}\t{}'.format(word,1, documento))