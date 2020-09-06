// Copyright 2020 Frederic Ruget

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.


// == HATS CALCULATOR =========================================================

// == Globals =================================================================

// -- Command line options ----------------------------------------------------

let opt_e;
let opt_command;
let opt_n;
let opt_m;
let opt_s = "";
let opt_p;

// -- Optimal strategies search -----------------------------------------------

let Z;
let B;
let C;
let msg = "";

// -- Basic strategies --------------------------------------------------------
let T0;

let W0;
let W1;
let W2;
let W3;
let W4;
let W5;
let W6;
let W7;
let W8;
let W9;

let B0;
let B1;
let B2;
let B3;
let B4;
let B5;
let B6;
let B7;
let B8;
let B9;

let C1;
let C2;
let C3;
let C4;
let C5;
let C6;
let C7;
let C8;
let C9;

let R0;
let R1;
let R2;
let R3;

// -- Globals init ------------------------------------------------------------

function globinit() {
    // Command line options
    opt_e = 0;
    opt_command;
    opt_n = -1;
    opt_m = -1;
    opt_s = "";
    opt_p = 0;
    // Optimal strategies search
    Z = kal(); // Show progress each time Z reaches 0
    B = -1; // Best hit score so far
    C = 0;  // Number of occurrences
    msg = "Let's play stacks!";

    // Basic strategies
    T0 = [-1];

    W0 = T0;
    W1 = lr([0, 0], W0);
    W2 = lr([0, 0], W1);
    W3 = lr([0, 0], W2);
    W4 = lr([0, 0], W3);
    W5 = lr([0, 0], W4);
    W6 = lr([0, 0], W5);
    W7 = lr([0, 0], W6);
    W8 = lr([0, 0], W7);
    W9 = lr([0, 0], W8);

    B0 = T0;
    B1 = rr([0, 0], B0);
    B2 = rr([0, 0], B1);
    B3 = rr([0, 0], B2);
    B4 = rr([0, 0], B3);
    B5 = rr([0, 0], B4);
    B6 = rr([0, 0], B5);
    B7 = rr([0, 0], B6);
    B8 = rr([0, 0], B7);
    B9 = rr([0, 0], B8);

    C1 = [0, 0];
    C2 = rs(C1);
    C3 = ds(C1);
    C4 = rs(C3);
    C5 = ds(C3);
    C6 = rs(C5);
    C7 = ds(C5);
    C8 = rs(C7);
    C9 = ds(C7);

    R0 = T0;
    R1 = dr(C3, R0);
    R2 = dr(C3, R1);
    R3 = dr(C3, R2);
}

// == Externals ===============================================================

// -- Standalone --------------------------------------------------------------

function standalone() {
    if (typeof window == 'undefined') return true;
    else return false;
}

// -- Arguments ---------------------------------------------------------------

let args = [];
if (standalone()) {
    // arguments is a special beast that can't be directly copied into an array
    for (let i = 0; i < arguments.length; ++i) args[i] = arguments[i];
} else {
    args = argts; // expected to be provided by browser
}

// -- Exit --------------------------------------------------------------------

function exit(e) {
    if (standalone()) { // called from D8
        quit(e);
    } else {            // called from browser
        quit(e);
    }
}

// -- Display -----------------------------------------------------------------

function disp(s) {
    if (standalone()) { // called from D8
        console.log(s);
    } else {            // called from browser
        document.getElementById("result").innerHTML += s + "\n";
    }
}

// -- Keep alive lapse --------------------------------------------------------

function kal() {
    if (standalone()) { // called from D8
        return 128 * 1024 * 1024;
    } else {            // called from browser
        return 1024 * 1024;
    }
}

// == Commodity Functions =====================================================

// -- Non-optimized log2 ------------------------------------------------------

function log2(n) {
    var l = 0;
    while (n != 1) {
        ++l;
        n = n >> 1;
    }
    return l;
}

// -- Convert numeric digit to string -----------------------------------------

function d2s(d) {
    switch (d) {
        case 0x0: return "0";
        case 0x1: return "1";
        case 0x2: return "2";
        case 0x3: return "3";
        case 0x4: return "4";
        case 0x5: return "5";
        case 0x6: return "6";
        case 0x7: return "7";
        case 0x8: return "8";
        case 0x9: return "9";
        case 0xa: return "a";
        case 0xb: return "b";
        case 0xc: return "c";
        case 0xd: return "d";
        case 0xe: return "e";
        case 0xf: return "f";
    }
}

// -- Parse a strategy --------------------------------------------------------

// ingests string or array, returns array
function parse(s) {
    if (typeof s === 'string') {
        // special case: tower of height 0 with negative choice
        if (s.slice(0,1) == "-") {
            s = [parseInt(s)];
        // general case
        } else {
            let str = s;
            let len = str.length;
            s = [];
            for (let t = -1, i = 0; i < len; ++i) {
                switch (str.slice(i, i+1)) {
                    case "0": s[++t] = 0x0; break;
                    case "1": s[++t] = 0x1; break;
                    case "2": s[++t] = 0x2; break;
                    case "3": s[++t] = 0x3; break;
                    case "4": s[++t] = 0x4; break;
                    case "5": s[++t] = 0x5; break;
                    case "6": s[++t] = 0x6; break;
                    case "7": s[++t] = 0x7; break;
                    case "8": s[++t] = 0x8; break;
                    case "9": s[++t] = 0x9; break;
                    case "a": s[++t] = 0xa; break;
                    case "b": s[++t] = 0xb; break;
                    case "c": s[++t] = 0xc; break;
                    case "d": s[++t] = 0xd; break;
                    case "e": s[++t] = 0xe; break;
                    case "f": s[++t] = 0xf; break;
                    case "-": break;
                    default: {
                        disp("" + i + " " + str.slice(i, i+1));
                        disp("Parsing Error: 6 (invalid digit)");
                        exit(6);
                    }
                }
            }
        }
    }
    if (!Array.isArray(s)) {
        disp("Parsing error: 1 (not an array)");
        exit(1);
    }
    // at least check that the size of the array is a power of 2
    if (s.length != (1 << log2(s.length))) {
        disp("Parsing error: 2 (partial array)");
        exit(2);
    }
    return s;
}

// -- Compute a strategy hit score --------------------------------------------

// Requires s to be an array
function _score(s) {
    let c = s.length; // count of possible towers
    let hits = 0;

    // Test all play configs
    for (let t = 0; t < c; ++t) { // my tower
        var p = 1 << s[t]; // based on t you choose position log2(p)
        for (let u = 0; u < c; ++u) { // your tower
            if (u & p) { // if your guess is successful
                if (t & (1 << s[u])) { // and mine too
                    ++hits; // then we have an additional hit
                }
            }
        }
    }
    return hits;
}

// -- Format a strategy (pretty print) ----------------------------------------

// Requires s to be an array
function _fmt(s) {
    let len = s.length;
    // decide option: full or shortened
    let full = 0;
    for (let i = 0; i < len; ++i) {
        if (s[i] < 0 || s[i] > 15) {
            ++full;
            break;
        }
    }
    if (full) return s.toString();
    let n = log2(len); // height of the strategy
    let buf = "";
    let once = 0;
    for (let i = 0; i < len; ++i) {
        if (!(i % 8)) {
            if (!once) {
                ++once;
            } else {
                if (!(i % 512)) buf += "---";
                else if (!(i % 64)) buf += "--";
                else buf += "-";
            }
        }
        buf += d2s(s[i]);
    }
    return buf;
}

// -- Output a strategy to the console (pretty print) -------------------------

function show(s) {
    s = parse(s);
    let len = s.length;
    disp(""
        + (100 * _score(s) / (len**2)) + "% "
        + "(" + _score(s) + "/" + (len**2) + "): "
        + _fmt(s));
    return s;
}

// -- Format for latex tikz ---------------------------------------------------

//function _node(strats, pos, level) {
//    let n = strats.length;
//    let t = '';
//    let decorate = ' [circle,draw]';
//    if (pos == 0 || pos == 2 ** (level + 1) - 1
//        || (level % 2 && pos == 2 ** level)) decorate = '';
//    t += 'child {_node ' + decorate + '(l' + level + '_' + pos + ') {$' + (strats[level])[pos] + '$}\n';
//    if (decorate == '' && level < n - 1) {
//        t += _node(strats, pos, level + 1);
//        t += _node(strats, pos + 2 ** (level + 1), level + 1);
//    }
//    if (level <= 0) {
//        t += 'edge from parent \n';
//        t += 'node[above] ';
//        if (pos & (2 ** level)) {
//            t += '{$1$}\n';
//        } else {
//            t += '{$0$}\n';
//        }
//    }
//    t += '}\n';
//    return t;
//}
//
//function tikz(strats) {
//    var t = '';
//    t += 
//    t += '\\documentclass[preview]{standalone}\n'
//    t += '\\usepackage{tikz}\n'
//    t += '\\begin{document}\n'
//    t += '\\begin{tikzpicture}[level/.style={sibling distance=100mm/1.8^(#1-1)}]\n'
//    t += '\\node (root){}\n'
//    t += _node(strats, 0, 0);
//    t += _node(strats, 1, 0);
//    t += ';\n'
//    t += '\\end{tikzpicture}\n'
//    t += '\\end{document}\n'
//    disp(t);
//}

// == Operations on strategies ================================================

// -- Transform a strategy by swapping two hats positions ---------------------

// Requires s to be an array
function _swap(s, i, j) {
    let c = s.length;
    let n = log2(c);
    let tower = []; // tower keeps track of the initial tower identity
    // 1- swap bits i and j, keep towers in place
    for (let k = 0; k < c; ++k) {
        // swap the strategy's choice for k
        switch (s[k]) {
            case i: s[k] = j; break;
            case j: s[k] = i; break;
        }
        // swap bits i and j in k's name
        let bi = (k & (1 << i)) >> i; // i-th bit in t
        let bj = (k & (1 << j)) >> j; // j-th bit in t
        tower[k] = (k & ~((1 << i) | (1 << j)))
            | (bi << j) | (bj << i);
    }
    // 2- sort renamed towers
    for (let k = 0; k < c; ++k) {
        if (tower[k] == k) continue;
        for (let l = k + 1; l < c; ++l) {
            if (tower[l] == k) {
                tower[l] = tower[k];
                tower[k] = k;
                let tmp = s[l];
                s[l] = s[k];
                s[k] = tmp;
                break;
            }
        }
    }
    return s;
}

// -- Crush a strategy so that s[i] <= i --------------------------------------

function crush(s) {
    s = parse(s);
    let c = s.length;
    let n = log2(c);
    s[0] = 0;
    s[c-1] = 0;
    for (let t = 0; t < c && t <= n; ++t) {
        if (s[t] < 0 || s[t] >= n) {
            disp("Crushing error: 10 (choice out of range");
            exit(10);
        }
        if (s[t] > t) s = _swap(s, t, s[t]);
    }
    return s;
}

// -- Left reset: (a, b) +--> (b -> a) ----------------------------------------

function lr(a, b) {
    a = parse(a);
    b = parse(b);
    let ca = a.length; // count of possible towers for a
    let m = log2(ca); // height of a
    let cb = b.length; // count of possible towers for b
    let s = []; // to construct (b -> a)
    let i = -1;
    for (let u = 0; u < cb; ++u) {
        s[++i] = b[u] + m;
        for (let t = 1; t < ca; ++t) {
            s[++i] = a[t];
        }
    }
    return s;
}

// -- Right reset: (a, b) +--> (a <- b) ---------------------------------------

function rr(a, b) {
    a = parse(a);
    b = parse(b);
    let ca = a.length; // count of possible towers for a
    let m = log2(ca); // height of a
    let cb = b.length; // count of possible towers for b
    let s = []; // to construct (b -> a)
    let i = -1;
    for (let u = 0; u < cb; ++u) {
        for (let t = 0; t < ca - 1; ++t) {
            s[++i] = a[t];
        }
        s[++i] = b[u] + m;
    }
    return s;
}

// -- Double reset: (a, b) +--> DR(a, b) --------------------------------------

function dr(a, b) {
    a = parse(a);
    b = parse(b);
    let ca = a.length; // count of possible towers for a
    let m = log2(ca); // height of a
    let cb = b.length; // count of possible towers for b
    let s = []; // to construct (b -> a)
    let i = -1;
    for (let u = 0; u < cb; ++u) {
        s[++i] = b[u] + m;
        for (let t = 1; t < ca - 1; ++t) {
            s[++i] = a[t];
        }
        s[++i] = b[u] + m;
    }
    return s;
}

// -- Left shift: a +--> ^a ---------------------------------------------------

function ls(a) {
    a = parse(a);
    let ca = a.length; // count of possible towers for a
    let m = log2(ca); // height of a
    let s = []; // to construct (b -> a)
    let i = -1;
    for (let u = 0; u < 2; ++u) {
        for (let t = 0; t < ca; ++t) {
            if (u != 0 && t == 0) {
                s[++i] = m;
            } else {
                s[++i] = a[t];
            }
        }
    }
    return s;
}

// -- Left shift: a +--> a^ ---------------------------------------------------

function rs(a) {
    a = parse(a);
    let ca = a.length; // count of possible towers for a
    let m = log2(ca); // height of a
    let s = []; // to construct (b -> a)
    let i = -1;
    for (let u = 0; u < 2; ++u) {
        for (let t = 0; t < ca; ++t) {
            if (u == 0 && t == ca - 1) {
                s[++i] = m;
            } else {
                s[++i] = a[t];
            }
        }
    }
    return s;
}

// -- Double shift: a +--> a^^ ------------------------------------------------

function ds(a) {
    a = parse(a);
    let ca = a.length; // count of possible towers for a
    let m = log2(ca); // height of a
    let s = []; // to construct (b -> a)
    let i = -1;
    for (let u = 0; u < 4; ++u) {
        for (let t = 0; t < ca; ++t) {
            if ((u == 0 || u == 2) && t == ca - 1) {
                s[++i] = m;
            } else if ((u == 2 || u == 3) && t == 0) {
                s[++i] = m + 1;
            } else {
                s[++i] = a[t];
            }
        }
    }
    return s;
}

// == Search for optimal strategies ===========================================

// -- Pretty print strategy from expanded format ------------------------------

// This function generates code
// Requires seed to be an array
function _code_fm(seed) {
    let len = seed.length;
    let n = log2(len);

    let buf = '';
    buf += 'function b2s(d) {\n';
    buf += '    switch (d) {\n';
    for (let i = 0; i < len; ++i) {
    buf += '        case ' + (1 << (i * (n + 1))) + ': return "' + i + '";\n';
    }
    buf += '    }\n';
    buf += '}\n';
    buf += '\n';

    buf += 'function _fm() {\n';
    buf += '    return ""';
    let already = 0;
    for (let i = 0; i < len; ++i) {
        if (!(i % 8)) {
            if (!already) {
                already = 1;
            } else {
                if (!(i % 512))
    buf += ' + "---"';
                else if (!(i % 64))
    buf += ' + "--"';
                else
    buf += ' + "-"';
            }
        }
    buf += ' + b2s(s' + i + ')';
    }
    buf += ';\n';
    buf += '}\n'
    buf += '\n';
    return buf;
}

// -- Update hits according to choice and call next level ---------------------

// This function generates code
// Requires seed to be an array
function _code_sublevel(seed, tower, choice) {
    let len = seed.length;
    let n = log2(len);
    let buf = "";

    // Tell what this code does
    if (choice == seed[tower])
    buf += '        // Compute hit score and call next level\n';
    else
    buf += '        // Update hit score and call next level\n';
    buf += '        // - Seed: [' + _fmt(seed) + ']\n';
    buf += '        // - Exploring choices for tower: ' + tower + ' (_this_ tower)\n';
    buf += '        // - Choice to explore: ' + choice + ' (_this_ choice)\n';
    buf += '\n';

    if (choice != seed[tower]) {
    // Select choice
    buf += '        // Update s[' + tower + '] to ' + choice + ' (as ' + (n + 1) + '-bit block)\n';
    buf += '        s' + tower + ' = ' + (1 << (choice * (n + 1))) + ';\n';
    }

    // Compute hit score contribution of selected choice
    // Pretend _this_ tower as _your_ tower, for which the strategy makes _this_ choice
    // Then in order to get a hit:
    // - _my_ tower must have a white hat at the chosen position
    // - from _my_ tower the strategy must choose a position where _you_ have a white hat

    // Compute the hit contribution in expanded format
    buf += '        // Compute hit score contribution of s[' + tower + '] \n';
    let single = 0;
    let already = 0;
    buf += '        e = (('
    for (let t = 0; t < len; ++t) { // for all possible configurations for _my_ tower
        if (!(t & (1 << choice))) continue; // if _your_ choice points to a black hat: no hit
        if (t == tower) {
            single = 1; // count this hit ony once (and add it last)
        } else { // these hits must be counted twice
            if (already) buf += ' + '; else already = 1;
            buf += 's' + t;
        }
    }
    if (!already) buf += '0';
    buf += ') << 1)' // (count these hits twice)
    if (single) buf += ' + s' + tower; // (add "single" hit last, if any)
    buf += '; // contribution in expanded format\n'

    // Convert the hit contribution to an integer
    already = 0;
    buf += '        h = (';
    for (let position = 0; position < n; ++position) {   // for each position...
        if (!(tower & (1 << position))) continue;             // ...where I have white hat
        if (already) buf += ' + '; else already = 1;
        buf += '(e >> ' + (position * (n + 1)) + ')'; // gather the associated hits
    }
    if (!already) buf += '0';
    buf += ') & ' + ((1 << (n + 1)) - 1) + ';';          // discard garbage bits on the left
    buf += ' // converted to an integer\n';

    // Call the next level
    if (choice == seed[tower]) {
    buf += '        x' + (tower + 1) + '(H); // call the next level\n';
    buf += '        H -= h;\n';
    } else {
    buf += '        x' + (tower + 1) + '(H + h); // call the next level\n';
    }

    return buf;
}

// -- Level implementation ----------------------------------------------------

// This function generates code
// Requires seed to be an array
function _code_level(seed, tower) {
    let len = seed.length;
    let n = log2(len);

    let buf = 'function x' + tower + '(H) { // H is the running hit score\n';

    if (tower == len - 1) {

        // We have reached the end of the exploration, check for high score
        buf += '    if (H >= B) {\n';
        buf += '        if (H > B) { // New high score, reset counter\n';
        buf += '            B = H;\n';
        buf += '            C = 0;\n';
        buf += '        }\n';
        buf += '\n';
        buf += '        msg = "" + H + "[" + ("00" + (++C)).slice(-3) + "]: " + _fm();\n';
        buf += '        disp(msg);\n';
        buf += '    }\n';

    } else if (tower < len - 1) {

        // We are exploring
        buf += '\n';
        buf += '    if (--Z == 0) { // Regularly show progress\n';
        buf += '        disp(msg + " > " + H + ": " + _fm() + " " + performance.now());\n';
        buf += '        Z = ' + kal() + '; // Reset counter\n';
        buf += '    }\n';

        // Tell what this code does
        buf += '\n';
        buf += '    // Implement exploration of level: ' + tower + '\n';
        buf += '    // - Seed: [' + _fmt(seed) + ']\n';
        buf += '\n';

        buf += '\n';
        buf += '    if (opt_m) { // We are still allowed to make modifications\n';
        buf += '\n';
        buf += '        let e, h;\n';

        let choice = seed[tower];
        buf += '\n';
        buf += _code_sublevel(seed, tower, choice);
        buf += '        --opt_m;\n';
        for (let i = 1; i < n && i <= tower; ++i) {
            ++choice;
            if (choice >= n || choice > tower) choice = 0;
        buf += '\n';
        buf += _code_sublevel(seed, tower, choice);
        }

        buf += '\n';
        buf += '        ++opt_m;\n';
        buf += '        s' + tower + ' = ' + (1 << (seed[tower] * (n + 1))) + '; // Restore seed choice\n';

        buf += '\n';
        buf += '    } else { // We are no longer allowed to make modifications\n';
        buf += '        x' + (len - 1) + '(H); // Prune exploration: jump directly to high score\n';
        buf += '    }\n';
    }
    buf += '}\n';

    return buf;
}

// -- Expand seed -------------------------------------------------------------

// This function generates code
// Requires seed to be an array
function _code_expand_seed(seed, tower) {
    let n = log2(seed.length);
    return 's' + tower + ' = ' + (1 << ((n + 1) * seed[tower]));
}

// == Main ====================================================================

function cliparse(args) {
    // Initialize globals
    globinit();
    // Parse command line
    while (args.length) {
        switch (args[0]) {
            case "-h": // print manual
                disp("hats -n <height> -m <count> -s <seed> // look for optimal strategies");
                disp("  <height> specifies the height, defaults to 0");
                disp("  <count> specifies max modifications, defaults to 2**height0");
                disp("  <seed> specifies a seed strategy, defaults to constant 0");
                disp("  e.g.: hats -n 4");
                disp("hats -e <expressions> // compute expression");
                disp("  <expressions> can combine show, lr, rr, dr, ls, rs, ds");
                disp("  e.g.: hats -e 'show(ds(" + '"' + "[00]" + '"' + "))';")
                break;
            case "-n": // height
                args = args.slice(1);
                opt_n = parseInt(args[0]);
                break;
            case "-m": // max modifications
                args = args.slice(1);
                opt_m = parseInt(args[0]);
                break;
            case "-s": // seed strategy
                args = args.slice(1);
                opt_s = args[0];
                break;
            case "-e": // execute command
                ++opt_e;
                args = args.slice(1);
                opt_command = args[0];
                break;
            case "-p": // measure performance
                ++opt_p;
                break;
            default: // parsing error
                disp("Parsing error: 7 (cannot parse command line)");
                exit(7);
        }
        args = args.slice(1);
    }

    // Deal with parameters for strategy search
    if (opt_n != -1 || opt_s != "") {
        //disp("n=" + opt_n + " m=" + opt_m + " s=" + opt_s + " l=" + opt_s.length);
        if (opt_n == -1 && opt_s == "") {
            opt_n = 0;
        }
        if (opt_s == "") {
            opt_s = '"';
            for (let i = 0; i < 2 ** opt_n; ++i) opt_s += '0';
            opt_s += '"';
        }
        opt_s = eval(opt_s);
        if (!Array.isArray(opt_s)) opt_s = parse(opt_s);
        if (opt_n == -1) opt_n = log2(opt_s.length);
        if (log2(opt_s.length) != opt_n) {
            disp("Parameter error: 4 (-n does not match seed strategy height)");
            exit(4);
        }

        if (opt_n > 5) {
            disp("Parameter error: 7 (cannot handle height > 5)");
            exit(7);
        }

        // Check acceptability of seed
        for (let i = opt_s.length - 2; i >= 0 ; --i) {
            if (opt_s[i] < 0 || opt_s[i] >= opt_n || opt_s[i] > i || opt_s[opt_s.length - 1] != 0) {
                disp("Parameter error: 8 (strategy out of domain, crush() first)");
                exit(8);
            }
        }

        if (opt_m == -1) opt_m = opt_s.length - 2;
    }
}

function hats(args) {
    // Parse command line
    cliparse(args);

    // == A/ Evaluate expression ==================================================

    if (opt_e) {
        res = eval(opt_command);
        if (!Array.isArray(res)) res = parse(res);
        show(res);

    // == B/ Look for optimal strategies ==========================================

    } else if (opt_n != -1) {
        // Create display functions for expanded format
        eval(_code_fm(seed));
        // Create expanded format for seed
        for (let i = seed.length - 1; i >= 0; --i) eval(_code_expand_seed(seed, i));
        // Create hardcoded explore functions for expanded format
        for (let i = seed.length - 1; i > 0; --i) eval(_code_level(seed, i));
        // Launch search
        x1(_score(seed));
    }
}

// == Fast track when called from D8 ==========================================

// The reason this code is not encapsulated within a function
// is because this give a huge performance boost.
// This is due to use of eval to define functions.
// This code does not compile with JavaScript strict.
if (standalone()) {
    // Parse command line
    cliparse(arguments);

    // == A/ Evaluate expression ==============================================

    if (opt_e) {
        res = eval(opt_command);
        if (!Array.isArray(res)) res = parse(res);
        show(res);

    // == B/ Look for optimal strategies ======================================

    } else if (opt_n != -1) {

        // Create display functions for expanded format
        eval(_code_fm(opt_s));
        // Create expanded format for seed
        for (let i = opt_s.length - 1; i >= 0; --i) eval(_code_expand_seed(opt_s, i));
        // Create hardcoded explore functions for expanded format
        for (let i = opt_s.length - 1; i > 0; --i) eval(_code_level(opt_s, i));
        // Launch search
        x1(_score(opt_s));

    } else if (0) {

    // == C/ Produce tikz graphs ==============================================
    
    }
}

// == The end =================================================================
