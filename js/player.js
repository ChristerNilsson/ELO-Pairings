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
      ref = g.tournament.playersByID;
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

  // calcRound0 : (r) ->
  // 	if @opp[r] == g.BYE then return g.K * (1.0 - g.F 0)
  // 	if @opp[r] == g.PAUSE then return 0
  // 	if r >= @res.length then return 0
  // 	a = @elo
  // 	b = g.tournament.playersByID[@opp[r]].elo
  // 	diff = a - b
  // 	g.K * (@res[r]/2 - g.F diff)
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
    b = g.tournament.playersByID[this.opp[r]].elo + g.OFFSET;
    if (this.res[r] === '2') {
      return b; // WIN
    }
    if (this.res[r] === '1') {
      return b / 2; // DRAW
    }
    return 0; // LOSS
  }

  calcRound(r) {
    // if g.FACTOR == 0 then @calcRound0 r else @calcRound1 r
    return this.calcRound1(r);
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

  score(rounds) {
    var r;
    return g.sum((function() {
      var j, len, ref, results;
      ref = range(rounds - 1);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push(parseInt(this.res[r]));
      }
      return results;
    }).call(this));
  }

  // result = 0
  // for r in range rounds-1
  // #for ch in @res
  // 	result += parseInt @res[r]
  // result
  avgEloDiff() {
    var id, j, len, ref, res;
    res = [];
    ref = this.opp.slice(0, this.opp.length);
    // - 1
    for (j = 0, len = ref.length; j < len; j++) {
      id = ref[j];
      if (id >= 0) {
        res.push(abs(this.elo - g.tournament.playersByID[id].elo));
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
// print 'ocrs',ocrs
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
    if (r === 0) {
      return res.join(SEPARATOR);
    }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUN0RSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUE7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRk07RUFBQTs7RUFJZCxNQUFTLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBRSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUksSUFBQyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFiOztBQUF1QjtBQUFBO01BQUEsS0FBQSxxQ0FBQTs7WUFBNEMsQ0FBSSxDQUFDLENBQUM7dUJBQWxELENBQUMsQ0FBQzs7TUFBRixDQUFBOzs7RUFGZjs7RUFJVCxHQUFNLENBQUEsQ0FBQTtBQUFFLFFBQUE7aUJBQUMsQ0FBQyxDQUFDLGtCQUFPLElBQUMsQ0FBQSxLQUFWO0VBQUgsQ0FSUDs7Ozs7Ozs7OztFQW1CQyxVQUFhLENBQUMsQ0FBRCxDQUFBO0FBQ2QsUUFBQTtJQUFFLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxDQUFDLENBQUMsR0FBaEI7QUFBMkIsYUFBTyxJQUFDLENBQUEsR0FBRCxH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QUQsQ0FBUCxDQUFBLENBQUEsQ0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBakIsQ0FBQSxDQUFBLENBQTBCLENBQUEsR0FBSSxDQUFQLEdBQWMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQWxCLEdBQTJCLEVBQWxELENBQUE7TUFBQSxDQUFBOzs7SUFDUCxHQUFHLENBQUMsSUFBSixDQUFTLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVCxDQUFUO1dBQ0EsR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFUO0VBUk87O0FBdEZGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyxwcmludCxyYW5nZSxzY2FsZXgsc2NhbGV5LFNFUEFSQVRPUiB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyXHJcblx0Y29uc3RydWN0b3IgOiAoQGlkLCBAbmFtZT1cIlwiLCBAZWxvPVwiMTQwMFwiLCBAb3BwPVtdLCBAY29sPVwiXCIsIEByZXM9XCJcIiwgQGFjdGl2ZSA9IHRydWUpIC0+IFxyXG5cdFx0QGNhY2hlID0ge31cclxuXHRcdEBwb3MgPSBbXSAjIG9uZSBmb3IgZWFjaCByb3VuZFxyXG5cclxuXHR0b2dnbGUgOiAtPiBcclxuXHRcdEBhY3RpdmUgPSBub3QgQGFjdGl2ZVxyXG5cdFx0Zy50b3VybmFtZW50LnBhdXNlZCA9IChwLmlkIGZvciBwIGluIGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRCB3aGVuIG5vdCBwLmFjdGl2ZSlcclxuXHJcblx0YnllIDogLT4gZy5CWUUgaW4gQG9wcFxyXG5cclxuXHQjIGNhbGNSb3VuZDAgOiAocikgLT5cclxuXHQjIFx0aWYgQG9wcFtyXSA9PSBnLkJZRSB0aGVuIHJldHVybiBnLksgKiAoMS4wIC0gZy5GIDApXHJcblx0IyBcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiAwXHJcblx0IyBcdGlmIHIgPj0gQHJlcy5sZW5ndGggdGhlbiByZXR1cm4gMFxyXG5cdCMgXHRhID0gQGVsb1xyXG5cdCMgXHRiID0gZy50b3VybmFtZW50LnBsYXllcnNCeUlEW0BvcHBbcl1dLmVsb1xyXG5cdCMgXHRkaWZmID0gYSAtIGJcclxuXHQjIFx0Zy5LICogKEByZXNbcl0vMiAtIGcuRiBkaWZmKVxyXG5cclxuXHRjYWxjUm91bmQxIDogKHIpIC0+IFxyXG5cdFx0aWYgQG9wcFtyXSA9PSBnLkJZRSAgIHRoZW4gcmV0dXJuIEBlbG8gKyBnLk9GRlNFVFxyXG5cdFx0aWYgQG9wcFtyXSA9PSBnLlBBVVNFIHRoZW4gcmV0dXJuIDBcclxuXHRcdGlmIHIgPj0gQHJlcy5sZW5ndGggdGhlbiByZXR1cm4gMFxyXG5cdFx0YiA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG8gKyBnLk9GRlNFVFxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gYiAgICMgV0lOXHJcblx0XHRpZiBAcmVzW3JdID09ICcxJyB0aGVuIHJldHVybiBiLzIgIyBEUkFXXHJcblx0XHQwICMgTE9TU1xyXG5cclxuXHRjYWxjUm91bmQgOiAocikgLT5cclxuXHRcdCMgaWYgZy5GQUNUT1IgPT0gMCB0aGVuIEBjYWxjUm91bmQwIHIgZWxzZSBAY2FsY1JvdW5kMSByXHJcblx0XHRAY2FsY1JvdW5kMSByXHJcblxyXG5cdGNoYW5nZSA6IChyb3VuZHMpIC0+XHJcblx0XHRpZiByb3VuZHMgb2YgQGNhY2hlIHRoZW4gcmV0dXJuIEBjYWNoZVtyb3VuZHNdXHJcblx0XHRAY2FjaGVbcm91bmRzXSA9IGcuc3VtIChAY2FsY1JvdW5kIHIgZm9yIHIgaW4gcmFuZ2Ugcm91bmRzKVxyXG5cclxuXHRzY29yZSA6IChyb3VuZHMpIC0+IGcuc3VtIChwYXJzZUludCBAcmVzW3JdIGZvciByIGluIHJhbmdlIHJvdW5kcy0xKVxyXG5cdFx0IyByZXN1bHQgPSAwXHJcblx0XHQjIGZvciByIGluIHJhbmdlIHJvdW5kcy0xXHJcblx0XHQjICNmb3IgY2ggaW4gQHJlc1xyXG5cdFx0IyBcdHJlc3VsdCArPSBwYXJzZUludCBAcmVzW3JdXHJcblx0XHQjIHJlc3VsdFxyXG5cclxuXHRhdmdFbG9EaWZmIDogLT5cclxuXHRcdHJlcyA9IFtdXHJcblx0XHRmb3IgaWQgaW4gQG9wcC5zbGljZSAwLCBAb3BwLmxlbmd0aCAjIC0gMVxyXG5cdFx0XHRpZiBpZCA+PSAwIHRoZW4gcmVzLnB1c2ggYWJzIEBlbG8gLSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbaWRdLmVsb1xyXG5cdFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIGcuc3VtKHJlcykgLyByZXMubGVuZ3RoXHJcblxyXG5cdGJhbGFucyA6IC0+ICMgZsOkcmdiYWxhbnNcclxuXHRcdHJlc3VsdCA9IDBcclxuXHRcdGZvciBjaCBpbiBAY29sXHJcblx0XHRcdGlmIGNoPT0nYicgdGhlbiByZXN1bHQgLT0gMVxyXG5cdFx0XHRpZiBjaD09J3cnIHRoZW4gcmVzdWx0ICs9IDFcclxuXHRcdHJlc3VsdFxyXG5cclxuXHQjIG1hbmRhdG9yeSA6IC0+ICMgdyBpZiB3aGl0ZSwgYiBpZiBibGFjayBlbHNlIHNwYWNlXHJcblx0IyBcdHByaW50ICdiYWxhbnMnLEBiYWxhbnMoKVxyXG5cdCMgXHRpZiBAYmFsYW5zID49IDEgdGhlbiByZXR1cm4gJ2InXHJcblx0IyBcdGlmIEBiYWxhbnMgPD0gLTEgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdG4gPSBAY29sLmxlbmd0aFxyXG5cdCMgXHRpZiBuIDwgMiB0aGVuIHJldHVybiAnICdcclxuXHQjIFx0aWYgXCJ3d1wiID09IEBjb2wuc2xpY2Ugbi0yIHRoZW4gcmV0dXJuICdiJ1xyXG5cdCMgXHRpZiBcImJiXCIgPT0gQGNvbC5zbGljZSBuLTIgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdCcgJ1xyXG5cclxuXHRyZWFkIDogKHBsYXllcikgLT4gXHJcblx0XHQjIHByaW50IHBsYXllclxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllci5zbGljZSAyXHJcblx0XHQjIHByaW50ICdvY3JzJyxvY3JzXHJcblx0XHRmb3Igb2NyIGluIG9jcnNcclxuXHRcdFx0aWYgJ3cnIGluIG9jciB0aGVuIGNvbD0ndydcclxuXHRcdFx0aWYgJ2InIGluIG9jciB0aGVuIGNvbD0nYidcclxuXHRcdFx0aWYgJ18nIGluIG9jciB0aGVuIGNvbD0nXydcclxuXHRcdFx0YXJyID0gb2NyLnNwbGl0IGNvbFxyXG5cdFx0XHRAb3BwLnB1c2ggcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdEBjb2wgKz0gY29sXHJcblx0XHRcdGlmIGFyci5sZW5ndGggPT0gMiBhbmQgYXJyWzFdLmxlbmd0aCA9PSAxIHRoZW4gQHJlcyArPSBhcnJbMV1cclxuXHJcblx0d3JpdGUgOiAtPiAjIDEyMzQhQ2hyaXN0ZXIhMTJ3MCEyM2IxITE0dzIgICBFbG86MTIzNCBOYW1lOkNocmlzdGVyIG9wcG9uZW50OjIzIGNvbG9yOmIgcmVzdWx0OjFcclxuXHRcdHJlcyA9IFtdXHJcblx0XHRyZXMucHVzaCBAZWxvXHJcblx0XHRyZXMucHVzaCBAbmFtZVx0XHRcclxuXHRcdHIgPSBAb3BwLmxlbmd0aFxyXG5cdFx0aWYgciA9PSAwIHRoZW4gcmV0dXJuIHJlcy5qb2luIFNFUEFSQVRPUlxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlIHIpXHJcblx0XHRyZXMucHVzaCBvY3Iuam9pbiBTRVBBUkFUT1JcclxuXHRcdHJlcy5qb2luIFNFUEFSQVRPUlxyXG4iXX0=
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee