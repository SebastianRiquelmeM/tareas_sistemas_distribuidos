#!/usr/bin/env python
# -*-coding:utf-8 -*

import sys

current_word = None
current_count = 0
word = None

i=0
documento = ""
for line in sys.stdin:
    if i==0:
        #documento = "documento1.txt"
        documento = line
        i+=1
    else:
        line = line.strip()
        word, count, documento = line.split('\t',2)

        try:
            count = int(count)
        except ValueError:
            continue

        if current_word == word:
            current_count += count
        else:
            if current_word:
                print('{}\t{}\t{}'.format(current_word,current_count, documento))
            current_word = word
            current_count = count


if current_word == word:
    print('{}\t{}\t{}'.format(current_word,current_count, documento))