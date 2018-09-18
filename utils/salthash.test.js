let sandh = require('./salthash');

const pw_example = 'hello_world!';

x = sandh.saltAndHash(pw_example);

console.log("pw: " + pw_example);
console.log("hash: " + x);
console.log("positive match: " + sandh.compare(pw_example, x));
console.log("positive match: " + sandh.compare('world peace', x));