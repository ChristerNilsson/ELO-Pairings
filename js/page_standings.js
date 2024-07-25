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
    var header, rheader;
    rheader = _.map(range(1, this.t.round + 1), function(i) {
      return ` ${i % 10} `;
    });
    rheader = rheader.join('');
    header = "";
    header += g.txtT("Pos", 3, RIGHT);
    header += ' ' + g.txtT("Id", 3, RIGHT);
    header += ' ' + g.txtT("Elo", 4, RIGHT);
    header += ' ' + g.txtT("Name", 25, LEFT);
    header += '' + g.txtT(rheader, 3 * this.round, LEFT);
    header += ' ' + g.txtT("Quality", 8, RIGHT);
    header += ' ' + g.txtT("Score", 5, RIGHT);
    this.playersByPerformance = _.clone(this.t.persons.slice(0, g.N));
    this.playersByPerformance = _.sortBy(this.playersByPerformance, (p) => {
      return -(p.change(this.t.round + 1));
    });
    this.lista = new Lista(this.playersByPerformance, header, this.buttons, (p, index, pos) => { // returnera strängen som ska skrivas ut. Dessutom ritas lightbulbs här.
      var j, len, r, ref, s, x;
      this.y_bulb = (5 + index) * g.ZOOM[g.state];
      textAlign(LEFT);
      fill('black');
      s = "";
      s += g.txtT((1 + pos).toString(), 3, RIGHT);
      s += ' ' + g.txtT((1 + p.id).toString(), 3, RIGHT);
      s += ' ' + g.txtT(p.elo.toString(), 4, RIGHT);
      s += ' ' + g.txtT(p.name, 25, LEFT);
      s += ' ' + g.txtT('', 3 * (this.t.round - 1), CENTER);
      if (g.FACTOR === 0) {
        s += ' ' + g.txtT(p.change(this.t.round).toFixed(3), 7, RIGHT);
      }
      if (g.FACTOR !== 0) {
        s += ' ' + g.txtT(p.change(this.t.round).toFixed(1), 7, RIGHT);
      }
      s += ' ' + g.txtT(p.score().toString(), 5, RIGHT);
      ref = range(g.tournament.round - 1);
      //- 1
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        x = g.ZOOM[g.state] * (24.2 + 1.8 * r);
        this.lightbulb(p.id, p.col[r], x, this.y_bulb, p.res.slice(r, r + 1), p.opp[r]);
      }
      return s;
    });
    this.lista.paintYellowRow = false;
    return spread(this.buttons, 10, this.y, this.h);
  }

  mouseMoved() {
    var a, b, chg, diff, iy, pa, pb, r, s;
    boundMethodCheck(this, Standings);
    r = round((mouseX / g.ZOOM[g.state] - 24.2) / 1.8);
    iy = this.lista.offset + round(mouseY / g.ZOOM[g.state] - 5);
    if ((0 <= iy && iy < this.playersByPerformance.length) && (0 <= r && r < g.tournament.round - 1)) {
      a = iy;
      pa = this.playersByPerformance[a];
      b = pa.opp[r];
      if (b === g.BYE) {
        g.help = `${pa.elo} ${pa.name} has a bye => chg = ${g.K / 2}`;
      }
      if (b === g.PAUSE) {
        g.help = `${pa.elo} ${pa.name} has a pause => chg = 0`;
      }
      if (b >= 0) {
        pb = this.t.persons[b];
        chg = pa.calcRound(r);
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT((1 + pb.id).toString(), 3, RIGHT);
        s += ' ' + g.txtT(pb.elo.toString(), 4, RIGHT);
        s += ' ' + g.txtT(pb.name, 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        if (g.FACTOR === 0) {
          diff = pa.elo - pb.elo;
          s += ' ' + g.txtT(chg.toFixed(3), 7, RIGHT);
          s += ` = ${g.K}*(${pa.res[r] / 2}-p(${diff})) p(${diff})=${g.F(diff).toFixed(3)}`;
        } else {
          s += ' ' + g.txtT(chg.toFixed(1), 7, RIGHT);
          if (pa.res[r] === '1') {
            s += ` = 0.5 * (${g.OFFSET} + ${g.txtT(pb.elo, 7, RIGHT)})`;
          }
          if (pa.res[r] === '2') {
            s += ` = ${g.OFFSET} + ${g.txtT(pb.elo, 7, RIGHT)}`;
          }
        }
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
    return this.txt(s, x, y + 1, CENTER);
  }

  lightbulb(id, color, x, y, result, opponent) {
    var s;
    push();
    rectMode(CENTER);
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
    header += g.txtT("Pos", 3, RIGHT);
    header += ' ' + g.txtT('Id', 3, RIGHT);
    header += ' ' + g.txtT("Elo0", 4, RIGHT);
    header += ' ' + g.txtT("Name", 25, LEFT);
    ref = range(this.t.round);
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      header += g.txtT(`${r + 1}`, 6, RIGHT);
    }
    header += ' ' + g.txtT("Quality", 11, RIGHT);
    ref1 = this.playersByPerformance;
    for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
      person = ref1[i];
      if (i % this.t.ppp === 0) {
        res.push(header);
      }
      s = "";
      s += g.txtT((1 + i).toString(), 3, RIGHT);
      s += ' ' + g.txtT((1 + person.id).toString(), 3, RIGHT);
      s += ' ' + g.txtT(person.elo.toString(), 4, RIGHT);
      s += ' ' + g.txtT(person.name, 25, LEFT);
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
          s += g.txtT(`${1 + person.opp[r]}${g.RINGS[person.col[r][0]]}${"0½1"[person.res[r]]}`, 6, RIGHT);
        }
      }
      s += ' ' + g.txtT((person.change(this.t.round + 1)).toFixed(6), 10, RIGHT);
      res.push(s);
      if (i % this.t.ppp === this.t.ppp - 1) {
        res.push("\f");
      }
    }
    return res.push("\f");
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9zdGFuZGluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3N0YW5kaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLENBQVQ7RUFBVyxLQUFYO0VBQWlCLEtBQWpCO0VBQXVCLE1BQXZCO0VBQThCLE1BQTlCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsSUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFFQSxPQUFBLElBQWEsWUFBTixNQUFBLFVBQUEsUUFBd0IsS0FBeEI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUE0Q2QsQ0FBQSxpQkFBQSxDQUFBO0lBMUNDLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO0VBTFA7O0VBT2QsUUFBVyxDQUFBLENBQUE7QUFFWixRQUFBLE1BQUEsRUFBQTtJQUFFLE9BQUEsR0FBVSxDQUFDLENBQUMsR0FBRixDQUFNLEtBQUEsQ0FBTSxDQUFOLEVBQVEsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FB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QVAsQ0FBYyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsR0FBUyxDQUF2QixDQUFELENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsQ0FBcEMsQ0FBUCxFQUFnRCxFQUFoRCxFQUFxRCxLQUFyRDtNQUNYLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVDtNQUNBLElBQUcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxDQUFDLENBQUMsR0FBUCxLQUFjLElBQUMsQ0FBQSxDQUFDLENBQUMsR0FBSCxHQUFPLENBQXhCO1FBQStCLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBVCxFQUEvQjs7SUFoQkQ7V0FpQkEsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFUO0VBaENNOztBQTVHRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3BhZ2UuanMnIFxyXG5pbXBvcnQgeyBCdXR0b24sc3ByZWFkIH0gZnJvbSAnLi9idXR0b24uanMnICBcclxuaW1wb3J0IHsgTGlzdGEgfSBmcm9tICcuL2xpc3RhLmpzJyBcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFuZGluZ3MgZXh0ZW5kcyBQYWdlXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0ID0gZy50b3VybmFtZW50XHJcblx0XHRAYnV0dG9ucy5BcnJvd0xlZnQgID0gbmV3IEJ1dHRvbiAnJywgJycsICgpID0+IGcuc2V0U3RhdGUgZy5BQ1RJVkVcclxuXHRcdEBidXR0b25zLkFycm93UmlnaHQgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLlRBQkxFU1xyXG5cdFx0QGJ1dHRvbnMucy5hY3RpdmUgPSBmYWxzZVxyXG5cclxuXHRzZXRMaXN0YSA6IC0+XHJcblxyXG5cdFx0cmhlYWRlciA9IF8ubWFwIHJhbmdlKDEsQHQucm91bmQrMSksIChpKSAtPiBcIiAje2klMTB9IFwiXHJcblx0XHRyaGVhZGVyID0gcmhlYWRlci5qb2luICcnXHJcblx0XHRoZWFkZXIgPSBcIlwiXHJcblx0XHRoZWFkZXIgKz0gICAgICAgZy50eHRUIFwiUG9zXCIsICAgICAgICAgIDMsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiSWRcIiwgICAgICAgICAgIDMsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiRWxvXCIsICAgICAgICAgIDQsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiTmFtZVwiLCAgICAgICAgMjUsIExFRlRcclxuXHRcdGhlYWRlciArPSAnJyAgKyBnLnR4dFQgcmhlYWRlciwgMypAcm91bmQsIExFRlQgXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiUXVhbGl0eVwiLCAgICAgIDgsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiU2NvcmVcIiwgICAgICAgIDUsIFJJR0hUXHJcblxyXG5cdFx0QHBsYXllcnNCeVBlcmZvcm1hbmNlID0gXy5jbG9uZSBAdC5wZXJzb25zLnNsaWNlIDAsZy5OXHJcblx0XHRAcGxheWVyc0J5UGVyZm9ybWFuY2UgPSBfLnNvcnRCeSBAcGxheWVyc0J5UGVyZm9ybWFuY2UsIChwKSA9PiAtKHAuY2hhbmdlKEB0LnJvdW5kKzEpKVxyXG5cclxuXHRcdEBsaXN0YSA9IG5ldyBMaXN0YSBAcGxheWVyc0J5UGVyZm9ybWFuY2UsIGhlYWRlciwgQGJ1dHRvbnMsIChwLGluZGV4LHBvcykgPT4gIyByZXR1cm5lcmEgc3Ryw6RuZ2VuIHNvbSBza2Egc2tyaXZhcyB1dC4gRGVzc3V0b20gcml0YXMgbGlnaHRidWxicyBow6RyLlxyXG5cdFx0XHRAeV9idWxiID0gKDUgKyBpbmRleCkgKiBnLlpPT01bZy5zdGF0ZV0gXHJcblx0XHRcdHRleHRBbGlnbiBMRUZUXHJcblx0XHRcdGZpbGwgJ2JsYWNrJyBcclxuXHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0cyArPSAgICAgICBnLnR4dFQgKDErcG9zKS50b1N0cmluZygpLCAgICAgMywgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUICgxK3AuaWQpLnRvU3RyaW5nKCksICAgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwLmVsby50b1N0cmluZygpLCAgICAgICA0LCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcC5uYW1lLCAgICAgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgMyAqIChAdC5yb3VuZC0xKSwgIENFTlRFUlxyXG5cdFx0XHRpZiBnLkZBQ1RPUiA9PSAwIHRoZW4gcyArPSAnICcgKyBnLnR4dFQgcC5jaGFuZ2UoQHQucm91bmQpLnRvRml4ZWQoMyksIDcsIFJJR0hUXHJcblx0XHRcdGlmIGcuRkFDVE9SICE9IDAgdGhlbiBzICs9ICcgJyArIGcudHh0VCBwLmNoYW5nZShAdC5yb3VuZCkudG9GaXhlZCgxKSwgNywgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcC5zY29yZSgpLnRvU3RyaW5nKCksICAgNSwgIFJJR0hUXHJcblxyXG5cdFx0XHRmb3IgciBpbiByYW5nZSBnLnRvdXJuYW1lbnQucm91bmQgLSAxICMtIDFcclxuXHRcdFx0XHR4ID0gZy5aT09NW2cuc3RhdGVdICogKDI0LjIgKyAxLjgqcilcclxuXHRcdFx0XHRAbGlnaHRidWxiIHAuaWQsIHAuY29sW3JdLCB4LCBAeV9idWxiLCBwLnJlcy5zbGljZShyLHIrMSksIHAub3BwW3JdXHJcblx0XHRcdHNcclxuXHRcdEBsaXN0YS5wYWludFllbGxvd1JvdyA9IGZhbHNlXHJcblx0XHRzcHJlYWQgQGJ1dHRvbnMsIDEwLCBAeSwgQGhcclxuXHJcblx0bW91c2VNb3ZlZCA6ID0+XHJcblx0XHRyID0gcm91bmQgKChtb3VzZVggLyBnLlpPT01bZy5zdGF0ZV0gLSAyNC4yKSAvIDEuOClcclxuXHRcdGl5ID0gQGxpc3RhLm9mZnNldCArIHJvdW5kIG1vdXNlWSAvIGcuWk9PTVtnLnN0YXRlXSAtIDVcclxuXHRcdGlmIDAgPD0gaXkgPCBAcGxheWVyc0J5UGVyZm9ybWFuY2UubGVuZ3RoIGFuZCAwIDw9IHIgPCBnLnRvdXJuYW1lbnQucm91bmQgLSAxXHJcblx0XHRcdGEgPSBpeVxyXG5cdFx0XHRwYSA9IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZVthXVxyXG5cdFx0XHRiID0gcGEub3BwW3JdXHJcblx0XHRcdGlmIGIgPT0gZy5CWUUgICB0aGVuIGcuaGVscCA9IFwiI3twYS5lbG99ICN7cGEubmFtZX0gaGFzIGEgYnllID0+IGNoZyA9ICN7Zy5LLzJ9XCJcclxuXHRcdFx0aWYgYiA9PSBnLlBBVVNFIHRoZW4gZy5oZWxwID0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBwYXVzZSA9PiBjaGcgPSAwXCJcclxuXHRcdFx0aWYgYiA+PSAwXHRcdFx0XHRcclxuXHRcdFx0XHRwYiA9IEB0LnBlcnNvbnNbYl1cclxuXHRcdFx0XHRjaGcgPSBwYS5jYWxjUm91bmQgclxyXG5cclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwYi5pZCkudG9TdHJpbmcoKSwgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGIuZWxvLnRvU3RyaW5nKCksICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBiLm5hbWUsICAgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdGlmIGcuRkFDVE9SID09IDBcclxuXHRcdFx0XHRcdGRpZmYgPSBwYS5lbG8gLSBwYi5lbG9cclxuXHRcdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIGNoZy50b0ZpeGVkKDMpLCA3LCAgUklHSFRcclxuXHRcdFx0XHRcdHMgKz0gXCIgPSAje2cuS30qKCN7cGEucmVzW3JdLzJ9LXAoI3tkaWZmfSkpIHAoI3tkaWZmfSk9I3tnLkYoZGlmZikudG9GaXhlZCgzKX1cIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIGNoZy50b0ZpeGVkKDEpLCA3LCAgUklHSFRcclxuXHRcdFx0XHRcdGlmIHBhLnJlc1tyXSA9PSAnMScgdGhlbiBzICs9IFwiID0gMC41ICogKCN7Zy5PRkZTRVR9ICsgI3tnLnR4dFQgcGIuZWxvLCA3LCBSSUdIVH0pXCJcclxuXHRcdFx0XHRcdGlmIHBhLnJlc1tyXSA9PSAnMicgdGhlbiBzICs9IFwiID0gI3tnLk9GRlNFVH0gKyAje2cudHh0VCBwYi5lbG8sIDcsIFJJR0hUfVwiXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRnLmhlbHAgPSBzXHJcblx0XHRlbHNlXHJcblx0XHRcdGcuaGVscCA9IFwiXCJcclxuXHJcblx0bW91c2VXaGVlbCAgIDogKGV2ZW50ICktPiBAbGlzdGEubW91c2VXaGVlbCBldmVudFxyXG5cdG1vdXNlUHJlc3NlZCA6IChldmVudCkgLT4gQGxpc3RhLm1vdXNlUHJlc3NlZCBldmVudFxyXG5cdGtleVByZXNzZWQgICA6IChldmVudCkgLT4gQGJ1dHRvbnNba2V5XS5jbGljaygpXHJcblxyXG5cdGRyYXcgOiAtPlxyXG5cdFx0ZmlsbCAnd2hpdGUnXHJcblx0XHRAc2hvd0hlYWRlciBAdC5yb3VuZC0xXHJcblx0XHRAbGlzdGEuZHJhdygpXHJcblx0XHRmb3Iga2V5LGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG5cdFx0XHRidXR0b24uZHJhdygpXHJcblx0XHR0ZXh0QWxpZ24gTEVGVFxyXG5cdFx0dGV4dCBnLmhlbHAsIDEwLCAzKmcuWk9PTVtnLnN0YXRlXVxyXG5cclxuXHRzaG93IDogKHMseCx5LGJnLGZnKSAtPlxyXG5cdFx0ZmlsbCBiZ1xyXG5cdFx0cmVjdCB4LCB5LCAxLjYgKiBnLlpPT01bZy5zdGF0ZV0sIDAuOSAqIGcuWk9PTVtnLnN0YXRlXVxyXG5cdFx0ZmlsbCBmZ1xyXG5cdFx0QHR4dCBzLCB4LCB5KzEsICBDRU5URVJcclxuXHJcblx0bGlnaHRidWxiIDogKGlkLCBjb2xvciwgeCwgeSwgcmVzdWx0LCBvcHBvbmVudCkgLT5cclxuXHRcdHB1c2goKVxyXG5cdFx0cmVjdE1vZGUgIENFTlRFUlxyXG5cdFx0cyA9IDEgKyBvcHBvbmVudFxyXG5cdFx0aWYgb3Bwb25lbnQgPT0gZy5QQVVTRSB0aGVuIEBzaG93IFwiIFAgXCIseCx5LFwiZ3JheVwiLCd5ZWxsb3cnXHJcblx0XHRpZiBvcHBvbmVudCA9PSBnLkJZRSAgIHRoZW4gQHNob3cgXCJCWUVcIix4LHksXCJncmVlblwiLCd5ZWxsb3cnXHJcblx0XHRpZiBvcHBvbmVudCA+PSAwXHJcblx0XHRcdHJlc3VsdCA9ICcwMTInLmluZGV4T2YgcmVzdWx0XHJcblx0XHRcdEBzaG93IDErb3Bwb25lbnQsIHgsIHksICdyZWQgZ3JheSBncmVlbicuc3BsaXQoJyAnKVtyZXN1bHRdLCB7YjonYmxhY2snLCAnICc6J3llbGxvdycsIHc6J3doaXRlJ31bY29sb3JdXHJcblx0XHRwb3AoKVxyXG5cclxuXHRtYWtlIDogKHJlcyxoZWFkZXIpIC0+XHJcblx0XHRpZiBAdC5wYWlycy5sZW5ndGggPT0gMCB0aGVuIHJlcy5wdXNoIFwiVGhpcyBST1VORCBjYW4ndCBiZSBwYWlyZWQhIChUb28gbWFueSByb3VuZHMpXCJcclxuXHJcblx0XHRyZXMucHVzaCBcIlNUQU5ESU5HU1wiICsgaGVhZGVyXHJcblx0XHRyZXMucHVzaCBcIlwiXHJcblxyXG5cdFx0aGVhZGVyID0gXCJcIlxyXG5cdFx0aGVhZGVyICs9ICAgICAgIGcudHh0VCBcIlBvc1wiLCAgIDMsICBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCAnSWQnLCAgICAzLCAgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJFbG8wXCIsICA0LCAgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJOYW1lXCIsIDI1LCAgTEVGVFxyXG5cdFx0Zm9yIHIgaW4gcmFuZ2UgQHQucm91bmRcclxuXHRcdFx0aGVhZGVyICs9IGcudHh0VCBcIiN7cisxfVwiLCAgNiwgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJRdWFsaXR5XCIsIDExLCBSSUdIVFxyXG5cdFx0XHJcblx0XHRmb3IgcGVyc29uLGkgaW4gQHBsYXllcnNCeVBlcmZvcm1hbmNlXHJcblx0XHRcdGlmIGkgJSBAdC5wcHAgPT0gMCB0aGVuIHJlcy5wdXNoIGhlYWRlclxyXG5cdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRzICs9ICAgICAgIGcudHh0VCAoMStpKS50b1N0cmluZygpLCAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgKDErcGVyc29uLmlkKS50b1N0cmluZygpLCAgMywgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBlcnNvbi5lbG8udG9TdHJpbmcoKSwgICAgNCwgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBlcnNvbi5uYW1lLCAgICAgICAgICAgICAgMjUsICBMRUZUXHJcblx0XHRcdHMgKz0gJyAnXHJcblx0XHRcdGZvciByIGluIHJhbmdlIEB0LnJvdW5kXHJcblx0XHRcdFx0aWYgcGVyc29uLm9wcFtyXSA9PSAtMiB0aGVuIHMgKz0gJyAgICBQICdcclxuXHRcdFx0XHRpZiBwZXJzb24ub3BwW3JdID09IC0xIHRoZW4gcyArPSAnICAgQllFJ1xyXG5cdFx0XHRcdGlmIHBlcnNvbi5vcHBbcl0gPj0gMFxyXG5cdFx0XHRcdFx0cyArPSBnLnR4dFQgXCIjezErcGVyc29uLm9wcFtyXX0je2cuUklOR1NbcGVyc29uLmNvbFtyXVswXV19I3tcIjDCvTFcIltwZXJzb24ucmVzW3JdXX1cIiwgNiwgIFJJR0hUXHRcdFx0XHJcblxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAocGVyc29uLmNoYW5nZShAdC5yb3VuZCsxKSkudG9GaXhlZCg2KSwgIDEwLCAgUklHSFRcclxuXHRcdFx0cmVzLnB1c2ggcyBcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSBAdC5wcHAtMSB0aGVuIHJlcy5wdXNoIFwiXFxmXCJcclxuXHRcdHJlcy5wdXNoIFwiXFxmXCIiXX0=
//# sourceURL=c:\github\ELO-Pairings\coffee\page_standings.coffee