#!/usr/bin/env python
# -*-coding:utf-8 -*

import sys

current_word = None
current_count = 0
word = None

for line in sys.stdin:
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
            print('{}\t{}\t{}'.format(current_word,current_count, "documento 1"))
        current_word = word
        current_count = count


if current_word == word:
    print('{}\t{}\t{}'.format(current_word,current_count, "documento 1"))