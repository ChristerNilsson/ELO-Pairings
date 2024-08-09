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
    this.playersByPerformance = _.clone(this.t.playersByID.slice(0, g.N));
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
      // if g.FACTOR == 0 then s += ' ' + g.txtT p.change(@t.round).toFixed(3), 7, RIGHT
      s += ' ' + g.txtT(p.change(this.t.round).toFixed(1), 7, RIGHT);
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
    var b, chg, iy, pa, pb, r, s;
    boundMethodCheck(this, Standings);
    r = round((mouseX / g.ZOOM[g.state] - 24.2) / 1.8);
    iy = this.lista.offset + round(mouseY / g.ZOOM[g.state] - 5);
    if ((0 <= iy && iy < this.playersByPerformance.length) && (0 <= r && r < g.tournament.round - 1)) {
      pa = this.playersByPerformance[iy];
      b = pa.opp[r];
      if (b === g.BYE) {
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 4, RIGHT);
        s += ' ' + g.txtT('has a bye', 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        // g.help = "#{pa.elo} #{pa.name} has a bye                   #{pa.elo.toFixed(1)}" # => chg = #{g.K/2}"
        s += ' ' + g.txtT(`${pa.elo.toFixed(1)}`, 7, RIGHT);
        g.help = s;
      }
      if (b === g.PAUSE) {
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 4, RIGHT);
        s += ' ' + g.txtT('has a pause', 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        // g.help = "#{pa.elo} #{pa.name} has a bye                   #{pa.elo.toFixed(1)}" # => chg = #{g.K/2}"
        s += ' ' + g.txtT("0.0", 7, RIGHT);
        g.help = s;
      }
      // 	s += "#{pa.elo} #{pa.name} has a pause                    0.0" # => chg = 0"

      // g.help = s
      if (b >= 0) {
        pb = this.t.playersByID[b];
        chg = pa.calcRound(r);
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT((1 + pb.id).toString(), 3, RIGHT);
        s += ' ' + g.txtT(pb.elo.toString(), 4, RIGHT);
        s += ' ' + g.txtT(pb.name, 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        // if g.FACTOR == 0
        // 	diff = pa.elo - pb.elo
        // 	s += ' ' + g.txtT chg.toFixed(3), 7,  RIGHT
        // 	s += " = #{g.K}*(#{pa.res[r]/2}-p(#{diff})) p(#{diff})=#{g.F(diff).toFixed(3)}"
        // else
        s += ' ' + g.txtT(chg.toFixed(1), 7, RIGHT);
        // if pa.res[r] == '1' then s += " = 0.5 * (#{g.OFFSET} + #{g.txtT pb.elo, 7, RIGHT})"
        // if pa.res[r] == '2' then s += " = #{g.OFFSET} + #{g.txtT pb.elo, 7, RIGHT}"
        if (pa.res[r] === '1') {
          s += ` = 0.5 * ${g.txtT(pb.elo, 7, RIGHT)}`;
        }
        if (pa.res[r] === '2') {
          s += ` = ${g.txtT(pb.elo, 7, RIGHT)}`;
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
    var i, j, k, l, len, len1, len2, player, r, ref, ref1, ref2, s;
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
      player = ref1[i];
      if (i % this.t.ppp === 0) {
        res.push(header);
      }
      s = "";
      s += g.txtT((1 + i).toString(), 3, RIGHT);
      s += ' ' + g.txtT((1 + player.id).toString(), 3, RIGHT);
      s += ' ' + g.txtT(player.elo.toString(), 4, RIGHT);
      s += ' ' + g.txtT(player.name, 25, LEFT);
      s += ' ';
      ref2 = range(this.t.round);
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        r = ref2[l];
        if (player.opp[r] === -2) {
          s += '    P ';
        }
        if (player.opp[r] === -1) {
          s += '   BYE';
        }
        if (player.opp[r] >= 0) {
          s += g.txtT(`${1 + player.opp[r]}${g.RINGS[player.col[r][0]]}${"0½1"[player.res[r]]}`, 6, RIGHT);
        }
      }
      s += ' ' + g.txtT((player.change(this.t.round + 1)).toFixed(6), 10, RIGHT);
      res.push(s);
      if (i % this.t.ppp === this.t.ppp - 1) {
        res.push("\f");
      }
    }
    return res.push("\f");
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9zdGFuZGluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3N0YW5kaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLENBQVQ7RUFBVyxLQUFYO0VBQWlCLEtBQWpCO0VBQXVCLE1BQXZCO0VBQThCLE1BQTlCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsSUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFFQSxPQUFBLElBQWEsWUFBTixNQUFBLFVBQUEsUUFBd0IsS0FBeEI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUE0Q2QsQ0FBQSxpQkFBQSxDQUFBO0lBMUNDLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO0VBTFA7O0VBT2QsUUFBVyxDQUFBLENBQUE7QUFFWixRQUFBLE1BQUEsRUFBQTtJQUFFLE9BQUEsR0FBVSxDQUFDLENBQUMsR0FBRixDQUFNLEtBQUEsQ0FBTSxDQUFOLEVBQVEsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FB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QUFYLENBQXRELENBQUEsQ0FBUCxFQUFnRixDQUFoRixFQUFvRixLQUFwRixFQUROOztNQUhEO01BTUEsQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUMsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsR0FBUyxDQUF2QixDQUFELENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsQ0FBcEMsQ0FBUCxFQUFnRCxFQUFoRCxFQUFxRCxLQUFyRDtNQUNYLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVDtNQUNBLElBQUcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxDQUFDLENBQUMsR0FBUCxLQUFjLElBQUMsQ0FBQSxDQUFDLENBQUMsR0FBSCxHQUFPLENBQXhCO1FBQStCLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBVCxFQUEvQjs7SUFoQkQ7V0FpQkEsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFUO0VBaENNOztBQXRJRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3BhZ2UuanMnIFxyXG5pbXBvcnQgeyBCdXR0b24sc3ByZWFkIH0gZnJvbSAnLi9idXR0b24uanMnICBcclxuaW1wb3J0IHsgTGlzdGEgfSBmcm9tICcuL2xpc3RhLmpzJyBcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFuZGluZ3MgZXh0ZW5kcyBQYWdlXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEB0ID0gZy50b3VybmFtZW50XHJcblx0XHRAYnV0dG9ucy5BcnJvd0xlZnQgID0gbmV3IEJ1dHRvbiAnJywgJycsICgpID0+IGcuc2V0U3RhdGUgZy5BQ1RJVkVcclxuXHRcdEBidXR0b25zLkFycm93UmlnaHQgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLlRBQkxFU1xyXG5cdFx0QGJ1dHRvbnMucy5hY3RpdmUgPSBmYWxzZVxyXG5cclxuXHRzZXRMaXN0YSA6IC0+XHJcblxyXG5cdFx0cmhlYWRlciA9IF8ubWFwIHJhbmdlKDEsQHQucm91bmQrMSksIChpKSAtPiBcIiAje2klMTB9IFwiXHJcblx0XHRyaGVhZGVyID0gcmhlYWRlci5qb2luICcnXHJcblx0XHRoZWFkZXIgPSBcIlwiXHJcblx0XHRoZWFkZXIgKz0gICAgICAgZy50eHRUIFwiUG9zXCIsICAgICAgICAgIDMsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiSWRcIiwgICAgICAgICAgIDMsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiRWxvXCIsICAgICAgICAgIDQsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiTmFtZVwiLCAgICAgICAgMjUsIExFRlRcclxuXHRcdGhlYWRlciArPSAnJyAgKyBnLnR4dFQgcmhlYWRlciwgMypAcm91bmQsIExFRlQgXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiUXVhbGl0eVwiLCAgICAgIDgsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiU2NvcmVcIiwgICAgICAgIDUsIFJJR0hUXHJcblxyXG5cdFx0QHBsYXllcnNCeVBlcmZvcm1hbmNlID0gXy5jbG9uZSBAdC5wbGF5ZXJzQnlJRC5zbGljZSAwLGcuTlxyXG5cdFx0QHBsYXllcnNCeVBlcmZvcm1hbmNlID0gXy5zb3J0QnkgQHBsYXllcnNCeVBlcmZvcm1hbmNlLCAocCkgPT4gLShwLmNoYW5nZShAdC5yb3VuZCsxKSlcclxuXHJcblx0XHRAbGlzdGEgPSBuZXcgTGlzdGEgQHBsYXllcnNCeVBlcmZvcm1hbmNlLCBoZWFkZXIsIEBidXR0b25zLCAocCxpbmRleCxwb3MpID0+ICMgcmV0dXJuZXJhIHN0csOkbmdlbiBzb20gc2thIHNrcml2YXMgdXQuIERlc3N1dG9tIHJpdGFzIGxpZ2h0YnVsYnMgaMOkci5cclxuXHRcdFx0QHlfYnVsYiA9ICg1ICsgaW5kZXgpICogZy5aT09NW2cuc3RhdGVdIFxyXG5cdFx0XHR0ZXh0QWxpZ24gTEVGVFxyXG5cdFx0XHRmaWxsICdibGFjaycgXHJcblx0XHRcdHMgPSBcIlwiXHJcblx0XHRcdHMgKz0gICAgICAgZy50eHRUICgxK3BvcykudG9TdHJpbmcoKSwgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwLmlkKS50b1N0cmluZygpLCAgICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcC5lbG8udG9TdHJpbmcoKSwgICAgICAgNCwgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHAubmFtZSwgICAgICAgICAgICAgICAgMjUsICBMRUZUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgIDMgKiAoQHQucm91bmQtMSksICBDRU5URVJcclxuXHRcdFx0IyBpZiBnLkZBQ1RPUiA9PSAwIHRoZW4gcyArPSAnICcgKyBnLnR4dFQgcC5jaGFuZ2UoQHQucm91bmQpLnRvRml4ZWQoMyksIDcsIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHAuY2hhbmdlKEB0LnJvdW5kKS50b0ZpeGVkKDEpLCA3LCBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwLnNjb3JlKCkudG9TdHJpbmcoKSwgICA1LCAgUklHSFRcclxuXHJcblx0XHRcdGZvciByIGluIHJhbmdlIGcudG91cm5hbWVudC5yb3VuZCAtIDEgIy0gMVxyXG5cdFx0XHRcdHggPSBnLlpPT01bZy5zdGF0ZV0gKiAoMjQuMiArIDEuOCpyKVxyXG5cdFx0XHRcdEBsaWdodGJ1bGIgcC5pZCwgcC5jb2xbcl0sIHgsIEB5X2J1bGIsIHAucmVzLnNsaWNlKHIscisxKSwgcC5vcHBbcl1cclxuXHRcdFx0c1xyXG5cdFx0QGxpc3RhLnBhaW50WWVsbG93Um93ID0gZmFsc2VcclxuXHRcdHNwcmVhZCBAYnV0dG9ucywgMTAsIEB5LCBAaFxyXG5cclxuXHRtb3VzZU1vdmVkIDogPT5cclxuXHRcdHIgPSByb3VuZCAoKG1vdXNlWCAvIGcuWk9PTVtnLnN0YXRlXSAtIDI0LjIpIC8gMS44KVxyXG5cdFx0aXkgPSBAbGlzdGEub2Zmc2V0ICsgcm91bmQgbW91c2VZIC8gZy5aT09NW2cuc3RhdGVdIC0gNVxyXG5cdFx0aWYgMCA8PSBpeSA8IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZS5sZW5ndGggYW5kIDAgPD0gciA8IGcudG91cm5hbWVudC5yb3VuZCAtIDFcclxuXHRcdFx0cGEgPSBAcGxheWVyc0J5UGVyZm9ybWFuY2VbaXldXHJcblx0XHRcdGIgPSBwYS5vcHBbcl1cclxuXHJcblx0XHRcdGlmIGIgPT0gZy5CWUUgXHJcblx0XHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0XHRzICs9ICAgICAgIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICA0LCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnaGFzIGEgYnllJywgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgMyAqIChAdC5yb3VuZC0xKSwgIExFRlRcclxuXHRcdFx0XHQjIGcuaGVscCA9IFwiI3twYS5lbG99ICN7cGEubmFtZX0gaGFzIGEgYnllICAgICAgICAgICAgICAgICAgICN7cGEuZWxvLnRvRml4ZWQoMSl9XCIgIyA9PiBjaGcgPSAje2cuSy8yfVwiXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgXCIje3BhLmVsby50b0ZpeGVkKDEpfVwiLCAgICAgICAgNywgUklHSFRcclxuXHRcdFx0XHRnLmhlbHAgPSBzXHJcblxyXG5cdFx0XHRpZiBiID09IGcuUEFVU0VcclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICdoYXMgYSBwYXVzZScsICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdCMgZy5oZWxwID0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBieWUgICAgICAgICAgICAgICAgICAgI3twYS5lbG8udG9GaXhlZCgxKX1cIiAjID0+IGNoZyA9ICN7Zy5LLzJ9XCJcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCBcIjAuMFwiLCAgICAgICAgICAgICAgICAgICAgICAgICA3LCBSSUdIVFxyXG5cdFx0XHRcdGcuaGVscCA9IHNcclxuXHJcblx0XHRcdFx0IyBcdHMgKz0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBwYXVzZSAgICAgICAgICAgICAgICAgICAgMC4wXCIgIyA9PiBjaGcgPSAwXCJcclxuXHJcblx0XHRcdFx0IyBnLmhlbHAgPSBzXHJcblxyXG5cdFx0XHRpZiBiID49IDBcdFx0XHRcdFxyXG5cdFx0XHRcdHBiID0gQHQucGxheWVyc0J5SURbYl1cclxuXHRcdFx0XHRjaGcgPSBwYS5jYWxjUm91bmQgclxyXG5cclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwYi5pZCkudG9TdHJpbmcoKSwgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGIuZWxvLnRvU3RyaW5nKCksICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBiLm5hbWUsICAgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdCMgaWYgZy5GQUNUT1IgPT0gMFxyXG5cdFx0XHRcdCMgXHRkaWZmID0gcGEuZWxvIC0gcGIuZWxvXHJcblx0XHRcdFx0IyBcdHMgKz0gJyAnICsgZy50eHRUIGNoZy50b0ZpeGVkKDMpLCA3LCAgUklHSFRcclxuXHRcdFx0XHQjIFx0cyArPSBcIiA9ICN7Zy5LfSooI3twYS5yZXNbcl0vMn0tcCgje2RpZmZ9KSkgcCgje2RpZmZ9KT0je2cuRihkaWZmKS50b0ZpeGVkKDMpfVwiXHJcblx0XHRcdFx0IyBlbHNlXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgY2hnLnRvRml4ZWQoMSksIDcsICBSSUdIVFxyXG5cdFx0XHRcdCMgaWYgcGEucmVzW3JdID09ICcxJyB0aGVuIHMgKz0gXCIgPSAwLjUgKiAoI3tnLk9GRlNFVH0gKyAje2cudHh0VCBwYi5lbG8sIDcsIFJJR0hUfSlcIlxyXG5cdFx0XHRcdCMgaWYgcGEucmVzW3JdID09ICcyJyB0aGVuIHMgKz0gXCIgPSAje2cuT0ZGU0VUfSArICN7Zy50eHRUIHBiLmVsbywgNywgUklHSFR9XCJcclxuXHRcdFx0XHRpZiBwYS5yZXNbcl0gPT0gJzEnIHRoZW4gcyArPSBcIiA9IDAuNSAqICN7Zy50eHRUIHBiLmVsbywgNywgUklHSFR9XCJcclxuXHRcdFx0XHRpZiBwYS5yZXNbcl0gPT0gJzInIHRoZW4gcyArPSBcIiA9ICN7Zy50eHRUIHBiLmVsbywgNywgUklHSFR9XCJcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdGcuaGVscCA9IHNcclxuXHRcdGVsc2VcclxuXHRcdFx0Zy5oZWxwID0gXCJcIlxyXG5cclxuXHRtb3VzZVdoZWVsICAgOiAoZXZlbnQgKS0+IEBsaXN0YS5tb3VzZVdoZWVsIGV2ZW50XHJcblx0bW91c2VQcmVzc2VkIDogKGV2ZW50KSAtPiBAbGlzdGEubW91c2VQcmVzc2VkIGV2ZW50XHJcblx0a2V5UHJlc3NlZCAgIDogKGV2ZW50KSAtPiBAYnV0dG9uc1trZXldLmNsaWNrKClcclxuXHJcblx0ZHJhdyA6IC0+XHJcblx0XHRmaWxsICd3aGl0ZSdcclxuXHRcdEBzaG93SGVhZGVyIEB0LnJvdW5kLTFcclxuXHRcdEBsaXN0YS5kcmF3KClcclxuXHRcdGZvciBrZXksYnV0dG9uIG9mIEBidXR0b25zXHJcblx0XHRcdGJ1dHRvbi5kcmF3KClcclxuXHRcdHRleHRBbGlnbiBMRUZUXHJcblx0XHR0ZXh0IGcuaGVscCwgMTAsIDMqZy5aT09NW2cuc3RhdGVdXHJcblxyXG5cdHNob3cgOiAocyx4LHksYmcsZmcpIC0+XHJcblx0XHRmaWxsIGJnXHJcblx0XHRyZWN0IHgsIHksIDEuNiAqIGcuWk9PTVtnLnN0YXRlXSwgMC45ICogZy5aT09NW2cuc3RhdGVdXHJcblx0XHRmaWxsIGZnXHJcblx0XHRAdHh0IHMsIHgsIHkrMSwgIENFTlRFUlxyXG5cclxuXHRsaWdodGJ1bGIgOiAoaWQsIGNvbG9yLCB4LCB5LCByZXN1bHQsIG9wcG9uZW50KSAtPlxyXG5cdFx0cHVzaCgpXHJcblx0XHRyZWN0TW9kZSAgQ0VOVEVSXHJcblx0XHRzID0gMSArIG9wcG9uZW50XHJcblx0XHRpZiBvcHBvbmVudCA9PSBnLlBBVVNFIHRoZW4gQHNob3cgXCIgUCBcIix4LHksXCJncmF5XCIsJ3llbGxvdydcclxuXHRcdGlmIG9wcG9uZW50ID09IGcuQllFICAgdGhlbiBAc2hvdyBcIkJZRVwiLHgseSxcImdyZWVuXCIsJ3llbGxvdydcclxuXHRcdGlmIG9wcG9uZW50ID49IDBcclxuXHRcdFx0cmVzdWx0ID0gJzAxMicuaW5kZXhPZiByZXN1bHRcclxuXHRcdFx0QHNob3cgMStvcHBvbmVudCwgeCwgeSwgJ3JlZCBncmF5IGdyZWVuJy5zcGxpdCgnICcpW3Jlc3VsdF0sIHtiOidibGFjaycsICcgJzoneWVsbG93Jywgdzond2hpdGUnfVtjb2xvcl1cclxuXHRcdHBvcCgpXHJcblxyXG5cdG1ha2UgOiAocmVzLGhlYWRlcikgLT5cclxuXHRcdGlmIEB0LnBhaXJzLmxlbmd0aCA9PSAwIHRoZW4gcmVzLnB1c2ggXCJUaGlzIFJPVU5EIGNhbid0IGJlIHBhaXJlZCEgKFRvbyBtYW55IHJvdW5kcylcIlxyXG5cclxuXHRcdHJlcy5wdXNoIFwiU1RBTkRJTkdTXCIgKyBoZWFkZXJcclxuXHRcdHJlcy5wdXNoIFwiXCJcclxuXHJcblx0XHRoZWFkZXIgPSBcIlwiXHJcblx0XHRoZWFkZXIgKz0gICAgICAgZy50eHRUIFwiUG9zXCIsICAgMywgIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUICdJZCcsICAgIDMsICBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIkVsbzBcIiwgIDQsICBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIk5hbWVcIiwgMjUsICBMRUZUXHJcblx0XHRmb3IgciBpbiByYW5nZSBAdC5yb3VuZFxyXG5cdFx0XHRoZWFkZXIgKz0gZy50eHRUIFwiI3tyKzF9XCIsICA2LCBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCBcIlF1YWxpdHlcIiwgMTEsIFJJR0hUXHJcblx0XHRcclxuXHRcdGZvciBwbGF5ZXIsaSBpbiBAcGxheWVyc0J5UGVyZm9ybWFuY2VcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSAwIHRoZW4gcmVzLnB1c2ggaGVhZGVyXHJcblx0XHRcdHMgPSBcIlwiXHJcblx0XHRcdHMgKz0gICAgICAgZy50eHRUICgxK2kpLnRvU3RyaW5nKCksICAgICAgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwbGF5ZXIuaWQpLnRvU3RyaW5nKCksICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGxheWVyLmVsby50b1N0cmluZygpLCAgICA0LCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGxheWVyLm5hbWUsICAgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0cyArPSAnICdcclxuXHRcdFx0Zm9yIHIgaW4gcmFuZ2UgQHQucm91bmRcclxuXHRcdFx0XHRpZiBwbGF5ZXIub3BwW3JdID09IC0yIHRoZW4gcyArPSAnICAgIFAgJ1xyXG5cdFx0XHRcdGlmIHBsYXllci5vcHBbcl0gPT0gLTEgdGhlbiBzICs9ICcgICBCWUUnXHJcblx0XHRcdFx0aWYgcGxheWVyLm9wcFtyXSA+PSAwXHJcblx0XHRcdFx0XHRzICs9IGcudHh0VCBcIiN7MStwbGF5ZXIub3BwW3JdfSN7Zy5SSU5HU1twbGF5ZXIuY29sW3JdWzBdXX0je1wiMMK9MVwiW3BsYXllci5yZXNbcl1dfVwiLCA2LCAgUklHSFRcdFx0XHRcclxuXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIChwbGF5ZXIuY2hhbmdlKEB0LnJvdW5kKzEpKS50b0ZpeGVkKDYpLCAgMTAsICBSSUdIVFxyXG5cdFx0XHRyZXMucHVzaCBzIFxyXG5cdFx0XHRpZiBpICUgQHQucHBwID09IEB0LnBwcC0xIHRoZW4gcmVzLnB1c2ggXCJcXGZcIlxyXG5cdFx0cmVzLnB1c2ggXCJcXGZcIiJdfQ==
//# sourceURL=c:\github\ELO-Pairings\coffee\page_standings.coffee