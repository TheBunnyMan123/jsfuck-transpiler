const validChars = /[^\[\]()+!]/;
const fs = require('fs');
const { argv } = require('process');

const zero = '+![]';
const one = '+!![]';

if (argv[argv.length - 1] == '-h') {
    console.log('Set last argument to "false" to disable shouldEval-wrapping of final string');
    return;
}

var shouldEval = !(argv[argv.length - 1] == 'false');
var str = '';
console.log('shouldEval:', shouldEval);

str = fs.readFileSync('./in.js', 'utf8');
console.log('input:', str);

function number(num) {
    num = num.toString().split('');

    let iter = 0;

    let final = '';
    // console.log(num)

    for (let i = 0; i < num.length; i++) {
        let digit = parseInt(num[i]);

        if (iter != 0) {
            final = final + '+';
        }

        if (digit == 0) {
            final = final + `((${zero})+[])`;
        }else if (!digit.isNaN) {
            final = final + `((${one.repeat(digit)})+[])`;
        }

        iter++;
    };

    return '+(' + final + ')';
}

const map = {};

function string(str) {
    let final = [];
    str.split('').forEach(element => {
        if (map[element] == undefined) {
            let ucode = element.charCodeAt(0).toString(16);

            let finalucode = ('0').repeat(4-ucode.length) + ucode;

            // console.log(finalucode, ucode)
            let funccode = `([][${string('flat')}][${string('constructor')}](${string('return"\\u'+finalucode+'"')}))()`;
            final.push(funccode);
        }else {
            final.push(map[element]);
        }
    });
    return final.join('+');
}

map['a'] = `(![]+[])[${number(1)}]`;
map['d'] = `([][[]]+[])[${number(2)}]`;
map['e'] = `(!![]+[])[${number(3)}]`;
map['f'] = `(![]+[])[${number(0)}]`;
map['i'] = `([][[]]+[])[${number(5)}]`;
map['l'] = `(![]+[])[${number(2)}]`;
map['n'] = `([][[]]+[])[${number(1)}]`;
map['r'] = `(!![]+[])[${number(1)}]`;
map['s'] = `(![]+[])[${number(3)}]`;
map['t'] = `(!![]+[])[${number(0)}]`;
map['u'] = `(!![]+[])[${number(2)}]`;

map['c'] = `([][${string('flat')}]+[])[${number(3)}]`;
map['o'] = `([][${string('flat')}]+[])[${number(6)}]`;

function getEval(funcCode) {
    return `[][${string('flat')}][${string('constructor')}](${funcCode})`;
}

map['S'] = `(([]+[])[${string('constructor')}]+[])[${number(9+0)}]`;
map['g'] = `(([]+[])[${string('constructor')}]+[])[${number(9+5)}]`;

map['A'] = `(([])[${string('constructor')}]+[])[${number(9+0)}]`;
map['y'] = `(([])[${string('constructor')}]+[])[${number(9+4)}]`;

map['/'] = `([]+[])[${string('italics')}]()[${number(4)}]`;
map['\\'] = '((' + getEval(`${string('return/a/')}`) + `()[${string('constructor')}]` + '(' + string('/') + '))+[])[' + number(1) + ']';

function getToString(num) {
    return `(${number(num)})[${string('toString')}](${number(36)})`;
}

map['b'] = getToString(11);
map['j'] = getToString(19);
map['h'] = getToString(17);
map['j'] = getToString(19);
map['k'] = getToString(20);
map['m'] = getToString(22);
map['p'] = getToString(25);
map['q'] = getToString(26);
map['v'] = getToString(31);
map['w'] = getToString(32);
map['x'] = getToString(33);
map['z'] = getToString(35);

map[' '] = `([][${string('flat')}]+[])[(${number(8)})]`;
map['('] = `([][${string('flat')}]+[])[(${number(13)})]`;
map[')'] = `([][${string('flat')}]+[])[(${number(14)})]`;
map['"'] = `([]+[])[${string('fontcolor')}]()[${number(12)}]`;

map[1] = '((' + number(1) + ')+[])';
map[2] = '((' + number(2) + ')+[])';
map[3] = '((' + number(3) + ')+[])';
map[4] = '((' + number(4) + ')+[])';
map[5] = '((' + number(5) + ')+[])';
map[6] = '((' + number(6) + ')+[])';
map[7] = '((' + number(7) + ')+[])';
map[8] = '((' + number(8) + ')+[])';
map[9] = '((' + number(9) + ')+[])';
map[0] = '((' + number(0) + ')+[])';

map['1'] = map[1];
map['2'] = map[2];
map['3'] = map[3];
map['4'] = map[4];
map['5'] = map[5];
map['6'] = map[6];
map['7'] = map[7];
map['8'] = map[8];
map['9'] = map[9];
map['0'] = map[0];

// SA

// function fromCharCode(code) {
//     return `${getEval(string('\\'+code))}`
// }

// for (const key in map) {
//     const element = map[key];
//     console.log(key, shouldEval(element))
// }

var transpiled = string(str);

if (shouldEval != true) {
    fs.writeFileSync('./out.js', transpiled);
    // console.log(transpiled)
}else {
    fs.writeFileSync('./out.js', getEval(transpiled) + '()');
    // console.log(getEval(transpiled) + '()')
}

let badchar = transpiled.match(validChars)
if (badchar != null) {
    throw "A non-jsmin character snuck through! The file has still been written for debugging purposes, please report this to the github repo with the input and output file (" + badchar + ")"
}

console.log('Finished!');
