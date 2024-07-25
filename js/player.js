// Generated by CoffeeScript 2.7.0
var indexOf = [].indexOf;

import {
  g,
  print,
  range,
  scalex,
  scaley,
  wrap,
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

  read(player) {
    var arr, col, j, len, ocr, ocrs, results;
    this.elo = parseInt(player[0]);
    this.name = player[1];
    this.opp = [];
    this.col = "";
    this.res = "";
    if (player.length < 3) {
      return;
    }
    ocrs = player[2];
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

  write() { // (1234!Christer!(12w0!23b1!14w2)) Elo:1234 Name:Christer opponent:23 color:b result:1
    var i, ocr, r, res;
    res = [];
    res.push(this.elo);
    res.push(this.name.replaceAll(' ', '_'));
    r = this.opp.length; // - 1
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
    res.push(wrap(ocr.join(SEPARATOR)));
    return res.join(SEPARATOR);
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsSUFBckM7RUFBMEMsU0FBMUM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUN0RSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUE7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRk07RUFBQTs7RUFJZCxNQUFTLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBRSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUksSUFBQyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFiOztBQUF1QjtBQUFBO01BQUEsS0FBQSxxQ0FBQTs7WUFBd0MsQ0FBSSxDQUFDLENBQUM7dUJBQTlDLENBQUMsQ0FBQzs7TUFBRixDQUFBOzs7RUFGZjs7RUFJVCxHQUFNLENBQUEsQ0FBQTtBQUFFLFFBQUE7aUJBQUMsQ0FBQyxDQUFDLGtCQUFPLElBQUMsQ0FBQSxLQUFWO0VBQUg7O0VBRU4sVUFBYSxDQUFDLENBQUQsQ0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtJQUFFLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxDQUFDLENBQUMsR0FBaEI7QUFBeUIsYUFB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LHNjYWxleCxzY2FsZXksd3JhcCxTRVBBUkFUT1IgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllclxyXG5cdGNvbnN0cnVjdG9yIDogKEBpZCwgQG5hbWU9XCJcIiwgQGVsbz1cIjE0MDBcIiwgQG9wcD1bXSwgQGNvbD1cIlwiLCBAcmVzPVwiXCIsIEBhY3RpdmUgPSB0cnVlKSAtPiBcclxuXHRcdEBjYWNoZSA9IHt9XHJcblx0XHRAcG9zID0gW10gIyBvbmUgZm9yIGVhY2ggcm91bmRcclxuXHJcblx0dG9nZ2xlIDogLT4gXHJcblx0XHRAYWN0aXZlID0gbm90IEBhY3RpdmVcclxuXHRcdGcudG91cm5hbWVudC5wYXVzZWQgPSAocC5pZCBmb3IgcCBpbiBnLnRvdXJuYW1lbnQucGVyc29ucyB3aGVuIG5vdCBwLmFjdGl2ZSlcclxuXHJcblx0YnllIDogLT4gZy5CWUUgaW4gQG9wcFxyXG5cclxuXHRjYWxjUm91bmQwIDogKHIpIC0+XHJcblx0XHRpZiBAb3BwW3JdID09IGcuQllFIHRoZW4gcmV0dXJuIGcuSyAqICgxLjAgLSBnLkYgMClcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiAwXHJcblx0XHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHRcdGEgPSBAZWxvXHJcblx0XHRiID0gZy50b3VybmFtZW50LnBlcnNvbnNbQG9wcFtyXV0uZWxvXHJcblx0XHRkaWZmID0gYSAtIGJcclxuXHRcdGcuSyAqIChAcmVzW3JdLzIgLSBnLkYgZGlmZilcclxuXHJcblx0Y2FsY1JvdW5kMSA6IChyKSAtPiBcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgICB0aGVuIHJldHVybiBAZWxvICsgZy5PRkZTRVRcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiAwXHJcblx0XHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHRcdGIgPSBnLnRvdXJuYW1lbnQucGVyc29uc1tAb3BwW3JdXS5lbG8gKyBnLk9GRlNFVFxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gYiAgICMgV0lOXHJcblx0XHRpZiBAcmVzW3JdID09ICcxJyB0aGVuIHJldHVybiBiLzIgIyBEUkFXXHJcblx0XHQwICMgTE9TU1xyXG5cclxuXHRjYWxjUm91bmQgOiAocikgLT5cclxuXHRcdGlmIGcuRkFDVE9SID09IDAgdGhlbiBAY2FsY1JvdW5kMCByIGVsc2UgQGNhbGNSb3VuZDEgclxyXG5cclxuXHRjaGFuZ2UgOiAocm91bmRzKSAtPlxyXG5cdFx0aWYgcm91bmRzIG9mIEBjYWNoZSB0aGVuIHJldHVybiBAY2FjaGVbcm91bmRzXVxyXG5cdFx0QGNhY2hlW3JvdW5kc10gPSBnLnN1bSAoQGNhbGNSb3VuZCByIGZvciByIGluIHJhbmdlIHJvdW5kcylcclxuXHJcblx0c2NvcmUgOiAtPlxyXG5cdFx0cmVzdWx0ID0gMFxyXG5cdFx0Zm9yIGNoIGluIEByZXNcclxuXHRcdFx0cmVzdWx0ICs9IHBhcnNlSW50IGNoXHJcblx0XHRyZXN1bHRcclxuXHJcblx0YXZnRWxvRGlmZiA6IC0+XHJcblx0XHRyZXMgPSBbXVxyXG5cdFx0Zm9yIGlkIGluIEBvcHAuc2xpY2UgMCwgQG9wcC5sZW5ndGggLSAxXHJcblx0XHRcdGlmIGlkID49IDAgdGhlbiByZXMucHVzaCBhYnMgQGVsbyAtIGcudG91cm5hbWVudC5wZXJzb25zW2lkXS5lbG9cclxuXHRcdGlmIHJlcy5sZW5ndGggPT0gMCB0aGVuIDAgZWxzZSBnLnN1bShyZXMpIC8gcmVzLmxlbmd0aFxyXG5cclxuXHRiYWxhbnMgOiAtPiAjIGbDpHJnYmFsYW5zXHJcblx0XHRyZXN1bHQgPSAwXHJcblx0XHRmb3IgY2ggaW4gQGNvbFxyXG5cdFx0XHRpZiBjaD09J2InIHRoZW4gcmVzdWx0IC09IDFcclxuXHRcdFx0aWYgY2g9PSd3JyB0aGVuIHJlc3VsdCArPSAxXHJcblx0XHRyZXN1bHRcclxuXHJcblx0cmVhZCA6IChwbGF5ZXIpIC0+IFxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllclsyXVxyXG5cdFx0Zm9yIG9jciBpbiBvY3JzXHJcblx0XHRcdGlmICd3JyBpbiBvY3IgdGhlbiBjb2w9J3cnXHJcblx0XHRcdGlmICdiJyBpbiBvY3IgdGhlbiBjb2w9J2InXHJcblx0XHRcdGlmICdfJyBpbiBvY3IgdGhlbiBjb2w9J18nXHJcblx0XHRcdGFyciA9IG9jci5zcGxpdCBjb2xcclxuXHRcdFx0QG9wcC5wdXNoIHBhcnNlSW50IGFyclswXVxyXG5cdFx0XHRAY29sICs9IGNvbFxyXG5cdFx0XHRpZiBhcnIubGVuZ3RoID09IDIgYW5kIGFyclsxXS5sZW5ndGggPT0gMSB0aGVuIEByZXMgKz0gYXJyWzFdXHJcblxyXG5cdHdyaXRlIDogLT4gIyAoMTIzNCFDaHJpc3RlciEoMTJ3MCEyM2IxITE0dzIpKSBFbG86MTIzNCBOYW1lOkNocmlzdGVyIG9wcG9uZW50OjIzIGNvbG9yOmIgcmVzdWx0OjFcclxuXHRcdHJlcyA9IFtdXHJcblx0XHRyZXMucHVzaCBAZWxvXHJcblx0XHRyZXMucHVzaCBAbmFtZS5yZXBsYWNlQWxsICcgJywnXydcclxuXHRcdHIgPSBAb3BwLmxlbmd0aCAjIC0gMVxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlKHIpKSBcclxuXHRcdHJlcy5wdXNoIHdyYXAgb2NyLmpvaW4gU0VQQVJBVE9SXHJcblx0XHRyZXMuam9pbiBTRVBBUkFUT1JcclxuIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee