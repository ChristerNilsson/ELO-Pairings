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
          s += ` = ${g.K}*(${pa.res[r] / 2}-p(${diff})) p(${diff})=${g.F(-diff).toFixed(3)}`;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9zdGFuZGluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3N0YW5kaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLENBQVQ7RUFBVyxLQUFYO0VBQWlCLEtBQWpCO0VBQXVCLE1BQXZCO0VBQThCLE1BQTlCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsSUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFFQSxPQUFBLElBQWEsWUFBTixNQUFBLFVBQUEsUUFBd0IsS0FBeEI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUEwQ2QsQ0FBQSxpQkFBQSxDQUFBO0lBeENDLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO0VBTFA7O0VBT2QsUUFBVyxDQUFBLENBQUE7QUFFWixRQUFBLE1BQUEsRUFBQTtJQUFFLE9BQUEsR0FBVSxDQUFDLENBQUMsR0FBRixDQUFNLEtBQUEsQ0FBTSxDQUFOLEVBQVEsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FB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QWMsSUFBQyxDQUFBLENBQUMsQ0FBQyxHQUFILEdBQU8sQ0FBeEI7UUFBK0IsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEVBQS9COztJQWhCRDtXQWlCQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQ7RUFoQ007O0FBMUdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyxwcmludCxyYW5nZSxzY2FsZXgsc2NhbGV5IH0gZnJvbSAnLi9nbG9iYWxzLmpzJyBcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZS5qcycgXHJcbmltcG9ydCB7IEJ1dHRvbixzcHJlYWQgfSBmcm9tICcuL2J1dHRvbi5qcycgIFxyXG5pbXBvcnQgeyBMaXN0YSB9IGZyb20gJy4vbGlzdGEuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YW5kaW5ncyBleHRlbmRzIFBhZ2VcclxuXHJcblx0Y29uc3RydWN0b3IgOiAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHQgPSBnLnRvdXJuYW1lbnRcclxuXHRcdEBidXR0b25zLkFycm93TGVmdCAgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLkFDVElWRVxyXG5cdFx0QGJ1dHRvbnMuQXJyb3dSaWdodCA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuVEFCTEVTXHJcblx0XHRAYnV0dG9ucy5zLmFjdGl2ZSA9IGZhbHNlXHJcblxyXG5cdHNldExpc3RhIDogLT5cclxuXHJcblx0XHRyaGVhZGVyID0gXy5tYXAgcmFuZ2UoMSxAdC5yb3VuZCsxKSwgKGkpIC0+IFwiICN7aSUxMH0gXCJcclxuXHRcdHJoZWFkZXIgPSByaGVhZGVyLmpvaW4gJydcclxuXHRcdGhlYWRlciA9IFwiXCJcclxuXHRcdGhlYWRlciArPSAgICAgICBnLnR4dFQgXCJQb3NcIiwgICAgICAgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJJZFwiLCAgICAgICAgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJFbG9cIiwgICAgICAgICAgNCwgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJOYW1lXCIsICAgICAgICAyNSwgTEVGVFxyXG5cdFx0aGVhZGVyICs9ICcnICArIGcudHh0VCByaGVhZGVyLCAzKkByb3VuZCwgTEVGVCBcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJRdWFsaXR5XCIsICAgICAgOCwgUklHSFRcclxuXHJcblx0XHRAcGxheWVyc0J5UGVyZm9ybWFuY2UgPSBfLmNsb25lIEB0LnBlcnNvbnMuc2xpY2UgMCxnLk5cclxuXHRcdEBwbGF5ZXJzQnlQZXJmb3JtYW5jZSA9IF8uc29ydEJ5IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZSwgKHApID0+IC0ocC5jaGFuZ2UoQHQucm91bmQrMSkpXHJcblxyXG5cdFx0QGxpc3RhID0gbmV3IExpc3RhIEBwbGF5ZXJzQnlQZXJmb3JtYW5jZSwgaGVhZGVyLCBAYnV0dG9ucywgKHAsaW5kZXgscG9zKSA9PiAjIHJldHVybmVyYSBzdHLDpG5nZW4gc29tIHNrYSBza3JpdmFzIHV0LiBEZXNzdXRvbSByaXRhcyBsaWdodGJ1bGJzIGjDpHIuXHJcblx0XHRcdEB5X2J1bGIgPSAoNSArIGluZGV4KSAqIGcuWk9PTVtnLnN0YXRlXSBcclxuXHRcdFx0dGV4dEFsaWduIExFRlRcclxuXHRcdFx0ZmlsbCAnYmxhY2snIFxyXG5cdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRzICs9ICAgICAgIGcudHh0VCAoMStwb3MpLnRvU3RyaW5nKCksICAgICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgKDErcC5pZCkudG9TdHJpbmcoKSwgICAgMywgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHAuZWxvLnRvU3RyaW5nKCksICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwLm5hbWUsICAgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAzICogKEB0LnJvdW5kLTEpLCAgQ0VOVEVSXHJcblx0XHRcdGlmIGcuRkFDVE9SID09IDAgdGhlbiBzICs9ICcgJyArIGcudHh0VCBwLmNoYW5nZShAdC5yb3VuZCkudG9GaXhlZCgzKSwgNywgUklHSFRcclxuXHRcdFx0aWYgZy5GQUNUT1IgIT0gMCB0aGVuIHMgKz0gJyAnICsgZy50eHRUIHAuY2hhbmdlKEB0LnJvdW5kKS50b0ZpeGVkKDEpLCA3LCBSSUdIVFxyXG5cclxuXHRcdFx0Zm9yIHIgaW4gcmFuZ2UgZy50b3VybmFtZW50LnJvdW5kIC0gMSAjLSAxXHJcblx0XHRcdFx0eCA9IGcuWk9PTVtnLnN0YXRlXSAqICgyNC4yICsgMS44KnIpXHJcblx0XHRcdFx0QGxpZ2h0YnVsYiBwLmlkLCBwLmNvbFtyXSwgeCwgQHlfYnVsYiwgcC5yZXMuc2xpY2UocixyKzEpLCBwLm9wcFtyXVxyXG5cdFx0XHRzXHJcblx0XHRAbGlzdGEucGFpbnRZZWxsb3dSb3cgPSBmYWxzZVxyXG5cdFx0c3ByZWFkIEBidXR0b25zLCAxMCwgQHksIEBoXHJcblxyXG5cdG1vdXNlTW92ZWQgOiA9PlxyXG5cdFx0ciA9IHJvdW5kICgobW91c2VYIC8gZy5aT09NW2cuc3RhdGVdIC0gMjQuMikgLyAxLjgpXHJcblx0XHRpeSA9IEBsaXN0YS5vZmZzZXQgKyByb3VuZCBtb3VzZVkgLyBnLlpPT01bZy5zdGF0ZV0gLSA1XHJcblx0XHRpZiAwIDw9IGl5IDwgQHBsYXllcnNCeVBlcmZvcm1hbmNlLmxlbmd0aCBhbmQgMCA8PSByIDwgZy50b3VybmFtZW50LnJvdW5kIC0gMVxyXG5cdFx0XHRhID0gaXlcclxuXHRcdFx0cGEgPSBAcGxheWVyc0J5UGVyZm9ybWFuY2VbYV1cclxuXHRcdFx0YiA9IHBhLm9wcFtyXVxyXG5cdFx0XHRpZiBiID09IGcuQllFICAgdGhlbiBnLmhlbHAgPSBcIiN7cGEuZWxvfSAje3BhLm5hbWV9IGhhcyBhIGJ5ZSA9PiBjaGcgPSAje2cuSy8yfVwiXHJcblx0XHRcdGlmIGIgPT0gZy5QQVVTRSB0aGVuIGcuaGVscCA9IFwiI3twYS5lbG99ICN7cGEubmFtZX0gaGFzIGEgcGF1c2UgPT4gY2hnID0gMFwiXHJcblx0XHRcdGlmIGIgPj0gMFx0XHRcdFx0XHJcblx0XHRcdFx0cGIgPSBAdC5wZXJzb25zW2JdXHJcblx0XHRcdFx0Y2hnID0gcGEuY2FsY1JvdW5kIHJcclxuXHJcblx0XHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0XHRzICs9ICAgICAgIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgKDErcGIuaWQpLnRvU3RyaW5nKCksICAgIDMsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBiLmVsby50b1N0cmluZygpLCAgICAgICA0LCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCBwYi5uYW1lLCAgICAgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgMyAqIChAdC5yb3VuZC0xKSwgIExFRlRcclxuXHRcdFx0XHRpZiBnLkZBQ1RPUiA9PSAwXHJcblx0XHRcdFx0XHRkaWZmID0gcGEuZWxvIC0gcGIuZWxvXHJcblx0XHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCBjaGcudG9GaXhlZCgzKSwgNywgIFJJR0hUXHJcblx0XHRcdFx0XHRzICs9IFwiID0gI3tnLkt9Kigje3BhLnJlc1tyXS8yfS1wKCN7ZGlmZn0pKSBwKCN7ZGlmZn0pPSN7Zy5GKC1kaWZmKS50b0ZpeGVkKDMpfVwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgY2hnLnRvRml4ZWQoMSksIDcsICBSSUdIVFxyXG5cdFx0XHRcdFx0aWYgcGEucmVzW3JdID09ICcxJyB0aGVuIHMgKz0gXCIgPSAwLjUgKiAoI3tnLk9GRlNFVH0gKyAje2cudHh0VCBwYi5lbG8sIDcsIFJJR0hUfSlcIlxyXG5cdFx0XHRcdFx0aWYgcGEucmVzW3JdID09ICcyJyB0aGVuIHMgKz0gXCIgPSAje2cuT0ZGU0VUfSArICN7Zy50eHRUIHBiLmVsbywgNywgUklHSFR9XCJcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdGcuaGVscCA9IHNcclxuXHRcdGVsc2VcclxuXHRcdFx0Zy5oZWxwID0gXCJcIlxyXG5cclxuXHRtb3VzZVdoZWVsICAgOiAoZXZlbnQgKS0+IEBsaXN0YS5tb3VzZVdoZWVsIGV2ZW50XHJcblx0bW91c2VQcmVzc2VkIDogKGV2ZW50KSAtPiBAbGlzdGEubW91c2VQcmVzc2VkIGV2ZW50XHJcblx0a2V5UHJlc3NlZCAgIDogKGV2ZW50KSAtPiBAYnV0dG9uc1trZXldLmNsaWNrKClcclxuXHJcblx0ZHJhdyA6IC0+XHJcblx0XHRmaWxsICd3aGl0ZSdcclxuXHRcdEBzaG93SGVhZGVyIEB0LnJvdW5kLTFcclxuXHRcdEBsaXN0YS5kcmF3KClcclxuXHRcdGZvciBrZXksYnV0dG9uIG9mIEBidXR0b25zXHJcblx0XHRcdGJ1dHRvbi5kcmF3KClcclxuXHRcdHRleHRBbGlnbiBMRUZUXHJcblx0XHR0ZXh0IGcuaGVscCwgMTAsIDMqZy5aT09NW2cuc3RhdGVdXHJcblxyXG5cdHNob3cgOiAocyx4LHksYmcsZmcpIC0+XHJcblx0XHRmaWxsIGJnXHJcblx0XHRyZWN0IHgsIHksIDEuNiAqIGcuWk9PTVtnLnN0YXRlXSwgMC45ICogZy5aT09NW2cuc3RhdGVdXHJcblx0XHRmaWxsIGZnXHJcblx0XHRAdHh0IHMsIHgsIHkrMSwgIENFTlRFUlxyXG5cclxuXHRsaWdodGJ1bGIgOiAoaWQsIGNvbG9yLCB4LCB5LCByZXN1bHQsIG9wcG9uZW50KSAtPlxyXG5cdFx0cHVzaCgpXHJcblx0XHRyZWN0TW9kZSAgQ0VOVEVSXHJcblx0XHRzID0gMSArIG9wcG9uZW50XHJcblx0XHRpZiBvcHBvbmVudCA9PSBnLlBBVVNFIHRoZW4gQHNob3cgXCIgUCBcIix4LHksXCJncmF5XCIsJ3llbGxvdydcclxuXHRcdGlmIG9wcG9uZW50ID09IGcuQllFICAgdGhlbiBAc2hvdyBcIkJZRVwiLHgseSxcImdyZWVuXCIsJ3llbGxvdydcclxuXHRcdGlmIG9wcG9uZW50ID49IDBcclxuXHRcdFx0cmVzdWx0ID0gJzAxMicuaW5kZXhPZiByZXN1bHRcclxuXHRcdFx0QHNob3cgMStvcHBvbmVudCwgeCwgeSwgJ3JlZCBncmF5IGdyZWVuJy5zcGxpdCgnICcpW3Jlc3VsdF0sIHtiOidibGFjaycsICcgJzoneWVsbG93Jywgdzond2hpdGUnfVtjb2xvcl1cclxuXHRcdHBvcCgpXHJcblxyXG5cdG1ha2UgOiAocmVzLGhlYWRlcikgLT5cclxuXHRcdGlmIEB0LnBhaXJzLmxlbmd0aCA9PSAwIHRoZW4gcmVzLnB1c2ggXCJUaGlzIFJPVU5EIGNhbid0IGJlIHBhaXJlZCEgKFRvbyBtYW55IHJvdW5kcylcIlxyXG5cclxuXHRcdHJlcy5wdXNoIFwiU1RBTkRJTkdTXCIgKyBoZWFkZXJcclxuXHRcdHJlcy5wdXNoIFwiXCJcclxuXHJcblx0XHRoZWFkZXIgPSBcIlwiXHJcblx0XHRoZWFkZXIgKz0gICAgICAgZy50eHRUIFwiUG9zXCIsICAgMywgIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUICdJZCcsICAgIDMsICBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIkVsbzBcIiwgIDQsICBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIk5hbWVcIiwgMjUsICBMRUZUXHJcblx0XHRmb3IgciBpbiByYW5nZSBAdC5yb3VuZFxyXG5cdFx0XHRoZWFkZXIgKz0gZy50eHRUIFwiI3tyKzF9XCIsICA2LCBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIlF1YWxpdHlcIiwgMTEsIFJJR0hUXHJcblx0XHRcclxuXHRcdGZvciBwZXJzb24saSBpbiBAcGxheWVyc0J5UGVyZm9ybWFuY2VcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSAwIHRoZW4gcmVzLnB1c2ggaGVhZGVyXHJcblx0XHRcdHMgPSBcIlwiXHJcblx0XHRcdHMgKz0gICAgICAgZy50eHRUICgxK2kpLnRvU3RyaW5nKCksICAgICAgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwZXJzb24uaWQpLnRvU3RyaW5nKCksICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGVyc29uLmVsby50b1N0cmluZygpLCAgICA0LCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGVyc29uLm5hbWUsICAgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0cyArPSAnICdcclxuXHRcdFx0Zm9yIHIgaW4gcmFuZ2UgQHQucm91bmRcclxuXHRcdFx0XHRpZiBwZXJzb24ub3BwW3JdID09IC0yIHRoZW4gcyArPSAnICAgIFAgJ1xyXG5cdFx0XHRcdGlmIHBlcnNvbi5vcHBbcl0gPT0gLTEgdGhlbiBzICs9ICcgICBCWUUnXHJcblx0XHRcdFx0aWYgcGVyc29uLm9wcFtyXSA+PSAwXHJcblx0XHRcdFx0XHRzICs9IGcudHh0VCBcIiN7MStwZXJzb24ub3BwW3JdfSN7Zy5SSU5HU1twZXJzb24uY29sW3JdWzBdXX0je1wiMMK9MVwiW3BlcnNvbi5yZXNbcl1dfVwiLCA2LCAgUklHSFRcdFx0XHRcclxuXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIChwZXJzb24uY2hhbmdlKEB0LnJvdW5kKzEpKS50b0ZpeGVkKDYpLCAgMTAsICBSSUdIVFxyXG5cdFx0XHRyZXMucHVzaCBzIFxyXG5cdFx0XHRpZiBpICUgQHQucHBwID09IEB0LnBwcC0xIHRoZW4gcmVzLnB1c2ggXCJcXGZcIlxyXG5cdFx0cmVzLnB1c2ggXCJcXGZcIiJdfQ==
//# sourceURL=c:\github\ELO-Pairings\coffee\page_standings.coffee