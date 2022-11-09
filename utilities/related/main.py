import numpy as np
import pandas as pd
import re
import time
import yaml
import json
import os
from datasketch import MinHash, MinHashLSHForest

def get_shingles(text):
    text = re.sub(r'[^\w\s]','',text)
    tokens = text.lower()
    tokens = tokens.split()
    return tokens

def process_minhash(shingles, permutations):
    m = MinHash(num_perm=permutations)
    for s in shingles:
        m.update(s.encode('utf8'))
    return m

def predict(text, num_results, permutations, forest):
    m = process_minhash(get_shingles(text), permutations)
    return forest.query(m, num_results)

if __name__ == "__main__":

    folder = '../server/blogs/meta'
    rfile = './related.json'

    files = os.listdir(folder)

    permutations = 128

    results = []

    for file in files:
        with open(f'{folder}/{file}', 'r') as f:
            head = yaml.safe_load(f)
            results.append({ 'head': head })

    for i, data in enumerate(results):
        head = data['head']
        shingles = get_shingles(head.get('title'))
        shingles.extend(get_shingles(head.get('subtitle')))
        shingles.extend(get_shingles(head.get('description')))
        shingles.extend(head.get('tags'))
        results[i]['minhash'] = process_minhash(shingles, permutations)

    forest = MinHashLSHForest(num_perm=permutations)
    for i, data in enumerate(results):
        forest.add(i,data['minhash'])
    forest.index()

    for i, data in enumerate(results):
        related = forest.query(data['minhash'], 5)
        related = list(filter(lambda f: f != i, related))
        results[i]['related'] = related

    save = {}

    for data in results:
        related = data['related']
        links = []

        for relate in related:
            links.append(results[relate]['head']['link'])

        save[data['head']['link']] = links

    with open(rfile, 'w') as f:
        json.dump(save, f)

