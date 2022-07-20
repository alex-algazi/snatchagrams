const fs = require('fs');

const ALPHABET_SIZE = 26;
const input = './assets/NWL2020.json';

class TrieNode {
  constructor() {
    this.definition = null;
    this.children = new Array(ALPHABET_SIZE);
    for (let i = 0; i < ALPHABET_SIZE; i++) {
      this.children[i] = null;
    }
  }
}

let root;

function insert(key, def) {
  let level;
  const length = key.length;
  let index;
  let np = root;

  for (level = 0; level < length; level++) {
    index = key[level].charCodeAt(0) - 97;
    if (np.children[index] == null) {
      np.children[index] = new TrieNode();
    }

    np = np.children[index];
  }

  np.definition = def;
}

function search(key) {
  let level;
  const length = key.length;
  let index;
  let np = root;

  for (level = 0; level < length; level++) {
    index = key[level].charCodeAt(0) - 97;

    if (np.children[index] == null) {
      return null;
    }

    np = np.children[index];
  }

  return np.definition;
}

const data = fs.readFileSync(input);
const dict = JSON.parse(data);

root = new TrieNode();
const words = Object.keys(dict);
const defs = Object.values(dict);
const size = words.length;

for (let i = 0; i < size; i++) {
  insert(words[i], defs[i]);
}

console.log(search('aa'.toUpperCase()));
console.log(search('aaa'.toUpperCase()));
console.log(search('brut'.toUpperCase()));
console.log(search('shit'.toUpperCase()));
console.log(search('ouija'.toUpperCase()));
