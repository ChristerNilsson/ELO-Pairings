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
      return this.elo; // + g.OFFSET
    }
    if (this.opp[r] === g.PAUSE) {
      return 0;
    }
    if (r >= this.res.length) {
      return 0;
    }
    b = g.tournament.playersByID[this.opp[r]].elo; // + g.OFFSET
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUN0RSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUE7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRk07RUFBQTs7RUFJZCxNQUFTLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBRSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUksSUFBQyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFiOztBQUF1QjtBQUFBO01BQUEsS0FBQSxxQ0FBQTs7WUFBNEMsQ0FBSSxDQUFDLENBQUM7dUJBQWxELENBQUMsQ0FBQzs7TUFBRixDQUFBOzs7RUFGZjs7RUFJVCxHQUFNLENBQUEsQ0FBQTtBQUFFLFFBQUE7aUJBQUMsQ0FBQyxDQUFDLGtCQUFPLElBQUMsQ0FBQSxLQUFWO0VBQUgsQ0FSUDs7Ozs7Ozs7OztFQW1CQyxVQUFhLENBQUMsQ0FBRCxDQUFBO0FBQ2QsUUFBQTtJQUFFLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxDQUFDLENBQUMsR0FBaEI7QUFBMkIsYUFBTyxJQUFDLENBQUEsSUFBbkM7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LENBQUMsQ0FBRCxDQUFqQixDQUFBLENBQUEsQ0FBMEIsQ0FBQSxHQUFJLENBQVAsR0FBYyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBbEIsR0FBMkIsRUFBbEQsQ0FBQTtNQUFBLENBQUE7OztJQUNQLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFULENBQVQ7V0FDQSxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQ7RUFSTzs7QUF0RkYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnLHByaW50LHJhbmdlLHNjYWxleCxzY2FsZXksU0VQQVJBVE9SIH0gZnJvbSAnLi9nbG9iYWxzLmpzJyBcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJcclxuXHRjb25zdHJ1Y3RvciA6IChAaWQsIEBuYW1lPVwiXCIsIEBlbG89XCIxNDAwXCIsIEBvcHA9W10sIEBjb2w9XCJcIiwgQHJlcz1cIlwiLCBAYWN0aXZlID0gdHJ1ZSkgLT4gXHJcblx0XHRAY2FjaGUgPSB7fVxyXG5cdFx0QHBvcyA9IFtdICMgb25lIGZvciBlYWNoIHJvdW5kXHJcblxyXG5cdHRvZ2dsZSA6IC0+IFxyXG5cdFx0QGFjdGl2ZSA9IG5vdCBAYWN0aXZlXHJcblx0XHRnLnRvdXJuYW1lbnQucGF1c2VkID0gKHAuaWQgZm9yIHAgaW4gZy50b3VybmFtZW50LnBsYXllcnNCeUlEIHdoZW4gbm90IHAuYWN0aXZlKVxyXG5cclxuXHRieWUgOiAtPiBnLkJZRSBpbiBAb3BwXHJcblxyXG5cdCMgY2FsY1JvdW5kMCA6IChyKSAtPlxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuQllFIHRoZW4gcmV0dXJuIGcuSyAqICgxLjAgLSBnLkYgMClcclxuXHQjIFx0aWYgQG9wcFtyXSA9PSBnLlBBVVNFIHRoZW4gcmV0dXJuIDBcclxuXHQjIFx0aWYgciA+PSBAcmVzLmxlbmd0aCB0aGVuIHJldHVybiAwXHJcblx0IyBcdGEgPSBAZWxvXHJcblx0IyBcdGIgPSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV0uZWxvXHJcblx0IyBcdGRpZmYgPSBhIC0gYlxyXG5cdCMgXHRnLksgKiAoQHJlc1tyXS8yIC0gZy5GIGRpZmYpXHJcblxyXG5cdGNhbGNSb3VuZDEgOiAocikgLT4gXHJcblx0XHRpZiBAb3BwW3JdID09IGcuQllFICAgdGhlbiByZXR1cm4gQGVsbyAjICsgZy5PRkZTRVRcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiAwXHJcblx0XHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHRcdGIgPSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV0uZWxvICMgKyBnLk9GRlNFVFxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gYiAgICMgV0lOXHJcblx0XHRpZiBAcmVzW3JdID09ICcxJyB0aGVuIHJldHVybiBiLzIgIyBEUkFXXHJcblx0XHQwICMgTE9TU1xyXG5cclxuXHRjYWxjUm91bmQgOiAocikgLT5cclxuXHRcdCMgaWYgZy5GQUNUT1IgPT0gMCB0aGVuIEBjYWxjUm91bmQwIHIgZWxzZSBAY2FsY1JvdW5kMSByXHJcblx0XHRAY2FsY1JvdW5kMSByXHJcblxyXG5cdGNoYW5nZSA6IChyb3VuZHMpIC0+XHJcblx0XHRpZiByb3VuZHMgb2YgQGNhY2hlIHRoZW4gcmV0dXJuIEBjYWNoZVtyb3VuZHNdXHJcblx0XHRAY2FjaGVbcm91bmRzXSA9IGcuc3VtIChAY2FsY1JvdW5kIHIgZm9yIHIgaW4gcmFuZ2Ugcm91bmRzKVxyXG5cclxuXHRzY29yZSA6IChyb3VuZHMpIC0+IGcuc3VtIChwYXJzZUludCBAcmVzW3JdIGZvciByIGluIHJhbmdlIHJvdW5kcy0xKVxyXG5cdFx0IyByZXN1bHQgPSAwXHJcblx0XHQjIGZvciByIGluIHJhbmdlIHJvdW5kcy0xXHJcblx0XHQjICNmb3IgY2ggaW4gQHJlc1xyXG5cdFx0IyBcdHJlc3VsdCArPSBwYXJzZUludCBAcmVzW3JdXHJcblx0XHQjIHJlc3VsdFxyXG5cclxuXHRhdmdFbG9EaWZmIDogLT5cclxuXHRcdHJlcyA9IFtdXHJcblx0XHRmb3IgaWQgaW4gQG9wcC5zbGljZSAwLCBAb3BwLmxlbmd0aCAjIC0gMVxyXG5cdFx0XHRpZiBpZCA+PSAwIHRoZW4gcmVzLnB1c2ggYWJzIEBlbG8gLSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbaWRdLmVsb1xyXG5cdFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIGcuc3VtKHJlcykgLyByZXMubGVuZ3RoXHJcblxyXG5cdGJhbGFucyA6IC0+ICMgZsOkcmdiYWxhbnNcclxuXHRcdHJlc3VsdCA9IDBcclxuXHRcdGZvciBjaCBpbiBAY29sXHJcblx0XHRcdGlmIGNoPT0nYicgdGhlbiByZXN1bHQgLT0gMVxyXG5cdFx0XHRpZiBjaD09J3cnIHRoZW4gcmVzdWx0ICs9IDFcclxuXHRcdHJlc3VsdFxyXG5cclxuXHQjIG1hbmRhdG9yeSA6IC0+ICMgdyBpZiB3aGl0ZSwgYiBpZiBibGFjayBlbHNlIHNwYWNlXHJcblx0IyBcdHByaW50ICdiYWxhbnMnLEBiYWxhbnMoKVxyXG5cdCMgXHRpZiBAYmFsYW5zID49IDEgdGhlbiByZXR1cm4gJ2InXHJcblx0IyBcdGlmIEBiYWxhbnMgPD0gLTEgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdG4gPSBAY29sLmxlbmd0aFxyXG5cdCMgXHRpZiBuIDwgMiB0aGVuIHJldHVybiAnICdcclxuXHQjIFx0aWYgXCJ3d1wiID09IEBjb2wuc2xpY2Ugbi0yIHRoZW4gcmV0dXJuICdiJ1xyXG5cdCMgXHRpZiBcImJiXCIgPT0gQGNvbC5zbGljZSBuLTIgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdCcgJ1xyXG5cclxuXHRyZWFkIDogKHBsYXllcikgLT4gXHJcblx0XHQjIHByaW50IHBsYXllclxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllci5zbGljZSAyXHJcblx0XHQjIHByaW50ICdvY3JzJyxvY3JzXHJcblx0XHRmb3Igb2NyIGluIG9jcnNcclxuXHRcdFx0aWYgJ3cnIGluIG9jciB0aGVuIGNvbD0ndydcclxuXHRcdFx0aWYgJ2InIGluIG9jciB0aGVuIGNvbD0nYidcclxuXHRcdFx0aWYgJ18nIGluIG9jciB0aGVuIGNvbD0nXydcclxuXHRcdFx0YXJyID0gb2NyLnNwbGl0IGNvbFxyXG5cdFx0XHRAb3BwLnB1c2ggcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdEBjb2wgKz0gY29sXHJcblx0XHRcdGlmIGFyci5sZW5ndGggPT0gMiBhbmQgYXJyWzFdLmxlbmd0aCA9PSAxIHRoZW4gQHJlcyArPSBhcnJbMV1cclxuXHJcblx0d3JpdGUgOiAtPiAjIDEyMzQhQ2hyaXN0ZXIhMTJ3MCEyM2IxITE0dzIgICBFbG86MTIzNCBOYW1lOkNocmlzdGVyIG9wcG9uZW50OjIzIGNvbG9yOmIgcmVzdWx0OjFcclxuXHRcdHJlcyA9IFtdXHJcblx0XHRyZXMucHVzaCBAZWxvXHJcblx0XHRyZXMucHVzaCBAbmFtZVx0XHRcclxuXHRcdHIgPSBAb3BwLmxlbmd0aFxyXG5cdFx0aWYgciA9PSAwIHRoZW4gcmV0dXJuIHJlcy5qb2luIFNFUEFSQVRPUlxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlIHIpXHJcblx0XHRyZXMucHVzaCBvY3Iuam9pbiBTRVBBUkFUT1JcclxuXHRcdHJlcy5qb2luIFNFUEFSQVRPUlxyXG4iXX0=
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee