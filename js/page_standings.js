// Generated by CoffeeScript 2.7.0
var boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import {
  g,
  print,
  range,
  scalex,
  scaley
} from './globals.js';

import {
  Page
} from './page.js';

import {
  Button,
  spread
} from './button.js';

import {
  Lista
} from './lista.js';

export var Standings = class Standings extends Page {
  constructor() {
    super();
    this.mouseMoved = this.mouseMoved.bind(this);
    this.t = g.tournament;
    this.buttons.ArrowLeft = new Button('', '', () => {
      return g.setState(g.ACTIVE);
    });
    this.buttons.ArrowRight = new Button('', '', () => {
      return g.setState(g.TABLES);
    });
    this.buttons.s.active = false;
  }

  setLista() {
    var header, p, rheader;
    rheader = _.map(range(1, this.t.round + 1), function(i) {
      return ` ${i % 10} `;
    });
    rheader = rheader.join('');
    header = "";
    header += g.txtT("Pos", 3, window.RIGHT);
    header += ' ' + g.txtT("Id", 3, window.RIGHT);
    header += ' ' + g.txtT("Elo", 4, window.RIGHT);
    header += ' ' + g.txtT("Name", 25, window.LEFT);
    header += '' + g.txtT(rheader, 3 * this.round, window.LEFT);
    header += ' ' + g.txtT("Change", 8, window.RIGHT);
    this.playersByPerformance = _.clone(this.t.persons.slice(0, g.N));
    this.playersByPerformance = _.sortBy(this.playersByPerformance, (p) => {
      return -(p.change(this.t.round));
    });
    print(((function() {
      var j, len, ref, results;
      ref = this.playersByPerformance;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        p = ref[j];
        results.push(p.change(this.t.round).toFixed(1));
      }
      return results;
    }).call(this)).join(' '));
    this.lista = new Lista(this.playersByPerformance, header, this.buttons, (p, index, pos) => { // returnera strängen som ska skrivas ut. Dessutom ritas lightbulbs här.
      var j, len, r, ref, s, x;
      this.y_bulb = (5 + index) * g.ZOOM[g.state];
      textAlign(LEFT);
      fill('black');
      s = "";
      s += g.txtT((1 + pos).toString(), 3, window.RIGHT);
      s += ' ' + g.txtT((1 + p.id).toString(), 3, window.RIGHT);
      s += ' ' + g.txtT(p.elo0.toString(), 4, window.RIGHT);
      s += ' ' + g.txtT(p.name, 25, window.LEFT);
      s += ' ' + g.txtT('', 3 * (this.t.round - 1), window.CENTER);
      s += ' ' + g.txtT((p.change(this.t.round)).toFixed(5), 8, window.RIGHT);
      ref = range(g.tournament.round - 1);
      //- 1
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        x = g.ZOOM[g.state] * (24.2 + 1.8 * r);
        // if p.opp[r] == -1 then @txt "P", x, @y+1, window.CENTER, 'black'
        // else if p.opp[r] == g.N then @txt "BYE", x, @y+1, window.CENTER, 'black'
        // print 'yyy',"<#{p.opp[r]}>"
        this.lightbulb(p.id, p.col[r], x, this.y_bulb, p.res.slice(r, r + 1), p.opp[r]);
      }
      return s;
    });
    this.lista.paintYellowRow = false;
    return spread(this.buttons, 10, this.y, this.h);
  }

  mouseMoved() {
    var PD, a, b, chg, diff, iy, pa, pb, r, s;
    boundMethodCheck(this, Standings);
    r = round((mouseX / g.ZOOM[g.state] - 24.2) / 1.8);
    iy = this.lista.offset + round(mouseY / g.ZOOM[g.state] - 5);
    if ((0 <= iy && iy < this.playersByPerformance.length) && (0 <= r && r < g.tournament.round - 1)) {
      a = iy;
      pa = this.playersByPerformance[a];
      b = pa.opp[r];
      if (b === g.BYE) {
        g.help = `${pa.elo0} ${pa.name} has a bye => chg = ${g.K / 2}`;
      }
      if (b === g.PAUSE) {
        g.help = `${pa.elo0} ${pa.name} has a pause => chg = 0`;
      }
      if (b >= 0) {
        pb = this.t.persons[b];
        diff = pa.elo0 - pb.elo0;
        PD = g.K * g.scoringProbability(diff);
        chg = pa.calcRound(r);
        s = "";
        s += g.txtT('', 3, window.RIGHT);
        s += ' ' + g.txtT((1 + pb.id).toString(), 3, window.RIGHT);
        s += ' ' + g.txtT(pb.elo0.toString(), 4, window.RIGHT);
        s += ' ' + g.txtT(pb.name, 25, window.LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), window.LEFT);
        s += ' ' + g.txtT(chg.toFixed(3), 7, window.RIGHT);
        s += ' ' + g.txtT(diff, 6, window.RIGHT);
        return g.help = s;
      }
    } else {
      return g.help = "";
    }
  }

  mouseWheel(event) {
    return this.lista.mouseWheel(event);
  }

  mousePressed(event) {
    return this.lista.mousePressed(event);
  }

  keyPressed(event) {
    return this.buttons[key].click();
  }

  draw() {
    var button, key, ref;
    fill('white');
    this.showHeader(this.t.round - 1);
    this.lista.draw();
    ref = this.buttons;
    for (key in ref) {
      button = ref[key];
      button.draw();
    }
    textAlign(LEFT);
    return text(g.help, 10, 3 * g.ZOOM[g.state]);
  }

  show(s, x, y, bg, fg) {
    fill(bg);
    rect(x, y, 1.6 * g.ZOOM[g.state], 0.9 * g.ZOOM[g.state]);
    fill(fg);
    return this.txt(s, x, y + 1, window.CENTER);
  }

  lightbulb(id, color, x, y, result, opponent) {
    var s;
    // print "lightbulb id:#{id} color:#{color} x:#{x} y#{y} result:#{result} opponent:#{opponent}"
    push();
    rectMode(window.CENTER);
    s = 1 + opponent;
    if (opponent === g.PAUSE) {
      this.show(" P ", x, y, "gray", 'yellow');
    }
    if (opponent === g.BYE) {
      this.show("BYE", x, y, "green", 'yellow');
    }
    if (opponent >= 0) {
      result = '012'.indexOf(result);
      this.show(1 + opponent, x, y, 'red gray green'.split(' ')[result], {
        b: 'black',
        ' ': 'yellow',
        w: 'white'
      }[color]);
    }
    return pop();
  }

  make(res, header) {
    var i, j, k, l, len, len1, len2, person, r, ref, ref1, ref2, s;
    if (this.t.pairs.length === 0) {
      res.push("This ROUND can't be paired! (Too many rounds)");
    }
    res.push("STANDINGS" + header);
    res.push("");
    header = "";
    header += g.txtT("Pos", 3, window.RIGHT);
    header += ' ' + g.txtT('Id', 3, window.RIGHT);
    header += ' ' + g.txtT("Elo0", 4, window.RIGHT);
    header += ' ' + g.txtT("Name", 25, window.LEFT);
    ref = range(this.t.round);
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      header += g.txtT(`${r + 1}`, 6, window.RIGHT);
    }
    header += ' ' + g.txtT("Chg", 7, window.RIGHT);
    header += ' ' + g.txtT("Elo", 7, window.RIGHT);
    if (this.t.round <= this.expl) {
      header += '  ' + g.txtT("Explanation", 12, window.LEFT);
    }
    ref1 = this.playersByPerformance;
    for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
      person = ref1[i];
      // elo = person.elo # @t.round
      if (i % this.t.ppp === 0) {
        res.push(header);
      }
      s = "";
      s += g.txtT((1 + i).toString(), 3, window.RIGHT);
      s += ' ' + g.txtT((1 + person.id).toString(), 3, window.RIGHT);
      s += ' ' + g.txtT(person.elo0.toString(), 4, window.RIGHT);
      s += ' ' + g.txtT(person.name, 25, window.LEFT);
      s += ' ';
      ref2 = range(this.t.round);
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        r = ref2[l];
        if (person.opp[r] === -2) {
          s += '    P ';
        }
        if (person.opp[r] === -1) {
          s += '   BYE';
        }
        if (person.opp[r] >= 0) {
          s += g.txtT(`${1 + person.opp[r]}${g.RINGS[person.col[r][0]]}${"0½1"[person.res[r]]}`, 6, window.RIGHT);
        }
      }
      s += ' ' + g.txtT((person.change(this.t.round)).toFixed(1), 6, window.RIGHT);
      // s += ' ' + g.txtT elo.toFixed(2),  7, window.RIGHT
      // s += ' ' + g.txtT person.elo(@t.round).toFixed(1),  8, window.RIGHT
      res.push(s);
      if (i % this.t.ppp === this.t.ppp - 1) {
        res.push("\f");
      }
    }
    return res.push("\f");
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9zdGFuZGluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3N0YW5kaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLENBQVQ7RUFBVyxLQUFYO0VBQWlCLEtBQWpCO0VBQXVCLE1BQXZCO0VBQThCLE1BQTlCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsSUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFFQSxPQUFBLElBQWEsWUFBTixNQUFBLFVBQUEsUUFBd0IsS0FBeEI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUE4Q2QsQ0FBQSxpQkFBQSxDQUFBO0lBNUNDLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO0VBTFA7O0VBT2QsUUFBVyxDQUFBLENBQUE7QUFFWixRQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUE7SUFBRSxPQUFBLEdBQVUsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxLQUFBLENBQU0sQ0FBTixFQUFRLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FB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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBnLHByaW50LHJhbmdlLHNjYWxleCxzY2FsZXkgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnLi9wYWdlLmpzJyBcclxuaW1wb3J0IHsgQnV0dG9uLHNwcmVhZCB9IGZyb20gJy4vYnV0dG9uLmpzJyAgXHJcbmltcG9ydCB7IExpc3RhIH0gZnJvbSAnLi9saXN0YS5qcycgXHJcblxyXG5leHBvcnQgY2xhc3MgU3RhbmRpbmdzIGV4dGVuZHMgUGFnZVxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IC0+XHJcblx0XHRzdXBlcigpXHJcblx0XHRAdCA9IGcudG91cm5hbWVudFxyXG5cdFx0QGJ1dHRvbnMuQXJyb3dMZWZ0ICA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuQUNUSVZFXHJcblx0XHRAYnV0dG9ucy5BcnJvd1JpZ2h0ID0gbmV3IEJ1dHRvbiAnJywgJycsICgpID0+IGcuc2V0U3RhdGUgZy5UQUJMRVNcclxuXHRcdEBidXR0b25zLnMuYWN0aXZlID0gZmFsc2VcclxuXHJcblx0c2V0TGlzdGEgOiAtPlxyXG5cclxuXHRcdHJoZWFkZXIgPSBfLm1hcCByYW5nZSgxLEB0LnJvdW5kKzEpLCAoaSkgLT4gXCIgI3tpJTEwfSBcIlxyXG5cdFx0cmhlYWRlciA9IHJoZWFkZXIuam9pbiAnJ1xyXG5cdFx0aGVhZGVyID0gXCJcIlxyXG5cdFx0aGVhZGVyICs9ICAgICAgIGcudHh0VCBcIlBvc1wiLCAgICAgICAgICAzLHdpbmRvdy5SSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIklkXCIsICAgICAgICAgICAzLHdpbmRvdy5SSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIkVsb1wiLCAgICAgICAgICA0LHdpbmRvdy5SSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIk5hbWVcIiwgICAgICAgIDI1LHdpbmRvdy5MRUZUXHJcblx0XHRoZWFkZXIgKz0gJycgKyBnLnR4dFQgcmhlYWRlciwgMypAcm91bmQsd2luZG93LkxFRlQgXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiQ2hhbmdlXCIsICAgICAgIDgsd2luZG93LlJJR0hUXHJcblxyXG5cdFx0QHBsYXllcnNCeVBlcmZvcm1hbmNlID0gXy5jbG9uZSBAdC5wZXJzb25zLnNsaWNlIDAsZy5OXHJcblx0XHRAcGxheWVyc0J5UGVyZm9ybWFuY2UgPSBfLnNvcnRCeSBAcGxheWVyc0J5UGVyZm9ybWFuY2UsIChwKSA9PiAtKHAuY2hhbmdlKEB0LnJvdW5kKSlcclxuXHJcblx0XHRwcmludCAocC5jaGFuZ2UoQHQucm91bmQpLnRvRml4ZWQoMSkgZm9yIHAgaW4gQHBsYXllcnNCeVBlcmZvcm1hbmNlKS5qb2luICcgJ1xyXG5cclxuXHRcdEBsaXN0YSA9IG5ldyBMaXN0YSBAcGxheWVyc0J5UGVyZm9ybWFuY2UsIGhlYWRlciwgQGJ1dHRvbnMsIChwLGluZGV4LHBvcykgPT4gIyByZXR1cm5lcmEgc3Ryw6RuZ2VuIHNvbSBza2Egc2tyaXZhcyB1dC4gRGVzc3V0b20gcml0YXMgbGlnaHRidWxicyBow6RyLlxyXG5cdFx0XHRAeV9idWxiID0gKDUgKyBpbmRleCkgKiBnLlpPT01bZy5zdGF0ZV0gXHJcblx0XHRcdHRleHRBbGlnbiBMRUZUXHJcblx0XHRcdGZpbGwgJ2JsYWNrJyBcclxuXHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0cyArPSAgICAgICBnLnR4dFQgKDErcG9zKS50b1N0cmluZygpLCAgICAgMywgd2luZG93LlJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUICgxK3AuaWQpLnRvU3RyaW5nKCksICAgIDMsIHdpbmRvdy5SSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwLmVsbzAudG9TdHJpbmcoKSwgICAgICA0LCB3aW5kb3cuUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcC5uYW1lLCAgICAgICAgICAgICAgICAyNSwgd2luZG93LkxFRlRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgMyAqIChAdC5yb3VuZC0xKSwgd2luZG93LkNFTlRFUlxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAocC5jaGFuZ2UoQHQucm91bmQpKS50b0ZpeGVkKDUpLCA4LCB3aW5kb3cuUklHSFRcclxuXHJcblx0XHRcdGZvciByIGluIHJhbmdlIGcudG91cm5hbWVudC5yb3VuZCAtIDEgIy0gMVxyXG5cdFx0XHRcdHggPSBnLlpPT01bZy5zdGF0ZV0gKiAoMjQuMiArIDEuOCpyKVxyXG5cdFx0XHRcdCMgaWYgcC5vcHBbcl0gPT0gLTEgdGhlbiBAdHh0IFwiUFwiLCB4LCBAeSsxLCB3aW5kb3cuQ0VOVEVSLCAnYmxhY2snXHJcblx0XHRcdFx0IyBlbHNlIGlmIHAub3BwW3JdID09IGcuTiB0aGVuIEB0eHQgXCJCWUVcIiwgeCwgQHkrMSwgd2luZG93LkNFTlRFUiwgJ2JsYWNrJ1xyXG5cdFx0XHRcdCMgcHJpbnQgJ3l5eScsXCI8I3twLm9wcFtyXX0+XCJcclxuXHRcdFx0XHRAbGlnaHRidWxiIHAuaWQsIHAuY29sW3JdLCB4LCBAeV9idWxiLCBwLnJlcy5zbGljZShyLHIrMSksIHAub3BwW3JdXHJcblx0XHRcdHNcclxuXHRcdEBsaXN0YS5wYWludFllbGxvd1JvdyA9IGZhbHNlXHJcblx0XHRzcHJlYWQgQGJ1dHRvbnMsIDEwLCBAeSwgQGhcclxuXHJcblx0bW91c2VNb3ZlZCA6ID0+XHJcblx0XHRyID0gcm91bmQgKChtb3VzZVggLyBnLlpPT01bZy5zdGF0ZV0gLSAyNC4yKSAvIDEuOClcclxuXHRcdGl5ID0gQGxpc3RhLm9mZnNldCArIHJvdW5kIG1vdXNlWSAvIGcuWk9PTVtnLnN0YXRlXSAtIDVcclxuXHRcdGlmIDAgPD0gaXkgPCBAcGxheWVyc0J5UGVyZm9ybWFuY2UubGVuZ3RoIGFuZCAwIDw9IHIgPCBnLnRvdXJuYW1lbnQucm91bmQgLSAxXHJcblx0XHRcdGEgPSBpeVxyXG5cdFx0XHRwYSA9IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZVthXVxyXG5cdFx0XHRiID0gcGEub3BwW3JdXHJcblx0XHRcdGlmIGIgPT0gZy5CWUUgICB0aGVuIGcuaGVscCA9IFwiI3twYS5lbG8wfSAje3BhLm5hbWV9IGhhcyBhIGJ5ZSA9PiBjaGcgPSAje2cuSy8yfVwiXHJcblx0XHRcdGlmIGIgPT0gZy5QQVVTRSB0aGVuIGcuaGVscCA9IFwiI3twYS5lbG8wfSAje3BhLm5hbWV9IGhhcyBhIHBhdXNlID0+IGNoZyA9IDBcIlxyXG5cdFx0XHRpZiBiID49IDBcdFx0XHRcdFxyXG5cdFx0XHRcdHBiID0gQHQucGVyc29uc1tiXVxyXG5cdFx0XHRcdGRpZmYgPSBwYS5lbG8wIC0gcGIuZWxvMFxyXG5cdFx0XHRcdFBEID0gZy5LICogZy5zY29yaW5nUHJvYmFiaWxpdHkgZGlmZlxyXG5cdFx0XHRcdGNoZyA9IHBhLmNhbGNSb3VuZCByXHJcblxyXG5cdFx0XHRcdHMgPSBcIlwiXHJcblx0XHRcdFx0cyArPSAgICAgICBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDMsIHdpbmRvdy5SSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICgxK3BiLmlkKS50b1N0cmluZygpLCAgICAzLCB3aW5kb3cuUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCBwYi5lbG8wLnRvU3RyaW5nKCksICAgICAgNCwgd2luZG93LlJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGIubmFtZSwgICAgICAgICAgICAgICAgMjUsIHdpbmRvdy5MRUZUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgIDMgKiAoQHQucm91bmQtMSksIHdpbmRvdy5MRUZUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgY2hnLnRvRml4ZWQoMyksICAgICAgICAgIDcsIHdpbmRvdy5SSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIGRpZmYsICAgICAgICAgICAgICAgICAgICA2LCB3aW5kb3cuUklHSFRcclxuXHRcdFx0XHRnLmhlbHAgPSBzXHJcblx0XHRlbHNlXHJcblx0XHRcdGcuaGVscCA9IFwiXCJcclxuXHJcblx0bW91c2VXaGVlbCAgIDogKGV2ZW50ICktPiBAbGlzdGEubW91c2VXaGVlbCBldmVudFxyXG5cdG1vdXNlUHJlc3NlZCA6IChldmVudCkgLT4gQGxpc3RhLm1vdXNlUHJlc3NlZCBldmVudFxyXG5cdGtleVByZXNzZWQgICA6IChldmVudCkgLT4gQGJ1dHRvbnNba2V5XS5jbGljaygpXHJcblxyXG5cdGRyYXcgOiAtPlxyXG5cdFx0ZmlsbCAnd2hpdGUnXHJcblx0XHRAc2hvd0hlYWRlciBAdC5yb3VuZC0xXHJcblx0XHRAbGlzdGEuZHJhdygpXHJcblx0XHRmb3Iga2V5LGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG5cdFx0XHRidXR0b24uZHJhdygpXHJcblx0XHR0ZXh0QWxpZ24gTEVGVFxyXG5cdFx0dGV4dCBnLmhlbHAsIDEwLCAzKmcuWk9PTVtnLnN0YXRlXVxyXG5cclxuXHRzaG93IDogKHMseCx5LGJnLGZnKSAtPlxyXG5cdFx0ZmlsbCBiZ1xyXG5cdFx0cmVjdCB4LCB5LCAxLjYgKiBnLlpPT01bZy5zdGF0ZV0sIDAuOSAqIGcuWk9PTVtnLnN0YXRlXVxyXG5cdFx0ZmlsbCBmZ1xyXG5cdFx0QHR4dCBzLCB4LCB5KzEsIHdpbmRvdy5DRU5URVJcclxuXHJcblx0bGlnaHRidWxiIDogKGlkLCBjb2xvciwgeCwgeSwgcmVzdWx0LCBvcHBvbmVudCkgLT5cclxuXHRcdCMgcHJpbnQgXCJsaWdodGJ1bGIgaWQ6I3tpZH0gY29sb3I6I3tjb2xvcn0geDoje3h9IHkje3l9IHJlc3VsdDoje3Jlc3VsdH0gb3Bwb25lbnQ6I3tvcHBvbmVudH1cIlxyXG5cdFx0cHVzaCgpXHJcblx0XHRyZWN0TW9kZSB3aW5kb3cuQ0VOVEVSXHJcblx0XHRzID0gMSArIG9wcG9uZW50XHJcblx0XHRpZiBvcHBvbmVudCA9PSBnLlBBVVNFIHRoZW4gQHNob3cgXCIgUCBcIix4LHksXCJncmF5XCIsJ3llbGxvdydcclxuXHRcdGlmIG9wcG9uZW50ID09IGcuQllFICAgdGhlbiBAc2hvdyBcIkJZRVwiLHgseSxcImdyZWVuXCIsJ3llbGxvdydcclxuXHRcdGlmIG9wcG9uZW50ID49IDBcclxuXHRcdFx0cmVzdWx0ID0gJzAxMicuaW5kZXhPZiByZXN1bHRcclxuXHRcdFx0QHNob3cgMStvcHBvbmVudCwgeCwgeSwgJ3JlZCBncmF5IGdyZWVuJy5zcGxpdCgnICcpW3Jlc3VsdF0sIHtiOidibGFjaycsICcgJzoneWVsbG93Jywgdzond2hpdGUnfVtjb2xvcl1cclxuXHRcdHBvcCgpXHJcblxyXG5cdG1ha2UgOiAocmVzLGhlYWRlcikgLT5cclxuXHRcdGlmIEB0LnBhaXJzLmxlbmd0aCA9PSAwIHRoZW4gcmVzLnB1c2ggXCJUaGlzIFJPVU5EIGNhbid0IGJlIHBhaXJlZCEgKFRvbyBtYW55IHJvdW5kcylcIlxyXG5cclxuXHRcdHJlcy5wdXNoIFwiU1RBTkRJTkdTXCIgKyBoZWFkZXJcclxuXHRcdHJlcy5wdXNoIFwiXCJcclxuXHJcblx0XHRoZWFkZXIgPSBcIlwiXHJcblx0XHRoZWFkZXIgKz0gICAgICAgZy50eHRUIFwiUG9zXCIsICAgMywgd2luZG93LlJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUICdJZCcsICAgIDMsIHdpbmRvdy5SSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIkVsbzBcIiwgIDQsIHdpbmRvdy5SSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIk5hbWVcIiwgMjUsIHdpbmRvdy5MRUZUXHJcblx0XHRmb3IgciBpbiByYW5nZSBAdC5yb3VuZFxyXG5cdFx0XHRoZWFkZXIgKz0gZy50eHRUIFwiI3tyKzF9XCIsICA2LHdpbmRvdy5SSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIkNoZ1wiLCAgIDcsd2luZG93LlJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiRWxvXCIsICAgNyx3aW5kb3cuUklHSFRcclxuXHRcdGlmIEB0LnJvdW5kIDw9IEBleHBsIHRoZW4gaGVhZGVyICs9ICcgICcgKyBnLnR4dFQgXCJFeHBsYW5hdGlvblwiLCAxMix3aW5kb3cuTEVGVFxyXG5cdFx0XHJcblx0XHRmb3IgcGVyc29uLGkgaW4gQHBsYXllcnNCeVBlcmZvcm1hbmNlXHJcblx0XHRcdCMgZWxvID0gcGVyc29uLmVsbyAjIEB0LnJvdW5kXHJcblx0XHRcdGlmIGkgJSBAdC5wcHAgPT0gMCB0aGVuIHJlcy5wdXNoIGhlYWRlclxyXG5cdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRzICs9ICAgICAgIGcudHh0VCAoMStpKS50b1N0cmluZygpLCAgICAgICAgICAzLCB3aW5kb3cuUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgKDErcGVyc29uLmlkKS50b1N0cmluZygpLCAgMywgd2luZG93LlJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBlcnNvbi5lbG8wLnRvU3RyaW5nKCksICAgIDQsIHdpbmRvdy5SSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwZXJzb24ubmFtZSwgICAgICAgICAgICAgIDI1LCB3aW5kb3cuTEVGVFxyXG5cdFx0XHRzICs9ICcgJ1xyXG5cdFx0XHRmb3IgciBpbiByYW5nZSBAdC5yb3VuZFxyXG5cdFx0XHRcdGlmIHBlcnNvbi5vcHBbcl0gPT0gLTIgdGhlbiBzICs9ICcgICAgUCAnXHJcblx0XHRcdFx0aWYgcGVyc29uLm9wcFtyXSA9PSAtMSB0aGVuIHMgKz0gJyAgIEJZRSdcclxuXHRcdFx0XHRpZiBwZXJzb24ub3BwW3JdID49IDBcclxuXHRcdFx0XHRcdHMgKz0gZy50eHRUIFwiI3sxK3BlcnNvbi5vcHBbcl19I3tnLlJJTkdTW3BlcnNvbi5jb2xbcl1bMF1dfSN7XCIwwr0xXCJbcGVyc29uLnJlc1tyXV19XCIsIDYsIHdpbmRvdy5SSUdIVFx0XHRcdFxyXG5cclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgKHBlcnNvbi5jaGFuZ2UoQHQucm91bmQpKS50b0ZpeGVkKDEpLCAgNiwgd2luZG93LlJJR0hUXHJcblx0XHRcdCMgcyArPSAnICcgKyBnLnR4dFQgZWxvLnRvRml4ZWQoMiksICA3LCB3aW5kb3cuUklHSFRcclxuXHRcdFx0IyBzICs9ICcgJyArIGcudHh0VCBwZXJzb24uZWxvKEB0LnJvdW5kKS50b0ZpeGVkKDEpLCAgOCwgd2luZG93LlJJR0hUXHJcblx0XHRcdHJlcy5wdXNoIHMgXHJcblx0XHRcdGlmIGkgJSBAdC5wcHAgPT0gQHQucHBwLTEgdGhlbiByZXMucHVzaCBcIlxcZlwiXHJcblx0XHRyZXMucHVzaCBcIlxcZlwiIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\page_standings.coffee