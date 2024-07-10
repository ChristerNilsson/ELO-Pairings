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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFXLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFBckU7O0VBRWQsUUFBVyxDQUFBLENBQUE7V0FBRyxDQUFBLENBQUEsQ0FBRyxJQUFDLENBQUEsRUFBSixFQUFBLENBQUEsQ0FBVSxJQUFDLENBQUEsSUFBWCxDQUFBLEtBQUEsQ0FBQSxDQUF1QixJQUFDLENBQUEsR0FBeEIsRUFBQSxDQUFBLENBQStCLElBQUMsQ0FBQSxHQUFoQyxDQUFBLEtBQUEsQ0FBQSxDQUEyQyxJQUFDLENBQUEsR0FBNUMsQ0FBQSxNQUFBLENBQUEsQ0FBd0QsSUFBQyxDQUFBLEdBQXpELENBQUEsUUFBQSxDQUFBLENBQXVFLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBUSxDQUFDLE9BQVQsQ0FBaUIsQ0FBakIsQ0FBdkUsQ0FBQSxNQUFBLENBQUEsQ0FBbUcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQTFCLENBQWdDLENBQUMsT0FBakMsQ0FBeUMsQ0FBekMsQ0FBbkcsQ0FBQTtFQUFIOztFQUVYLE1BQVMsQ0FBQSxDQUFBO0FBQ1YsUUFBQTtJQUFFLElBQUMsQ0FBQSxNQUFELEdBQVUs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QUE7O3FCQUFBLENBQUEsQ0FBQSxDQUFHLElBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBRCxDQUFQLENBQUEsQ0FBQSxDQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBRCxDQUFqQixDQUFBLENBQUEsQ0FBMEIsQ0FBQSxHQUFJLENBQVAsR0FBYyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBbEIsR0FBMkIsRUFBbEQsQ0FBQTtNQUFBLENBQUE7OztJQUNQLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBQSxHQUFNLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxDQUFOLEdBQXNCLEdBQS9CO1dBQ0EsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFUO0VBUE87O0FBdkRGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyxwcmludCxyYW5nZSxzY2FsZXgsc2NhbGV5IH0gZnJvbSAnLi9nbG9iYWxzLmpzJyBcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJcclxuXHRjb25zdHJ1Y3RvciA6IChAaWQsIEBuYW1lPVwiXCIsIEBlbG89XCIxNDAwXCIsIEBvcHA9W10sIEBjb2w9XCJcIiwgQHJlcz1cIlwiKSAtPiBAYWN0aXZlID0gdHJ1ZVxyXG5cclxuXHR0b1N0cmluZyA6IC0+IFwiI3tAaWR9ICN7QG5hbWV9IGVsbzoje0BlbG99ICN7QGNvbH0gcmVzOiN7QHJlc30gb3BwOlsje0BvcHB9XSBzY29yZToje0BzY29yZSgpLnRvRml4ZWQoMSl9IHBlcmY6I3tAcGVyZm9ybWFuY2UoZy50b3VybmFtZW50LnJvdW5kKS50b0ZpeGVkKDApfVwiXHJcblxyXG5cdHRvZ2dsZSA6IC0+IFxyXG5cdFx0QGFjdGl2ZSA9IG5vdCBAYWN0aXZlXHJcblx0XHRnLnRvdXJuYW1lbnQucGF1c2VkID0gKHAuaWQgZm9yIHAgaW4gZy50b3VybmFtZW50LnBlcnNvbnMgd2hlbiBub3QgcC5hY3RpdmUpXHJcblxyXG5cdHNjb3JpbmdQcm9iYWJpbGl0eSA6IChkaWZmKSAtPiAxIC8gKDEgKyBwb3cgMTAsIGRpZmYvNDAwKVxyXG5cclxuXHRjYWxjUm91bmQgOiAocikgLT4gIyBIdXIgaGFudGVyYSBmcmlyb25kP1xyXG5cdFx0aWYgQG9wcFtyXSA9PSAtMSB0aGVuIHJldHVybiAwXHJcblx0XHRiID0gQGVsb1xyXG5cdFx0YyA9IGcudG91cm5hbWVudC5wZXJzb25zW0BvcHBbcl1dLmVsb1xyXG5cdFx0ZGlmZiA9IGIgLSBjXHJcblx0XHRpZiBAcmVzW3JdID09ICcyJyB0aGVuIHJldHVybiAgICAgICBnLksgKiBAc2NvcmluZ1Byb2JhYmlsaXR5IGRpZmZcclxuXHRcdGlmIEByZXNbcl0gPT0gJzEnIHRoZW4gcmV0dXJuIDAuNSAqIGcuSyAqIEBzY29yaW5nUHJvYmFiaWxpdHkgZGlmZlxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMCcgdGhlbiByZXR1cm4gICAgICAtZy5LICogQHNjb3JpbmdQcm9iYWJpbGl0eSAtZGlmZlxyXG5cdFx0MFxyXG5cclxuXHRwZXJmb3JtYW5jZSA6IChyb3VuZHMpIC0+IFxyXG5cdFx0YXN1bSA9IDBcclxuXHRcdGZvciByIGluIHJhbmdlIHJvdW5kc1xyXG5cdFx0XHRhc3VtICs9IEBjYWxjUm91bmQgclxyXG5cdFx0QGVsbyArIGFzdW1cclxuXHJcblx0YXZnRWxvRGlmZiA6IC0+XHJcblx0XHRyZXMgPSBbXVxyXG5cdFx0Zm9yIGlkIGluIEBvcHAuc2xpY2UgMCwgQG9wcC5sZW5ndGggLSAxXHJcblx0XHRcdGlmIGlkICE9IC0xIHRoZW4gcmVzLnB1c2ggYWJzIEBlbG8gLSBnLnRvdXJuYW1lbnQucGVyc29uc1tpZF0uZWxvXHJcblx0XHRpZiByZXMubGVuZ3RoID09IDAgdGhlbiAwIGVsc2UgZy5zdW0ocmVzKSAvIHJlcy5sZW5ndGhcclxuXHJcblx0YmFsYW5zIDogLT4gIyBmw6RyZ2JhbGFuc1xyXG5cdFx0cmVzdWx0ID0gMFxyXG5cdFx0Zm9yIGNoIGluIEBjb2xcclxuXHRcdFx0aWYgY2g9PSdiJyB0aGVuIHJlc3VsdCAtPSAxXHJcblx0XHRcdGlmIGNoPT0ndycgdGhlbiByZXN1bHQgKz0gMVxyXG5cdFx0cmVzdWx0XHJcblxyXG5cdHJlYWQgOiAocGxheWVyKSAtPiBcclxuXHRcdEBlbG8gPSBwYXJzZUludCBwbGF5ZXJbMF1cclxuXHRcdEBuYW1lID0gcGxheWVyWzFdXHJcblx0XHRAb3BwID0gW11cclxuXHRcdEBjb2wgPSBcIlwiXHJcblx0XHRAcmVzID0gXCJcIlxyXG5cdFx0aWYgcGxheWVyLmxlbmd0aCA8IDMgdGhlbiByZXR1cm5cclxuXHRcdG9jcnMgPSBwbGF5ZXJbMl1cclxuXHRcdGZvciBvY3IgaW4gb2Nyc1xyXG5cdFx0XHRpZiAndycgaW4gb2NyIHRoZW4gY29sPSd3JyBlbHNlIGNvbD0nYidcclxuXHRcdFx0YXJyID0gb2NyLnNwbGl0IGNvbFxyXG5cdFx0XHRAb3BwLnB1c2ggcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdEBjb2wgKz0gY29sXHJcblx0XHRcdGlmIGFyci5sZW5ndGggPT0gMiBhbmQgYXJyWzFdLmxlbmd0aCA9PSAxIHRoZW4gQHJlcyArPSBhcnJbMV1cclxuXHJcblx0d3JpdGUgOiAtPiAjICgxMjM0IUNocmlzdGVyISgxMncwITIzYjEhMTQyKSkgRWxvOjEyMzQgTmFtZTpDaHJpc3RlciBvcHBvbmVudDoyMyBjb2xvcjpiIHJlc3VsdDoxXHJcblx0XHRyZXMgPSBbXVxyXG5cdFx0cmVzLnB1c2ggQGVsb1xyXG5cdFx0cmVzLnB1c2ggQG5hbWUucmVwbGFjZUFsbCAnICcsJ18nXHJcblx0XHRyID0gQG9wcC5sZW5ndGggLSAxXHJcblx0XHRvY3IgPSAoXCIje0BvcHBbaV19I3tAY29sW2ldfSN7aWYgaSA8IHIgdGhlbiBAcmVzW2ldIGVsc2UgJyd9XCIgZm9yIGkgaW4gcmFuZ2UocikpIFxyXG5cdFx0cmVzLnB1c2ggJygnICsgb2NyLmpvaW4oJyEnKSArICcpJ1xyXG5cdFx0cmVzLmpvaW4gJyEnIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee