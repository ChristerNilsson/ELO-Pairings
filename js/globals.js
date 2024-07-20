// Generated by CoffeeScript 2.7.0
  // import { Tournament } from './tournament.js' 
var xxx,
  indexOf = [].indexOf;

import {
  Tables
} from './page_tables.js';

import {
  Names
} from './page_names.js';

import {
  Standings
} from './page_standings.js';

import {
  Active
} from './page_active.js';

export var g = {};

//##########################################

// g.K = 2 # 20
// g.K0 = 40 # 40=juniors 20=normal 10=masters
// g.k = 1.0 # 0.7

// parameters that affects matching
g.EXPONENT = 1.01; // 1 or 1.01 (or 2)

g.DIFF = 'ELO'; // ELO använder senaste elo i Standings

//g.DIFF = 'POS' # POS använder senaste position i Standings
g.COLORS = 1; // www not ok

//g.COLORS = 2 # www ok

//##########################################
export var print = console.log;

export var range = _.range;

export var scalex = function(x) {
  return x * g.ZOOM[g.state] / 20;
};

export var scaley = function(y) {
  return y * g.ZOOM[g.state];
};

g.seed = 0;

export var random = function() {
  return (((Math.sin(g.seed++) / 2 + 0.5) * 10000) % 100) / 100;
};

export var wrap = function(s) {
  return `(${s})`;
};

g.BYE = -1;

g.PAUSE = -2;

g.TABLES = 0;

g.NAMES = 1;

g.STANDINGS = 2;

g.ACTIVE = 3;

g.pages = [];

g.message = "";

g.scoringProbability = function(diff) {
  return 1 / (1 + pow(10, diff / 400));
};

g.showType = function(a) {
  if (typeof a === 'string') {
    return `'${a}'`;
  } else {
    return a;
  }
};

export var assert = function(a, b) {
  if (!_.isEqual(a, b)) {
    return print(`Assert failure: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
  }
};

g.ok = function(a, b) {
  var ref;
  return a.id !== b.id && (ref = a.id, indexOf.call(b.opp, ref) < 0) && abs(a.balans() + b.balans()) <= g.COLORS;
};

g.other = function(col) {
  if (col === 'b') {
    return 'w';
  } else {
    return 'b';
  }
};

g.myRound = function(x, decs) {
  return x.toFixed(decs);
};

assert("2.0", g.myRound(1.99, 1));

assert("0.6", g.myRound(0.61, 1));

g.ints2strings = function(ints) {
  return `${ints}`;
};

assert("1,2,3", g.ints2strings([1, 2, 3]));

assert("1", g.ints2strings([1]));

assert("", g.ints2strings([]));

g.res2string = function(ints) {
  var i;
  return ((function() {
    var j, len, results;
    results = [];
    for (j = 0, len = ints.length; j < len; j++) {
      i = ints[j];
      results.push(i.toString());
    }
    return results;
  })()).join('');
};

assert("123", g.res2string([1, 2, 3]));

assert("1", g.res2string([1]));

assert("", g.res2string([]));

g.zoomIn = function(n) {
  return g.ZOOM[g.state]++;
};

g.zoomOut = function(n) {
  return g.ZOOM[g.state]--;
};

g.setState = function(newState) {
  if (g.tournament.round > 0) {
    return g.state = newState;
  }
};

g.invert = function(arr) {
  var i, j, len, ref, res;
  res = [];
  ref = range(arr.length);
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    res[arr[i]] = i;
  }
  return res;
};

assert([0, 1, 2, 3], g.invert([0, 1, 2, 3]));

assert([3, 2, 0, 1], g.invert([2, 3, 1, 0]));

assert([2, 3, 1, 0], g.invert(g.invert([2, 3, 1, 0])));

xxx = [[2, 1], [12, 2], [12, 1], [3, 4]];

xxx.sort(function(a, b) {
  var diff;
  diff = a[0] - b[0];
  if (diff === 0) {
    return a[1] - b[1];
  } else {
    return diff;
  }
});

assert([[2, 1], [3, 4], [12, 1], [12, 2]], xxx);

assert(true, [2] > [12]);

assert(true, "2" > "12");

assert(false, 2 > 12);

// xxx = [[2,1],[12,2],[12,1],[3,4]]
// assert [[2,1],[12,1],[12,2],[3,4]], _.sortBy(xxx, (x) -> [x[0],x[1]])
// assert [[3,4],[2,1],[12,1],[12,2]], _.sortBy(xxx, (x) -> -x[0])
// assert [[2,1],[12,1],[3,4],[12,2]], _.sortBy(xxx, (x) -> x[1])
// assert [[3,4],[12,1],[2,1],[12,2]], _.sortBy(xxx, (x) -> -x[1])
g.calcMissing = function() {
  var j, len, missing, p, ref;
  missing = 0;
  ref = g.tournament.persons;
  for (j = 0, len = ref.length; j < len; j++) {
    p = ref[j];
    if (!p.active) {
      continue;
    }
    if (g.BYE === _.last(p.opp)) {
      continue;
    }
    if (p.res.length < p.col.length) {
      missing++;
    }
  }
  g.message = `${Math.floor(missing / 2)} results missing`;
  return missing;
};

g.sum = function(s) {
  var item, j, len, res;
  res = 0;
  for (j = 0, len = s.length; j < len; j++) {
    item = s[j];
    res += parseFloat(item);
  }
  return res;
};

assert(6, g.sum('012012'));

g.sumNumbers = function(arr) {
  var item, j, len, res;
  // print 'sumNumbers',arr
  res = 0;
  for (j = 0, len = arr.length; j < len; j++) {
    item = arr[j];
    res += item;
  }
  return res;
};

assert(15, g.sumNumbers([1, 2, 3, 4, 5]));

g.txtT = function(value, w, align = CENTER) {
  var diff, lt, res, rt;
  if (value.length > w) {
    value = value.substring(0, w);
  }
  if (value.length < w && align === RIGHT) {
    value = value.padStart(w);
  }
  if (align === LEFT) {
    res = value + _.repeat(' ', w - value.length);
  }
  if (align === RIGHT) {
    res = _.repeat(' ', w - value.length) + value;
  }
  if (align === CENTER) {
    diff = w - value.length;
    lt = _.repeat(' ', Math.floor((1 + diff) / 2));
    rt = _.repeat(' ', Math.floor(diff / 2));
    res = lt + value + rt;
  }
  return res;
};

g.prBth = function(score) {
  return `${'0½1'[score]}-${'1½0'[score]}`;
};

g.prBoth = function(score) {
  return ` ${'0½1'[score]} - ${'1½0'[score]} `;
};

//##########################

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFscy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcIiwic291cmNlcyI6WyJjb2ZmZWVcXGdsb2JhbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBK0M7QUFBQSxJQUFBLEdBQUE7RUFBQTs7QUFDL0MsT0FBQTtFQUFTLE1BQVQ7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsU0FBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBTyxDQUFBLEdBQUksQ0FBQSxFQU5vQzs7Ozs7Ozs7O0FBZS9DLENBQUMsQ0FBQyxRQUFGLEdBQWEsS0Fma0M7O0FBZ0IvQyxDQUFDLENBQUMsSUFBRixHQUFTLE1BaEJzQzs7O0FBa0IvQyxDQUFDLENBQUMsTUFBRixHQUFXLEVBbEJvQzs7Ozs7QUF1Qi9DLE9BQUEsSUFBTyxLQUFBLEdBQVEsT0FBTyxDQUFDOztBQUN2QixPQUFBLElBQU8sS0FBQSxHQUFRLENBQUMsQ0FBQzs7QUFDakIsT0FBQSxJQUFPLE1BQUEsR0FBUyxRQUFBLENBQUMsQ0FBRCxDQUFBO1NBQU8sQ0FBQSxHQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBVixHQUFzQjtBQUE3Qjs7QUFDaEIsT0FBQSxJQUFPLE1BQUEsR0FBUyxRQUFBLENBQUMsQ0FBRCxDQUFBO1NBQU8sQ0FBQSxHQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUg7QUFBakI7O0FBRWhCLENBQUMsQ0FBQyxJQUFGLEdBQVM7O0FBQ1QsT0FBQSxJQUFPLE1BQUEsR0FBUyxRQUFBLENBQUEsQ0FBQTtTQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBQyxDQUFDLElBQUYsRUFBVCxDQUFBLEdBQW1CLENBQW5CLEdBQXFCLEdBQXRCLENBQUEsR0FBMkIsS0FBNUIsQ0FBQSxHQUFtQyxHQUFwQyxD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R0FBYSxHQUpwQjs7U0FLQTtBQVZROztBQVlULENBQUMsQ0FBQyxLQUFGLEdBQVUsUUFBQSxDQUFDLEtBQUQsQ0FBQTtTQUFXLENBQUEsQ0FBQSxDQUFHLEtBQUssQ0FBQyxLQUFELENBQVIsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsS0FBSyxDQUFDLEtBQUQsQ0FBeEIsQ0FBQTtBQUFYOztBQUNWLENBQUMsQ0FBQyxNQUFGLEdBQVcsUUFBQSxDQUFDLEtBQUQsQ0FBQTtTQUFXLEVBQUEsQ0FBQSxDQUFJLEtBQUssQ0FBQyxLQUFELENBQVQsQ0FBQSxHQUFBLENBQUEsQ0FBc0IsS0FBSyxDQUFDLEtBQUQsQ0FBM0IsRUFBQTtBQUFYOztBQXBJb0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIGltcG9ydCB7IFRvdXJuYW1lbnQgfSBmcm9tICcuL3RvdXJuYW1lbnQuanMnIFxyXG5pbXBvcnQgeyBUYWJsZXMgfSBmcm9tICcuL3BhZ2VfdGFibGVzLmpzJyBcclxuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuL3BhZ2VfbmFtZXMuanMnIFxyXG5pbXBvcnQgeyBTdGFuZGluZ3MgfSBmcm9tICcuL3BhZ2Vfc3RhbmRpbmdzLmpzJyBcclxuaW1wb3J0IHsgQWN0aXZlIH0gZnJvbSAnLi9wYWdlX2FjdGl2ZS5qcycgXHJcblxyXG5leHBvcnQgZyA9IHt9XHJcblxyXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcblxyXG4jIGcuSyA9IDIgIyAyMFxyXG4jIGcuSzAgPSA0MCAjIDQwPWp1bmlvcnMgMjA9bm9ybWFsIDEwPW1hc3RlcnNcclxuIyBnLmsgPSAxLjAgIyAwLjdcclxuXHJcbiMgcGFyYW1ldGVycyB0aGF0IGFmZmVjdHMgbWF0Y2hpbmdcclxuZy5FWFBPTkVOVCA9IDEuMDEgIyAxIG9yIDEuMDEgKG9yIDIpXHJcbmcuRElGRiA9ICdFTE8nICMgRUxPIGFudsOkbmRlciBzZW5hc3RlIGVsbyBpIFN0YW5kaW5nc1xyXG4jZy5ESUZGID0gJ1BPUycgIyBQT1MgYW52w6RuZGVyIHNlbmFzdGUgcG9zaXRpb24gaSBTdGFuZGluZ3NcclxuZy5DT0xPUlMgPSAxICMgd3d3IG5vdCBva1xyXG4jZy5DT0xPUlMgPSAyICMgd3d3IG9rXHJcblxyXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcblxyXG5leHBvcnQgcHJpbnQgPSBjb25zb2xlLmxvZ1xyXG5leHBvcnQgcmFuZ2UgPSBfLnJhbmdlXHJcbmV4cG9ydCBzY2FsZXggPSAoeCkgLT4geCAqIGcuWk9PTVtnLnN0YXRlXSAvIDIwXHJcbmV4cG9ydCBzY2FsZXkgPSAoeSkgLT4geSAqIGcuWk9PTVtnLnN0YXRlXVxyXG5cclxuZy5zZWVkID0gMFxyXG5leHBvcnQgcmFuZG9tID0gLT4gKCgoTWF0aC5zaW4oZy5zZWVkKyspLzIrMC41KSoxMDAwMCklMTAwKS8xMDBcclxuXHJcbmV4cG9ydCB3cmFwID0gKHMpIC0+IFwiKCN7c30pXCJcclxuXHJcbmcuQllFID0gLTFcclxuZy5QQVVTRSA9IC0yXHJcblxyXG5nLlRBQkxFUyAgICA9IDBcclxuZy5OQU1FUyAgICAgPSAxXHJcbmcuU1RBTkRJTkdTID0gMlxyXG5nLkFDVElWRSAgICA9IDNcclxuXHJcbmcucGFnZXMgPSBbXVxyXG5cclxuZy5tZXNzYWdlID0gXCJcIlxyXG5cclxuZy5zY29yaW5nUHJvYmFiaWxpdHkgPSAoZGlmZikgLT4gMSAvICgxICsgcG93IDEwLCBkaWZmLzQwMClcclxuXHJcbmcuc2hvd1R5cGUgPSAoYSkgLT4gaWYgdHlwZW9mIGEgPT0gJ3N0cmluZycgdGhlbiBcIicje2F9J1wiIGVsc2UgYVxyXG5leHBvcnQgYXNzZXJ0ID0gKGEsYikgLT4gaWYgbm90IF8uaXNFcXVhbCBhLGIgdGhlbiBwcmludCBcIkFzc2VydCBmYWlsdXJlOiAje0pTT04uc3RyaW5naWZ5IGF9ICE9ICN7SlNPTi5zdHJpbmdpZnkgYn1cIlxyXG5cclxuZy5vayA9IChhLGIpIC0+IGEuaWQgIT0gYi5pZCBhbmQgYS5pZCBub3QgaW4gYi5vcHAgYW5kIGFicyhhLmJhbGFucygpICsgYi5iYWxhbnMoKSkgPD0gZy5DT0xPUlNcclxuZy5vdGhlciA9IChjb2wpIC0+IGlmIGNvbCA9PSAnYicgdGhlbiAndycgZWxzZSAnYidcclxuXHJcbmcubXlSb3VuZCA9ICh4LGRlY3MpIC0+IHgudG9GaXhlZCBkZWNzXHJcbmFzc2VydCBcIjIuMFwiLCBnLm15Um91bmQgMS45OSwxXHJcbmFzc2VydCBcIjAuNlwiLCBnLm15Um91bmQgMC42MSwxXHJcblxyXG5nLmludHMyc3RyaW5ncyA9IChpbnRzKSAtPiBcIiN7aW50c31cIlxyXG5hc3NlcnQgXCIxLDIsM1wiLCBnLmludHMyc3RyaW5ncyBbMSwyLDNdXHJcbmFzc2VydCBcIjFcIiwgZy5pbnRzMnN0cmluZ3MgWzFdXHJcbmFzc2VydCBcIlwiLCBnLmludHMyc3RyaW5ncyBbXVxyXG5cclxuZy5yZXMyc3RyaW5nID0gKGludHMpIC0+IChpLnRvU3RyaW5nKCkgZm9yIGkgaW4gaW50cykuam9pbiAnJ1xyXG5hc3NlcnQgXCIxMjNcIiwgZy5yZXMyc3RyaW5nIFsxLDIsM11cclxuYXNzZXJ0IFwiMVwiLCBnLnJlczJzdHJpbmcgWzFdXHJcbmFzc2VydCBcIlwiLCBnLnJlczJzdHJpbmcgW11cclxuXHJcbmcuem9vbUluICA9IChuKSAtPiBnLlpPT01bZy5zdGF0ZV0rK1xyXG5nLnpvb21PdXQgPSAobikgLT4gZy5aT09NW2cuc3RhdGVdLS1cclxuZy5zZXRTdGF0ZSA9IChuZXdTdGF0ZSkgLT4gaWYgZy50b3VybmFtZW50LnJvdW5kID4gMCB0aGVuIGcuc3RhdGUgPSBuZXdTdGF0ZVxyXG5cclxuZy5pbnZlcnQgPSAoYXJyKSAtPlxyXG5cdHJlcyA9IFtdXHJcblx0Zm9yIGkgaW4gcmFuZ2UgYXJyLmxlbmd0aFxyXG5cdFx0cmVzW2FycltpXV0gPSBpXHJcblx0cmVzXHJcbmFzc2VydCBbMCwxLDIsM10sIGcuaW52ZXJ0IFswLDEsMiwzXVxyXG5hc3NlcnQgWzMsMiwwLDFdLCBnLmludmVydCBbMiwzLDEsMF1cclxuYXNzZXJ0IFsyLDMsMSwwXSwgZy5pbnZlcnQgZy5pbnZlcnQgWzIsMywxLDBdXHJcblxyXG54eHggPSBbWzIsMV0sWzEyLDJdLFsxMiwxXSxbMyw0XV1cclxueHh4LnNvcnQgKGEsYikgLT4gXHJcblx0ZGlmZiA9IGFbMF0gLSBiWzBdIFxyXG5cdGlmIGRpZmYgPT0gMCB0aGVuIGFbMV0gLSBiWzFdIGVsc2UgZGlmZlxyXG5hc3NlcnQgW1syLDFdLCBbMyw0XSwgWzEyLDFdLCBbMTIsMl1dLCB4eHhcdFxyXG5hc3NlcnQgdHJ1ZSwgWzJdID4gWzEyXVxyXG5hc3NlcnQgdHJ1ZSwgXCIyXCIgPiBcIjEyXCJcclxuYXNzZXJ0IGZhbHNlLCAyID4gMTJcclxuXHJcbiMgeHh4ID0gW1syLDFdLFsxMiwyXSxbMTIsMV0sWzMsNF1dXHJcbiMgYXNzZXJ0IFtbMiwxXSxbMTIsMV0sWzEyLDJdLFszLDRdXSwgXy5zb3J0QnkoeHh4LCAoeCkgLT4gW3hbMF0seFsxXV0pXHJcbiMgYXNzZXJ0IFtbMyw0XSxbMiwxXSxbMTIsMV0sWzEyLDJdXSwgXy5zb3J0QnkoeHh4LCAoeCkgLT4gLXhbMF0pXHJcbiMgYXNzZXJ0IFtbMiwxXSxbMTIsMV0sWzMsNF0sWzEyLDJdXSwgXy5zb3J0QnkoeHh4LCAoeCkgLT4geFsxXSlcclxuIyBhc3NlcnQgW1szLDRdLFsxMiwxXSxbMiwxXSxbMTIsMl1dLCBfLnNvcnRCeSh4eHgsICh4KSAtPiAteFsxXSlcclxuXHJcbmcuY2FsY01pc3NpbmcgPSAtPlxyXG5cdG1pc3NpbmcgPSAwXHJcblx0Zm9yIHAgaW4gZy50b3VybmFtZW50LnBlcnNvbnNcclxuXHRcdGlmIG5vdCBwLmFjdGl2ZSB0aGVuIGNvbnRpbnVlXHJcblx0XHRpZiBnLkJZRSA9PSBfLmxhc3QgcC5vcHAgdGhlbiBjb250aW51ZVxyXG5cdFx0aWYgcC5yZXMubGVuZ3RoIDwgcC5jb2wubGVuZ3RoIHRoZW4gbWlzc2luZysrXHJcblx0Zy5tZXNzYWdlID0gXCIje21pc3NpbmcvLzJ9IHJlc3VsdHMgbWlzc2luZ1wiXHJcblx0bWlzc2luZ1xyXG5cclxuZy5zdW0gPSAocykgLT5cclxuXHRyZXMgPSAwXHJcblx0Zm9yIGl0ZW0gaW4gc1xyXG5cdFx0cmVzICs9IHBhcnNlRmxvYXQgaXRlbVxyXG5cdHJlc1xyXG5hc3NlcnQgNiwgZy5zdW0gJzAxMjAxMidcclxuXHJcbmcuc3VtTnVtYmVycyA9IChhcnIpIC0+XHJcblx0IyBwcmludCAnc3VtTnVtYmVycycsYXJyXHJcblx0cmVzID0gMFxyXG5cdGZvciBpdGVtIGluIGFyclxyXG5cdFx0cmVzICs9IGl0ZW1cclxuXHRyZXNcclxuYXNzZXJ0IDE1LCBnLnN1bU51bWJlcnMgWzEsMiwzLDQsNV1cclxuXHJcbmcudHh0VCA9ICh2YWx1ZSwgdywgYWxpZ249IENFTlRFUikgLT4gXHJcblx0aWYgdmFsdWUubGVuZ3RoID4gdyB0aGVuIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nIDAsd1xyXG5cdGlmIHZhbHVlLmxlbmd0aCA8IHcgYW5kIGFsaWduPT0gUklHSFQgdGhlbiB2YWx1ZSA9IHZhbHVlLnBhZFN0YXJ0IHdcclxuXHRpZiBhbGlnbj09IExFRlQgdGhlbiByZXMgPSB2YWx1ZSArIF8ucmVwZWF0ICcgJyx3LXZhbHVlLmxlbmd0aFxyXG5cdGlmIGFsaWduPT0gUklHSFQgdGhlbiByZXMgPSBfLnJlcGVhdCgnICcsdy12YWx1ZS5sZW5ndGgpICsgdmFsdWVcclxuXHRpZiBhbGlnbj09IENFTlRFUiBcclxuXHRcdGRpZmYgPSB3LXZhbHVlLmxlbmd0aFxyXG5cdFx0bHQgPSBfLnJlcGVhdCAnICcsKDErZGlmZikvLzJcclxuXHRcdHJ0ID0gXy5yZXBlYXQgJyAnLGRpZmYvLzJcclxuXHRcdHJlcyA9IGx0ICsgdmFsdWUgKyBydFxyXG5cdHJlc1xyXG5cclxuZy5wckJ0aCA9IChzY29yZSkgLT4gXCIjeycwwr0xJ1tzY29yZV19LSN7JzHCvTAnW3Njb3JlXX1cIlxyXG5nLnByQm90aCA9IChzY29yZSkgLT4gXCIgI3snMMK9MSdbc2NvcmVdfSAtICN7JzHCvTAnW3Njb3JlXX0gXCJcclxuXHJcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG5cclxuIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\globals.coffee