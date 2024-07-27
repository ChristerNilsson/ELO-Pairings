// Generated by CoffeeScript 2.7.0
var indexOf = [].indexOf;

import {
  g,
  print,
  range,
  scalex,
  scaley,
  SEPARATOR
} from './globals.js';

export var Player = class Player {
  constructor(id1, name = "", elo = "1400", opp = [], col1 = "", res1 = "", active = true) {
    this.id = id1;
    this.name = name;
    this.elo = elo;
    this.opp = opp;
    this.col = col1;
    this.res = res1;
    this.active = active;
    this.cache = {};
    this.pos = []; // one for each round
  }

  toggle() {
    var p;
    this.active = !this.active;
    return g.tournament.paused = (function() {
      var j, len, ref, results;
      ref = g.tournament.persons;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        p = ref[j];
        if (!p.active) {
          results.push(p.id);
        }
      }
      return results;
    })();
  }

  bye() {
    var ref;
    return ref = g.BYE, indexOf.call(this.opp, ref) >= 0;
  }

  calcRound0(r) {
    var a, b, diff;
    if (this.opp[r] === g.BYE) {
      return g.K * (1.0 - g.F(0));
    }
    if (this.opp[r] === g.PAUSE) {
      return 0;
    }
    if (r >= this.res.length) {
      return 0;
    }
    a = this.elo;
    b = g.tournament.persons[this.opp[r]].elo;
    diff = a - b;
    return g.K * (this.res[r] / 2 - g.F(diff));
  }

  calcRound1(r) {
    var b;
    if (this.opp[r] === g.BYE) {
      return this.elo + g.OFFSET;
    }
    if (this.opp[r] === g.PAUSE) {
      return 0;
    }
    if (r >= this.res.length) {
      return 0;
    }
    b = g.tournament.persons[this.opp[r]].elo + g.OFFSET;
    if (this.res[r] === '2') {
      return b; // WIN
    }
    if (this.res[r] === '1') {
      return b / 2; // DRAW
    }
    return 0; // LOSS
  }

  calcRound(r) {
    if (g.FACTOR === 0) {
      return this.calcRound0(r);
    } else {
      return this.calcRound1(r);
    }
  }

  change(rounds) {
    var r;
    if (rounds in this.cache) {
      return this.cache[rounds];
    }
    return this.cache[rounds] = g.sum((function() {
      var j, len, ref, results;
      ref = range(rounds);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push(this.calcRound(r));
      }
      return results;
    }).call(this));
  }

  score() {
    var ch, j, len, ref, result;
    result = 0;
    ref = this.res;
    for (j = 0, len = ref.length; j < len; j++) {
      ch = ref[j];
      result += parseInt(ch);
    }
    return result;
  }

  avgEloDiff() {
    var id, j, len, ref, res;
    res = [];
    ref = this.opp.slice(0, this.opp.length - 1);
    for (j = 0, len = ref.length; j < len; j++) {
      id = ref[j];
      if (id >= 0) {
        res.push(abs(this.elo - g.tournament.persons[id].elo));
      }
    }
    if (res.length === 0) {
      return 0;
    } else {
      return g.sum(res) / res.length;
    }
  }

  balans() { // färgbalans
    var ch, j, len, ref, result;
    result = 0;
    ref = this.col;
    for (j = 0, len = ref.length; j < len; j++) {
      ch = ref[j];
      if (ch === 'b') {
        result -= 1;
      }
      if (ch === 'w') {
        result += 1;
      }
    }
    return result;
  }

  // mandatory : -> # w if white, b if black else space
  // 	print 'balans',@balans()
  // 	if @balans >= 1 then return 'b'
  // 	if @balans <= -1 then return 'w'
  // 	n = @col.length
  // 	if n < 2 then return ' '
  // 	if "ww" == @col.slice n-2 then return 'b'
  // 	if "bb" == @col.slice n-2 then return 'w'
  // 	' '
  read(player) {
    var arr, col, j, len, ocr, ocrs, results;
    
    // print player
    this.elo = parseInt(player[0]);
    this.name = player[1];
    this.opp = [];
    this.col = "";
    this.res = "";
    if (player.length < 3) {
      return;
    }
    ocrs = player.slice(2);
    print('ocrs', ocrs);
    results = [];
    for (j = 0, len = ocrs.length; j < len; j++) {
      ocr = ocrs[j];
      if (indexOf.call(ocr, 'w') >= 0) {
        col = 'w';
      }
      if (indexOf.call(ocr, 'b') >= 0) {
        col = 'b';
      }
      if (indexOf.call(ocr, '_') >= 0) {
        col = '_';
      }
      arr = ocr.split(col);
      this.opp.push(parseInt(arr[0]));
      this.col += col;
      if (arr.length === 2 && arr[1].length === 1) {
        results.push(this.res += arr[1]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

  write() { // 1234!Christer!12w0!23b1!14w2   Elo:1234 Name:Christer opponent:23 color:b result:1
    var i, ocr, r, res;
    res = [];
    res.push(this.elo);
    res.push(this.name);
    r = this.opp.length;
    ocr = (function() {
      var j, len, ref, results;
      ref = range(r);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(`${this.opp[i]}${this.col[i]}${i < r ? this.res[i] : ''}`);
      }
      return results;
    }).call(this);
    res.push(ocr.join(SEPARATOR));
    return res.join(SEPARATOR);
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUN0RSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUE7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRk07RUFBQTs7RUFJZCxNQUFTLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBRSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUksSUFBQyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFiOztBQUF1QjtBQUFBO01BQUEsS0FBQSxxQ0FBQTs7WUFBd0MsQ0FBSSxDQUFDLENBQUM7dUJBQTlDLENBQUMsQ0FBQzs7TUFBRixDQUFBOzs7RUFGZjs7RUFJVCxHQUFNLENBQUEsQ0FBQTtBQUFFLFFBQUE7aUJBQUMsQ0FBQyxDQUFDLGtCQUFPLElBQUMsQ0FBQSxLQUFWO0VBQUg7O0VBRU4sVUFBYSxDQUFDLENBQUQsQ0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtJQUFFLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxDQUFDLENBQUMsR0FBaEI7QUFBeUIsYUFBTyxDQUFDLENBQUMs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c2NhbGV5LFNFUEFSQVRPUiB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyXHJcblx0Y29uc3RydWN0b3IgOiAoQGlkLCBAbmFtZT1cIlwiLCBAZWxvPVwiMTQwMFwiLCBAb3BwPVtdLCBAY29sPVwiXCIsIEByZXM9XCJcIiwgQGFjdGl2ZSA9IHRydWUpIC0+IFxyXG5cdFx0QGNhY2hlID0ge31cclxuXHRcdEBwb3MgPSBbXSAjIG9uZSBmb3IgZWFjaCByb3VuZFxyXG5cclxuXHR0b2dnbGUgOiAtPiBcclxuXHRcdEBhY3RpdmUgPSBub3QgQGFjdGl2ZVxyXG5cdFx0Zy50b3VybmFtZW50LnBhdXNlZCA9IChwLmlkIGZvciBwIGluIGcudG91cm5hbWVudC5wZXJzb25zIHdoZW4gbm90IHAuYWN0aXZlKVxyXG5cclxuXHRieWUgOiAtPiBnLkJZRSBpbiBAb3BwXHJcblxyXG5cdGNhbGNSb3VuZDAgOiAocikgLT5cclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgdGhlbiByZXR1cm4gZy5LICogKDEuMCAtIGcuRiAwKVxyXG5cdFx0aWYgQG9wcFtyXSA9PSBnLlBBVVNFIHRoZW4gcmV0dXJuIDBcclxuXHRcdGlmIHIgPj0gQHJlcy5sZW5ndGggdGhlbiByZXR1cm4gMFxyXG5cdFx0YSA9IEBlbG9cclxuXHRcdGIgPSBnLnRvdXJuYW1lbnQucGVyc29uc1tAb3BwW3JdXS5lbG9cclxuXHRcdGRpZmYgPSBhIC0gYlxyXG5cdFx0Zy5LICogKEByZXNbcl0vMiAtIGcuRiBkaWZmKVxyXG5cclxuXHRjYWxjUm91bmQxIDogKHIpIC0+IFxyXG5cdFx0aWYgQG9wcFtyXSA9PSBnLkJZRSAgIHRoZW4gcmV0dXJuIEBlbG8gKyBnLk9GRlNFVFxyXG5cdFx0aWYgQG9wcFtyXSA9PSBnLlBBVVNFIHRoZW4gcmV0dXJuIDBcclxuXHRcdGlmIHIgPj0gQHJlcy5sZW5ndGggdGhlbiByZXR1cm4gMFxyXG5cdFx0YiA9IGcudG91cm5hbWVudC5wZXJzb25zW0BvcHBbcl1dLmVsbyArIGcuT0ZGU0VUXHJcblx0XHRpZiBAcmVzW3JdID09ICcyJyB0aGVuIHJldHVybiBiICAgIyBXSU5cclxuXHRcdGlmIEByZXNbcl0gPT0gJzEnIHRoZW4gcmV0dXJuIGIvMiAjIERSQVdcclxuXHRcdDAgIyBMT1NTXHJcblxyXG5cdGNhbGNSb3VuZCA6IChyKSAtPlxyXG5cdFx0aWYgZy5GQUNUT1IgPT0gMCB0aGVuIEBjYWxjUm91bmQwIHIgZWxzZSBAY2FsY1JvdW5kMSByXHJcblxyXG5cdGNoYW5nZSA6IChyb3VuZHMpIC0+XHJcblx0XHRpZiByb3VuZHMgb2YgQGNhY2hlIHRoZW4gcmV0dXJuIEBjYWNoZVtyb3VuZHNdXHJcblx0XHRAY2FjaGVbcm91bmRzXSA9IGcuc3VtIChAY2FsY1JvdW5kIHIgZm9yIHIgaW4gcmFuZ2Ugcm91bmRzKVxyXG5cclxuXHRzY29yZSA6IC0+XHJcblx0XHRyZXN1bHQgPSAwXHJcblx0XHRmb3IgY2ggaW4gQHJlc1xyXG5cdFx0XHRyZXN1bHQgKz0gcGFyc2VJbnQgY2hcclxuXHRcdHJlc3VsdFxyXG5cclxuXHRhdmdFbG9EaWZmIDogLT5cclxuXHRcdHJlcyA9IFtdXHJcblx0XHRmb3IgaWQgaW4gQG9wcC5zbGljZSAwLCBAb3BwLmxlbmd0aCAtIDFcclxuXHRcdFx0aWYgaWQgPj0gMCB0aGVuIHJlcy5wdXNoIGFicyBAZWxvIC0gZy50b3VybmFtZW50LnBlcnNvbnNbaWRdLmVsb1xyXG5cdFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIGcuc3VtKHJlcykgLyByZXMubGVuZ3RoXHJcblxyXG5cdGJhbGFucyA6IC0+ICMgZsOkcmdiYWxhbnNcclxuXHRcdHJlc3VsdCA9IDBcclxuXHRcdGZvciBjaCBpbiBAY29sXHJcblx0XHRcdGlmIGNoPT0nYicgdGhlbiByZXN1bHQgLT0gMVxyXG5cdFx0XHRpZiBjaD09J3cnIHRoZW4gcmVzdWx0ICs9IDFcclxuXHRcdHJlc3VsdFxyXG5cclxuXHQjIG1hbmRhdG9yeSA6IC0+ICMgdyBpZiB3aGl0ZSwgYiBpZiBibGFjayBlbHNlIHNwYWNlXHJcblx0IyBcdHByaW50ICdiYWxhbnMnLEBiYWxhbnMoKVxyXG5cdCMgXHRpZiBAYmFsYW5zID49IDEgdGhlbiByZXR1cm4gJ2InXHJcblx0IyBcdGlmIEBiYWxhbnMgPD0gLTEgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdG4gPSBAY29sLmxlbmd0aFxyXG5cdCMgXHRpZiBuIDwgMiB0aGVuIHJldHVybiAnICdcclxuXHQjIFx0aWYgXCJ3d1wiID09IEBjb2wuc2xpY2Ugbi0yIHRoZW4gcmV0dXJuICdiJ1xyXG5cdCMgXHRpZiBcImJiXCIgPT0gQGNvbC5zbGljZSBuLTIgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdCcgJ1xyXG5cclxuXHRyZWFkIDogKHBsYXllcikgLT4gXHJcblx0XHQjIHByaW50IHBsYXllclxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllci5zbGljZSAyXHJcblx0XHRwcmludCAnb2Nycycsb2Nyc1xyXG5cdFx0Zm9yIG9jciBpbiBvY3JzXHJcblx0XHRcdGlmICd3JyBpbiBvY3IgdGhlbiBjb2w9J3cnXHJcblx0XHRcdGlmICdiJyBpbiBvY3IgdGhlbiBjb2w9J2InXHJcblx0XHRcdGlmICdfJyBpbiBvY3IgdGhlbiBjb2w9J18nXHJcblx0XHRcdGFyciA9IG9jci5zcGxpdCBjb2xcclxuXHRcdFx0QG9wcC5wdXNoIHBhcnNlSW50IGFyclswXVxyXG5cdFx0XHRAY29sICs9IGNvbFxyXG5cdFx0XHRpZiBhcnIubGVuZ3RoID09IDIgYW5kIGFyclsxXS5sZW5ndGggPT0gMSB0aGVuIEByZXMgKz0gYXJyWzFdXHJcblxyXG5cdHdyaXRlIDogLT4gIyAxMjM0IUNocmlzdGVyITEydzAhMjNiMSExNHcyICAgRWxvOjEyMzQgTmFtZTpDaHJpc3RlciBvcHBvbmVudDoyMyBjb2xvcjpiIHJlc3VsdDoxXHJcblx0XHRyZXMgPSBbXVxyXG5cdFx0cmVzLnB1c2ggQGVsb1xyXG5cdFx0cmVzLnB1c2ggQG5hbWVcclxuXHRcdHIgPSBAb3BwLmxlbmd0aFxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlIHIpXHJcblx0XHRyZXMucHVzaCBvY3Iuam9pbiBTRVBBUkFUT1JcclxuXHRcdHJlcy5qb2luIFNFUEFSQVRPUlxyXG4iXX0=
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee