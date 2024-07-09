// Generated by CoffeeScript 2.7.0
var indexOf = [].indexOf;

import {
  g,
  print,
  range,
  scalex,
  scaley
} from './globals.js';

export var Player = class Player {
  constructor(id1, name = "", elo = "1400", opp = [], col1 = "", res1 = "") {
    this.id = id1;
    this.name = name;
    this.elo = elo;
    this.opp = opp;
    this.col = col1;
    this.res = res1;
    this.active = true;
  }

  toString() {
    return `${this.id} ${this.name} elo:${this.elo} ${this.col} res:${this.res} opp:[${this.opp}] score:${this.score().toFixed(1)} perf:${this.performance(g.tournament.round).toFixed(0)}`;
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

  scoringProbability(diff) {
    return 1 / (1 + pow(10, diff / 400));
  }

  calcRound(r) { // Hur hantera frirond?
    var b, c, diff;
    if (this.opp[r] === -1) {
      return 0;
    }
    b = this.elo;
    c = g.tournament.persons[this.opp[r]].elo;
    diff = b - c;
    if (this.res[r] === '2') {
      return g.K * this.scoringProbability(diff);
    }
    if (this.res[r] === '1') {
      return 0.5 * g.K * this.scoringProbability(diff);
    }
    if (this.res[r] === '0') {
      return -g.K * this.scoringProbability(-diff);
    }
    return 0;
  }

  performance(rounds) {
    var asum, j, len, r, ref;
    asum = 0;
    ref = range(rounds);
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      asum += this.calcRound(r);
    }
    return this.elo + asum;
  }

  avgEloDiff() {
    var id, j, len, ref, res;
    res = [];
    ref = this.opp.slice(0, this.opp.length - 1);
    for (j = 0, len = ref.length; j < len; j++) {
      id = ref[j];
      if (id !== -1) {
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

  // score : ->
  // 	result = 0
  // 	n = g.tournament.round
  // 	for i in range n
  // 		if i < @col.length and i < @res.length
  // 			key = @col[i] + @res[i]
  // 			res = {'w2': 1, 'b2': 1, 'w1': 0.5, 'b1': 0.5, 'w0': 0, 'b0': 0}[key]
  // 	#print 'id,score',@id, @res, result,n
  // 	result
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
      } else {
        col = 'b';
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

  write() { // (1234!Christer!(12w0!23b1!142)) Elo:1234 Name:Christer opponent:23 color:b result:1
    var i, ocr, r, res;
    res = [];
    res.push(this.elo);
    res.push(this.name.replaceAll(' ', '_'));
    r = this.opp.length - 1;
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
    res.push('(' + ocr.join('!') + ')');
    return res.join('!');
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFXLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFBckU7O0VBRWQsUUFBVyxDQUFBLENBQUE7V0FBRyxDQUFBLENBQUEsQ0FBRyxJQUFDLENBQUEsRUFBSixFQUFBLENBQUEsQ0FBVSxJQUFDLENBQUEsSUFBWCxDQUFBLEtBQUEsQ0FBQSxDQUF1QixJQUFDLENBQUEsR0FBeEIsRUFBQSxDQUFBLENBQStCLElBQUMsQ0FBQSxHQUFoQyxDQUFBLEtBQUEsQ0FBQSxDQUEyQyxJQUFDLENBQUEsR0FBNUMsQ0FBQSxNQUFBLENBQUEsQ0FBd0QsSUFBQyxDQUFBLEdBQXpELENBQUEsUUFBQSxDQUFBLENBQXVFLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBakIsQ0FBdkUsQ0FBQSxNQUFBLENBQUEsQ0FBbUcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQTFCLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsQ0FBekMsQ0FBbkcsQ0FBQTtFQUFIOztFQUVYLE1BQVMsQ0FBQSxDQUFBO0FBQ1YsUUFBQTtJQUFFLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBSSxJQUFDLENBQUE7V0FDZixDQUFDLENBQUMsVUFBVSxDQUFDLE1BQWI7O0FBQXVCO0FBQUE7TUFBQSxLQUFBLHFDQUFBOztZQUF3QyxDQUFJLENBQUMsQ0FBQzt1QkFBOUMsQ0FBQyxDQUFDOztNQUFGLENBQUE7OztFQUZmOztFQUlULGtCQUFxQixDQUFDLElBQUQsQ0FBQTtXQUFVLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxHQUFBLENBQUksRUFBSixFQUFRLElBQUEsR0FBSyxHQUFiLENBQUw7RUFBZDs7RUFFckIsU0FBWSxDQUFDLENBQUQsQ0FBQSxFQUFBO0FBQ2IsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQUUsSUFBRyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSixLQUFXLENBQUMsQ0FBZjtBQUFzQixhQUFPLEVBQTdCOztJQUNBLENBQUEsR0FBSSxJQUFDLENBQUE7SUFDTCxDQUFBLEdBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUwsQ0FBUyxDQUFDO0lBQ2xDLElBQUEsR0FBTyxDQUFBLEdBQUk7SUFDWCxJQUFHLElBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBRCxDQUFKLEtBQVcsR0FBZDtBQUF1QixhQUFhLENBQUMsQ0FBQyxDQUFGLEdBQU0sSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLEVBQTFDOztJQUNBLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxHQUFkO0FBQXVCLGFBQU8sR0FBQSxHQUFNLENBQUMsQ0FBQyxDQUFSLEdBQVksSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLEVBQTFDOztJQUNBLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxHQUFkO0FBQXVCLGFBQVksQ0FBQyxDQUFDLENBQUMsQ0FBSCxHQUFPLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixDQUFDLElBQXJCLEVBQTFDOztXQUNBO0VBUlc7O0VBVVosV0FBYyxDQUFDLE1BQUQsQ0FBQTtBQUNmLFFBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQUUsSUFBQSxHQUFPO0FBQ1A7SUFBQSxLQUFBLHFDQUFBOztNQUNDLElBQUEsSUFBUSxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVg7SUFEVDtXQUVBLElBQUMsQ0FBQSxHQUFELEdBQU87RUFKTTs7RUFNZCxVQUFhLENBQUEsQ0FBQTtBQUNkLFFBQUEsRUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUUsR0FBQSxHQUFNO0FBQ047SUFBQSxLQUFBLHFDQUFBOztNQUNDLElBQUcsRUFBQSxLQUFNLENBQUMsQ0FBVjtRQUFpQixHQUFHLENBQUMsSUFBSixDQUFTLEdBQUEsQ0FBSSxJQUFDLENBQUEsR0FBRCxHQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUQsQ0FBSSxDQUFDLEdBQXBDLENBQVQsRUFBakI7O0lBREQ7SUFFQSxJQUFHLEdBQUcsQ0FBQyxNQUFKLEtBQWMsQ0FBakI7YUFBd0IsRUFBeEI7S0FBQSxNQUFBO2FBQStCLENBQUMsQ0FBQyxHQUFGLENBQU0sR0FBTixDQUFBLEdBQWEsR0FBRyxDQUFDLE9BQWhEOztFQUpZOztFQU1iLE1BQVMsQ0FBQSxDQUFBLEVBQUE7QUFDVixRQUFBLEVBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQTtJQUFFLE1BQUEsR0FBUztBQUNUO0lBQUEsS0FBQSxxQ0FBQTs7TUFDQyxJQUFHLEVBQUEsS0FBSSxHQUFQO1FBQWdCLE1BQUEsSUFBVSxFQUExQjs7TUFDQSxJQUFHLEVBQUEsS0FBSSxHQUFQO1FBQWdCLE1BQUEsSUFBVSxFQUExQjs7SUFGRDtXQUdBO0VBTFEsQ0FoQ1Y7Ozs7Ozs7Ozs7O0VBaURDLElBQU8sQ0FBQyxNQUFELENBQUE7QUFDUixRQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBO0lBQUUsSUFBQyxDQUFBLEdBQUQsR0FBTyxRQUFBLENBQVMsTUFBTSxDQUFDLENBQUQsQ0FBZjtJQUNQLElBQUMsQ0FBQSxJQUFELEdBQVEsTUFBTSxDQUFDLENBQUQ7SUFDZCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBQ1AsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxHQUFELEdBQU87SUFDUCxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQW5CO0FBQTBCLGFBQTFCOztJQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsQ0FBRDtBQUNiO0lBQUEsS0FBQSxzQ0FBQTs7TUFDQyxpQkFBVSxLQUFQLFNBQUg7UUFBbUIsR0FBQSxHQUFJLElBQXZCO09BQUEsTUFBQTtRQUFnQyxHQUFBLEdBQUksSUFBcEM7O01BQ0EsR0FBQSxHQUFNLEdBQUcsQ0FBQyxLQUFKLENBQVUsR0FBVjtNQUNOLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFVLFFBQUEsQ0FBUyxHQUFHLENBQUMsQ0FBRCxDQUFaLENBQVY7TUFDQSxJQUFDLENBQUEsR0FBRCxJQUFRO01BQ1IsSUFBRyxHQUFHLENBQUMsTUFBSixLQUFjLENBQWQsSUFBb0IsR0FBRyxDQUFDLENBQUQsQ0FBRyxDQUFDLE1BQVAsS0FBaUIsQ0FBeEM7cUJBQStDLElBQUMsQ0FBQSxHQUFELElBQVEsR0FBRyxDQUFDLENBQUQsR0FBMUQ7T0FBQSxNQUFBOzZCQUFBOztJQUxELENBQUE7O0VBUk07O0VBZVAsS0FBUSxDQUFBLENBQUEsRUFBQTtBQUNULFFBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUE7SUFBRSxHQUFBLEdBQU07SUFDTixHQUFHLENBQUMsSUFBSixDQUFTLElBQUMsQ0FBQSxHQUFWO0lBQ0EsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsR0FBakIsRUFBcUIsR0FBckIsQ0FBVDtJQUNBLENBQUEsR0FBSSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsR0FBYztJQUNsQixHQUFBOztBQUFPO0FBQUE7TUFBQSxLQUFBLHFDQUFBOztxQkFBQSxDQUFBLENBQUEsQ0FBRyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBUCxDQUFBLENBQUEsQ0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBakIsQ0FBQSxDQUFBLENBQTBCLENBQUEsR0FBSSxDQUFQLEdBQWMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQWxCLEdBQTJCLEVBQWxELENBQUE7TUFBQSxDQUFBOzs7SUFDUCxHQUFHLENBQUMsSUFBSixDQUFTLEdBQUEsR0FBTSxHQUFHLENBQUMsSUFBSixDQUFTLEdBQVQsQ0FBTixHQUFzQixHQUEvQjtXQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVDtFQVBPOztBQWpFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyXHJcblx0Y29uc3RydWN0b3IgOiAoQGlkLCBAbmFtZT1cIlwiLCBAZWxvPVwiMTQwMFwiLCBAb3BwPVtdLCBAY29sPVwiXCIsIEByZXM9XCJcIikgLT4gQGFjdGl2ZSA9IHRydWVcclxuXHJcblx0dG9TdHJpbmcgOiAtPiBcIiN7QGlkfSAje0BuYW1lfSBlbG86I3tAZWxvfSAje0Bjb2x9IHJlczoje0ByZXN9IG9wcDpbI3tAb3BwfV0gc2NvcmU6I3tAc2NvcmUoKS50b0ZpeGVkKDEpfSBwZXJmOiN7QHBlcmZvcm1hbmNlKGcudG91cm5hbWVudC5yb3VuZCkudG9GaXhlZCgwKX1cIlxyXG5cclxuXHR0b2dnbGUgOiAtPiBcclxuXHRcdEBhY3RpdmUgPSBub3QgQGFjdGl2ZVxyXG5cdFx0Zy50b3VybmFtZW50LnBhdXNlZCA9IChwLmlkIGZvciBwIGluIGcudG91cm5hbWVudC5wZXJzb25zIHdoZW4gbm90IHAuYWN0aXZlKVxyXG5cclxuXHRzY29yaW5nUHJvYmFiaWxpdHkgOiAoZGlmZikgLT4gMSAvICgxICsgcG93IDEwLCBkaWZmLzQwMClcclxuXHJcblx0Y2FsY1JvdW5kIDogKHIpIC0+ICMgSHVyIGhhbnRlcmEgZnJpcm9uZD9cclxuXHRcdGlmIEBvcHBbcl0gPT0gLTEgdGhlbiByZXR1cm4gMFxyXG5cdFx0YiA9IEBlbG9cclxuXHRcdGMgPSBnLnRvdXJuYW1lbnQucGVyc29uc1tAb3BwW3JdXS5lbG9cclxuXHRcdGRpZmYgPSBiIC0gY1xyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gICAgICAgZy5LICogQHNjb3JpbmdQcm9iYWJpbGl0eSBkaWZmXHJcblx0XHRpZiBAcmVzW3JdID09ICcxJyB0aGVuIHJldHVybiAwLjUgKiBnLksgKiBAc2NvcmluZ1Byb2JhYmlsaXR5IGRpZmZcclxuXHRcdGlmIEByZXNbcl0gPT0gJzAnIHRoZW4gcmV0dXJuICAgICAgLWcuSyAqIEBzY29yaW5nUHJvYmFiaWxpdHkgLWRpZmZcclxuXHRcdDBcclxuXHJcblx0cGVyZm9ybWFuY2UgOiAocm91bmRzKSAtPiBcclxuXHRcdGFzdW0gPSAwXHJcblx0XHRmb3IgciBpbiByYW5nZSByb3VuZHNcclxuXHRcdFx0YXN1bSArPSBAY2FsY1JvdW5kIHJcclxuXHRcdEBlbG8gKyBhc3VtXHJcblxyXG5cdGF2Z0Vsb0RpZmYgOiAtPlxyXG5cdFx0cmVzID0gW11cclxuXHRcdGZvciBpZCBpbiBAb3BwLnNsaWNlIDAsIEBvcHAubGVuZ3RoIC0gMVxyXG5cdFx0XHRpZiBpZCAhPSAtMSB0aGVuIHJlcy5wdXNoIGFicyBAZWxvIC0gZy50b3VybmFtZW50LnBlcnNvbnNbaWRdLmVsb1xyXG5cdFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIGcuc3VtKHJlcykgLyByZXMubGVuZ3RoXHJcblxyXG5cdGJhbGFucyA6IC0+ICMgZsOkcmdiYWxhbnNcclxuXHRcdHJlc3VsdCA9IDBcclxuXHRcdGZvciBjaCBpbiBAY29sXHJcblx0XHRcdGlmIGNoPT0nYicgdGhlbiByZXN1bHQgLT0gMVxyXG5cdFx0XHRpZiBjaD09J3cnIHRoZW4gcmVzdWx0ICs9IDFcclxuXHRcdHJlc3VsdFxyXG5cclxuXHQjIHNjb3JlIDogLT5cclxuXHQjIFx0cmVzdWx0ID0gMFxyXG5cdCMgXHRuID0gZy50b3VybmFtZW50LnJvdW5kXHJcblx0IyBcdGZvciBpIGluIHJhbmdlIG5cclxuXHQjIFx0XHRpZiBpIDwgQGNvbC5sZW5ndGggYW5kIGkgPCBAcmVzLmxlbmd0aFxyXG5cdCMgXHRcdFx0a2V5ID0gQGNvbFtpXSArIEByZXNbaV1cclxuXHQjIFx0XHRcdHJlcyA9IHsndzInOiAxLCAnYjInOiAxLCAndzEnOiAwLjUsICdiMSc6IDAuNSwgJ3cwJzogMCwgJ2IwJzogMH1ba2V5XVxyXG5cdCMgXHQjcHJpbnQgJ2lkLHNjb3JlJyxAaWQsIEByZXMsIHJlc3VsdCxuXHJcblx0IyBcdHJlc3VsdFxyXG5cclxuXHRyZWFkIDogKHBsYXllcikgLT4gXHJcblx0XHRAZWxvID0gcGFyc2VJbnQgcGxheWVyWzBdXHJcblx0XHRAbmFtZSA9IHBsYXllclsxXVxyXG5cdFx0QG9wcCA9IFtdXHJcblx0XHRAY29sID0gXCJcIlxyXG5cdFx0QHJlcyA9IFwiXCJcclxuXHRcdGlmIHBsYXllci5sZW5ndGggPCAzIHRoZW4gcmV0dXJuXHJcblx0XHRvY3JzID0gcGxheWVyWzJdXHJcblx0XHRmb3Igb2NyIGluIG9jcnNcclxuXHRcdFx0aWYgJ3cnIGluIG9jciB0aGVuIGNvbD0ndycgZWxzZSBjb2w9J2InXHJcblx0XHRcdGFyciA9IG9jci5zcGxpdCBjb2xcclxuXHRcdFx0QG9wcC5wdXNoIHBhcnNlSW50IGFyclswXVxyXG5cdFx0XHRAY29sICs9IGNvbFxyXG5cdFx0XHRpZiBhcnIubGVuZ3RoID09IDIgYW5kIGFyclsxXS5sZW5ndGggPT0gMSB0aGVuIEByZXMgKz0gYXJyWzFdXHJcblxyXG5cdHdyaXRlIDogLT4gIyAoMTIzNCFDaHJpc3RlciEoMTJ3MCEyM2IxITE0MikpIEVsbzoxMjM0IE5hbWU6Q2hyaXN0ZXIgb3Bwb25lbnQ6MjMgY29sb3I6YiByZXN1bHQ6MVxyXG5cdFx0cmVzID0gW11cclxuXHRcdHJlcy5wdXNoIEBlbG9cclxuXHRcdHJlcy5wdXNoIEBuYW1lLnJlcGxhY2VBbGwgJyAnLCdfJ1xyXG5cdFx0ciA9IEBvcHAubGVuZ3RoIC0gMVxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlKHIpKSBcclxuXHRcdHJlcy5wdXNoICcoJyArIG9jci5qb2luKCchJykgKyAnKSdcclxuXHRcdHJlcy5qb2luICchJyJdfQ==
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee