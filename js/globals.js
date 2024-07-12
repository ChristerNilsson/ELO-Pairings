// Generated by CoffeeScript 2.7.0
var xxx,
  indexOf = [].indexOf;

import {
  Tournament
} from './tournament.js';

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

export var print = console.log;

export var range = _.range;

export var scalex = function(x) {
  return x * g.ZOOM[g.state] / 20;
};

export var scaley = function(y) {
  return y * g.ZOOM[g.state];
};

export var g = {};

g.seed = 0;

export var random = function() {
  return (((Math.sin(g.seed++) / 2 + 0.5) * 10000) % 100) / 100;
};

// parameters that somewhat affects matching
g.EXPONENT = 1.01; // 1 or 1.01 (or 2)

g.DIFF = 'ELO'; // ID or ELO0 or ELO. ELO ett krav för att spelarna ska kunna "klättra"

g.COLORS = 1; // 1 (or 2)

g.BYE = -1;

g.PAUSE = -2;

g.TABLES = 0;

g.NAMES = 1;

g.STANDINGS = 2;

g.ACTIVE = 3;

g.K0 = 40; // 40=juniors 20=normal 10=masters

g.k = 1.0; // 0.7

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

g.txtT = function(value, w, align = window.CENTER) {
  var diff, lt, res, rt;
  if (value.length > w) {
    value = value.substring(0, w);
  }
  if (value.length < w && align === window.RIGHT) {
    value = value.padStart(w);
  }
  if (align === window.LEFT) {
    res = value + _.repeat(' ', w - value.length);
  }
  if (align === window.RIGHT) {
    res = _.repeat(' ', w - value.length) + value;
  }
  if (align === window.CENTER) {
    diff = w - value.length;
    lt = _.repeat(' ', Math.floor((1 + diff) / 2));
    rt = _.repeat(' ', Math.floor(diff / 2));
    res = lt + value + rt;
  }
  return res;
};

g.prBoth = function(score) {
  return ` ${'0½1'[score]} - ${'1½0'[score]} `;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFscy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcIiwic291cmNlcyI6WyJjb2ZmZWVcXGdsb2JhbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLEdBQUE7RUFBQTs7QUFBQSxPQUFBO0VBQVMsVUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsU0FBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBTyxLQUFBLEdBQVEsT0FBTyxDQUFDOztBQUN2QixPQUFBLElBQU8sS0FBQSxHQUFRLENBQUMsQ0FBQzs7QUFDakIsT0FBQSxJQUFPLE1BQUEsR0FBUyxRQUFBLENBQUMsQ0FBRCxDQUFBO1NBQU8sQ0FBQSxHQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBVixHQUFzQjtBQUE3Qjs7QUFDaEIsT0FBQSxJQUFPLE1BQUEsR0FBUyxRQUFBLENBQUMsQ0FBRCxDQUFBO1NBQU8sQ0FBQSxHQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUg7QUFBakI7O0FBRWhCLE9BQUEsSUFBTyxDQUFBLEdBQUksQ0FBQTs7QUFFWCxDQUFDLENBQUMsSUFBRixHQUFTOztBQUNULE9BQUEsSUFBTyxNQUFBLEdBQVMsUUFBQSxDQUFBLENBQUE7U0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUMsQ0FBQyxJQUFGLEVBQVQsQ0FBQSxHQUFtQixDQUFuQixHQUFxQixHQUF0QixDQUFBLEdBQTJCLEtBQTVCLENBQUEsR0FBbUMsR0FBcEMsQ0FBQSxHQUF5QztBQUE1QyxFQWRoQjs7O0FBaUJBLENBQUMsQ0FBQyxRQUFGLEdBQWEsS0FqQmI7O0FBa0JBLENBQUMsQ0FBQyxJQUFGLEdBQVMsTUFsQlQ7O0FBbUJBLENB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clxuaW1wb3J0IHsgVGFibGVzIH0gZnJvbSAnLi9wYWdlX3RhYmxlcy5qcycgXHJcbmltcG9ydCB7IE5hbWVzIH0gZnJvbSAnLi9wYWdlX25hbWVzLmpzJyBcclxuaW1wb3J0IHsgU3RhbmRpbmdzIH0gZnJvbSAnLi9wYWdlX3N0YW5kaW5ncy5qcycgXHJcbmltcG9ydCB7IEFjdGl2ZSB9IGZyb20gJy4vcGFnZV9hY3RpdmUuanMnIFxyXG5cclxuZXhwb3J0IHByaW50ID0gY29uc29sZS5sb2dcclxuZXhwb3J0IHJhbmdlID0gXy5yYW5nZVxyXG5leHBvcnQgc2NhbGV4ID0gKHgpIC0+IHggKiBnLlpPT01bZy5zdGF0ZV0gLyAyMFxyXG5leHBvcnQgc2NhbGV5ID0gKHkpIC0+IHkgKiBnLlpPT01bZy5zdGF0ZV1cclxuXHJcbmV4cG9ydCBnID0ge31cclxuXHJcbmcuc2VlZCA9IDBcclxuZXhwb3J0IHJhbmRvbSA9IC0+ICgoKE1hdGguc2luKGcuc2VlZCsrKS8yKzAuNSkqMTAwMDApJTEwMCkvMTAwXHJcblxyXG4jIHBhcmFtZXRlcnMgdGhhdCBzb21ld2hhdCBhZmZlY3RzIG1hdGNoaW5nXHJcbmcuRVhQT05FTlQgPSAxLjAxICMgMSBvciAxLjAxIChvciAyKVxyXG5nLkRJRkYgPSAnRUxPJyAjIElEIG9yIEVMTzAgb3IgRUxPLiBFTE8gZXR0IGtyYXYgZsO2ciBhdHQgc3BlbGFybmEgc2thIGt1bm5hIFwia2zDpHR0cmFcIlxyXG5nLkNPTE9SUyA9IDEgIyAxIChvciAyKVxyXG5cclxuZy5CWUUgPSAtMVxyXG5nLlBBVVNFID0gLTJcclxuXHJcbmcuVEFCTEVTICAgID0gMFxyXG5nLk5BTUVTICAgICA9IDFcclxuZy5TVEFORElOR1MgPSAyXHJcbmcuQUNUSVZFICAgID0gM1xyXG5cclxuZy5LMCA9IDQwICMgNDA9anVuaW9ycyAyMD1ub3JtYWwgMTA9bWFzdGVyc1xyXG5nLmsgPSAxLjAgIyAwLjdcclxuXHJcbmcucGFnZXMgPSBbXVxyXG5cclxuZy5tZXNzYWdlID0gXCJcIlxyXG5cclxuZy5zY29yaW5nUHJvYmFiaWxpdHkgPSAoZGlmZikgLT4gMSAvICgxICsgcG93IDEwLCBkaWZmLzQwMClcclxuXHJcbmcuc2hvd1R5cGUgPSAoYSkgLT4gaWYgdHlwZW9mIGEgPT0gJ3N0cmluZycgdGhlbiBcIicje2F9J1wiIGVsc2UgYVxyXG5leHBvcnQgYXNzZXJ0ID0gKGEsYikgLT4gaWYgbm90IF8uaXNFcXVhbCBhLGIgdGhlbiBwcmludCBcIkFzc2VydCBmYWlsdXJlOiAje0pTT04uc3RyaW5naWZ5IGF9ICE9ICN7SlNPTi5zdHJpbmdpZnkgYn1cIlxyXG5cclxuZy5vayA9IChhLGIpIC0+IGEuaWQgIT0gYi5pZCBhbmQgYS5pZCBub3QgaW4gYi5vcHAgYW5kIGFicyhhLmJhbGFucygpICsgYi5iYWxhbnMoKSkgPD0gZy5DT0xPUlNcclxuZy5vdGhlciA9IChjb2wpIC0+IGlmIGNvbCA9PSAnYicgdGhlbiAndycgZWxzZSAnYidcclxuXHJcbmcubXlSb3VuZCA9ICh4LGRlY3MpIC0+IHgudG9GaXhlZCBkZWNzXHJcbmFzc2VydCBcIjIuMFwiLCBnLm15Um91bmQgMS45OSwxXHJcbmFzc2VydCBcIjAuNlwiLCBnLm15Um91bmQgMC42MSwxXHJcblxyXG5nLmludHMyc3RyaW5ncyA9IChpbnRzKSAtPiBcIiN7aW50c31cIlxyXG5hc3NlcnQgXCIxLDIsM1wiLCBnLmludHMyc3RyaW5ncyBbMSwyLDNdXHJcbmFzc2VydCBcIjFcIiwgZy5pbnRzMnN0cmluZ3MgWzFdXHJcbmFzc2VydCBcIlwiLCBnLmludHMyc3RyaW5ncyBbXVxyXG5cclxuZy5yZXMyc3RyaW5nID0gKGludHMpIC0+IChpLnRvU3RyaW5nKCkgZm9yIGkgaW4gaW50cykuam9pbiAnJ1xyXG5hc3NlcnQgXCIxMjNcIiwgZy5yZXMyc3RyaW5nIFsxLDIsM11cclxuYXNzZXJ0IFwiMVwiLCBnLnJlczJzdHJpbmcgWzFdXHJcbmFzc2VydCBcIlwiLCBnLnJlczJzdHJpbmcgW11cclxuXHJcbmcuem9vbUluICA9IChuKSAtPiBnLlpPT01bZy5zdGF0ZV0rK1xyXG5nLnpvb21PdXQgPSAobikgLT4gZy5aT09NW2cuc3RhdGVdLS1cclxuZy5zZXRTdGF0ZSA9IChuZXdTdGF0ZSkgLT4gaWYgZy50b3VybmFtZW50LnJvdW5kID4gMCB0aGVuIGcuc3RhdGUgPSBuZXdTdGF0ZVxyXG5cclxuZy5pbnZlcnQgPSAoYXJyKSAtPlxyXG5cdHJlcyA9IFtdXHJcblx0Zm9yIGkgaW4gcmFuZ2UgYXJyLmxlbmd0aFxyXG5cdFx0cmVzW2FycltpXV0gPSBpXHJcblx0cmVzXHJcbmFzc2VydCBbMCwxLDIsM10sIGcuaW52ZXJ0IFswLDEsMiwzXVxyXG5hc3NlcnQgWzMsMiwwLDFdLCBnLmludmVydCBbMiwzLDEsMF1cclxuYXNzZXJ0IFsyLDMsMSwwXSwgZy5pbnZlcnQgZy5pbnZlcnQgWzIsMywxLDBdXHJcblxyXG54eHggPSBbWzIsMV0sWzEyLDJdLFsxMiwxXSxbMyw0XV1cclxueHh4LnNvcnQgKGEsYikgLT4gXHJcblx0ZGlmZiA9IGFbMF0gLSBiWzBdIFxyXG5cdGlmIGRpZmYgPT0gMCB0aGVuIGFbMV0gLSBiWzFdIGVsc2UgZGlmZlxyXG5hc3NlcnQgW1syLDFdLCBbMyw0XSwgWzEyLDFdLCBbMTIsMl1dLCB4eHhcdFxyXG5hc3NlcnQgdHJ1ZSwgWzJdID4gWzEyXVxyXG5hc3NlcnQgdHJ1ZSwgXCIyXCIgPiBcIjEyXCJcclxuYXNzZXJ0IGZhbHNlLCAyID4gMTJcclxuXHJcbiMgeHh4ID0gW1syLDFdLFsxMiwyXSxbMTIsMV0sWzMsNF1dXHJcbiMgYXNzZXJ0IFtbMiwxXSxbMTIsMV0sWzEyLDJdLFszLDRdXSwgXy5zb3J0QnkoeHh4LCAoeCkgLT4gW3hbMF0seFsxXV0pXHJcbiMgYXNzZXJ0IFtbMyw0XSxbMiwxXSxbMTIsMV0sWzEyLDJdXSwgXy5zb3J0QnkoeHh4LCAoeCkgLT4gLXhbMF0pXHJcbiMgYXNzZXJ0IFtbMiwxXSxbMTIsMV0sWzMsNF0sWzEyLDJdXSwgXy5zb3J0QnkoeHh4LCAoeCkgLT4geFsxXSlcclxuIyBhc3NlcnQgW1szLDRdLFsxMiwxXSxbMiwxXSxbMTIsMl1dLCBfLnNvcnRCeSh4eHgsICh4KSAtPiAteFsxXSlcclxuXHJcbmcuY2FsY01pc3NpbmcgPSAtPlxyXG5cdG1pc3NpbmcgPSAwXHJcblx0Zm9yIHAgaW4gZy50b3VybmFtZW50LnBlcnNvbnNcclxuXHRcdGlmIG5vdCBwLmFjdGl2ZSB0aGVuIGNvbnRpbnVlXHJcblx0XHRpZiBnLkJZRSA9PSBfLmxhc3QgcC5vcHAgdGhlbiBjb250aW51ZVxyXG5cdFx0aWYgcC5yZXMubGVuZ3RoIDwgcC5jb2wubGVuZ3RoIHRoZW4gbWlzc2luZysrXHJcblx0Zy5tZXNzYWdlID0gXCIje21pc3NpbmcvLzJ9IHJlc3VsdHMgbWlzc2luZ1wiXHJcblx0bWlzc2luZ1xyXG5cclxuZy5zdW0gPSAocykgLT5cclxuXHRyZXMgPSAwXHJcblx0Zm9yIGl0ZW0gaW4gc1xyXG5cdFx0cmVzICs9IHBhcnNlRmxvYXQgaXRlbVxyXG5cdHJlc1xyXG5hc3NlcnQgNiwgZy5zdW0gJzAxMjAxMidcclxuXHJcbmcudHh0VCA9ICh2YWx1ZSwgdywgYWxpZ249d2luZG93LkNFTlRFUikgLT4gXHJcblx0aWYgdmFsdWUubGVuZ3RoID4gdyB0aGVuIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nIDAsd1xyXG5cdGlmIHZhbHVlLmxlbmd0aCA8IHcgYW5kIGFsaWduPT13aW5kb3cuUklHSFQgdGhlbiB2YWx1ZSA9IHZhbHVlLnBhZFN0YXJ0IHdcclxuXHRpZiBhbGlnbj09d2luZG93LkxFRlQgdGhlbiByZXMgPSB2YWx1ZSArIF8ucmVwZWF0ICcgJyx3LXZhbHVlLmxlbmd0aFxyXG5cdGlmIGFsaWduPT13aW5kb3cuUklHSFQgdGhlbiByZXMgPSBfLnJlcGVhdCgnICcsdy12YWx1ZS5sZW5ndGgpICsgdmFsdWVcclxuXHRpZiBhbGlnbj09d2luZG93LkNFTlRFUiBcclxuXHRcdGRpZmYgPSB3LXZhbHVlLmxlbmd0aFxyXG5cdFx0bHQgPSBfLnJlcGVhdCAnICcsKDErZGlmZikvLzJcclxuXHRcdHJ0ID0gXy5yZXBlYXQgJyAnLGRpZmYvLzJcclxuXHRcdHJlcyA9IGx0ICsgdmFsdWUgKyBydFxyXG5cdHJlc1xyXG5cclxuZy5wckJvdGggPSAoc2NvcmUpIC0+IFwiICN7JzDCvTEnW3Njb3JlXX0gLSAjeycxwr0wJ1tzY29yZV19IFwiXHJcbiJdfQ==
//# sourceURL=c:\github\ELO-Pairings\coffee\globals.coffee