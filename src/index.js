'use strict';
const path = require('path');
const React = require('react');
const md5 = require('crypto-js/md5');
const sha1 = require('crypto-js/sha1');
const sha256 = require('crypto-js/sha256');
const sha224 = require('crypto-js/sha224');
const sha512 = require('crypto-js/sha512');
const sha384 = require('crypto-js/sha384');
const sha3 = require('crypto-js/sha3');
const ripemd160 = require('crypto-js/ripemd160');

const hashAlgos = {
  md5,
  sha1,
  sha224,
  sha256,
  sha3,
  sha384,
  sha512,
  ripemd160
}

function generateDisplayObject(copyToClipboard, algoName, hashedValue) {
  return {
    title: algoName,
    subtitle: hashedValue,
    icon: path.resolve(__dirname, 'Users', 'majacobs', 'Projects', 'ap', 'cerebro', 'cerebro-plugin-hash', 'icon.png'),
    clipboard: hashedValue,
    onSelect: (event) => copyToClipboard(hashedValue),
    // onKeyDown: (event) => console.log(event),
    getPreview: () => (
      <div style={{
        maxWidth: '100%',
        wordWrap: 'break-word',
        textAlign: 'center',
        padding: '15px',
        boxSizing: 'border-box'
      }}>
        {hashedValue}
      </div>
    )
  };
}

const plugin = ({term, display, actions}) => {
  const match = new RegExp(`^(?:hash\\s)?(hash|${Object.keys(hashAlgos).join('|')})\\s(.*)$`).exec(term);
  console.log(match);
  if (match) {
    const algoName = match[1];
    const valueToHash = match[2];

    if (algoName === 'hash') {
      display(Object.keys(hashAlgos).map((algoName) => {
        const algo = hashAlgos[algoName];
        const hashedValue = algo(valueToHash).toString();

        return generateDisplayObject(actions.copyToClipboard, algoName, hashedValue);
      }));
    } else {
      const algo = hashAlgos[algoName];
      const hashedValue = algo(valueToHash).toString();

      display(generateDisplayObject(actions.copyToClipboard, algoName, hashedValue));
    }
  }
};

module.exports = {
  fn: plugin,
  name: 'Hash input...',
  keyword: 'hash'
}
