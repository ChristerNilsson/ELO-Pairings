// Generated by CoffeeScript 2.7.0
var compare,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } },
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

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

compare = function(pa, pb) {
  var a, b;
  a = pa.name[0];
  b = pb.name[0];
  if (a > b) {
    return 0;
  }
  if (a === b) {
    return 1;
  }
  if (a < b) {
    return 2;
  }
};

export var Tables = class Tables extends Page {
  constructor() {
    super();
    this.setLista = this.setLista.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.buttons.ArrowLeft = new Button('', '', () => {
      return g.setState(g.STANDINGS);
    });
    this.buttons.ArrowRight = new Button('', '', () => {
      return g.setState(g.NAMES);
    });
    this.buttons.p = new Button('Pair', 'P = Perform pairing now', () => {
      return this.t.lotta();
    });
    this.buttons.K0 = new Button('0', '0 = White Loss', () => {
      return this.handleResult('0');
    });
    this.buttons[' '] = new Button('½', 'space = Draw', () => {
      return this.handleResult(' ');
    });
    this.buttons.K1 = new Button('1', '1 = White Win', () => {
      return this.handleResult('1');
    });
    this.buttons.Delete = new Button('Delete', 'delete = Remove result', () => {
      return this.handleDelete();
    });
    this.buttons.r = new Button('Random', 'R = Random results', () => {
      return this.randomResult();
    });
    this.buttons.t.active = false;
  }

  setLista() {
    var header;
    boundMethodCheck(this, Tables);
    // print 'Lista', g.tournament.pairs.length
    header = "";
    header += g.txtT('Tbl', 3, RIGHT);
    header += ' ' + g.txtT('Elo', 4, RIGHT);
    header += ' ' + g.txtT('White', 25, LEFT);
    header += ' ' + g.txtT('Result', 7, CENTER);
    header += ' ' + g.txtT('Black', 25, LEFT);
    header += ' ' + g.txtT('Elo', 4, RIGHT);
    this.lista = new Lista(this.t.pairs, header, this.buttons, (pair, index, pos) => {
      var a, b, both, nr, pa, pb, s;
      [a, b] = pair;
      pa = this.t.persons[a];
      pb = this.t.persons[b];
      both = pa.res.length === pa.col.length ? g.prBoth(_.last(pa.res)) : "   -   ";
      nr = index + 1;
      s = "";
      s += g.txtT((pos + 1).toString(), 3, RIGHT);
      s += ' ' + g.txtT(pa.elo.toString(), 4, RIGHT);
      s += ' ' + g.txtT(pa.name, 25, LEFT);
      s += ' ' + g.txtT(both, 7, CENTER);
      s += ' ' + g.txtT(pb.name, 25, LEFT);
      s += ' ' + g.txtT(pb.elo.toString(), 4, RIGHT);
      return s;
    });
    this.lista.errors = [];
    spread(this.buttons, 10, this.y, this.h);
    return this.setActive();
  }

  mouseWheel(event) {
    return this.lista.mouseWheel(event);
  }

  mousePressed(event) {
    return this.lista.mousePressed(event);
  }

  keyPressed(event, key) {
    return this.buttons[key].click();
  }

  draw() {
    var button, key, ref;
    fill('white');
    this.showHeader(this.t.round);
    ref = this.buttons;
    for (key in ref) {
      button = ref[key];
      button.draw();
    }
    return this.lista.draw();
  }

  elo_probabilities(diff) {
    var prob;
    if (2 * this.t.round > abs(diff)) {
      return 1; // draw
    }
    prob = g.F(diff);
    // print prob, diff
    if (random() > prob) {
      return 2;
    } else {
      return 0;
    }
  }

  setActive() {
    this.buttons.p.active = g.calcMissing() === 0;
    if (g.pages[g.ACTIVE]) {
      return g.pages[g.ACTIVE].buttons.p.active = this.buttons.p.active;
    }
  }

  handleResult(key) {
    var a, b, ch, index, pa, pb;
    boundMethodCheck(this, Tables);
    [a, b] = this.t.pairs[this.lista.currentRow];
    pa = this.t.persons[a];
    pb = this.t.persons[b];
    index = '0 1'.indexOf(key);
    ch = "012"[index];
    if (pa.res.length === pa.col.length) {
      if (ch !== _.last(pa.res)) {
        this.lista.errors.push(this.lista.currentRow);
      }
    } else {
      if (pa.res.length < pa.col.length) {
        pa.res += "012"[index];
      }
      if (pb.res.length < pb.col.length) {
        pb.res += "210"[index];
      }
    }
    this.lista.currentRow = modulo(this.lista.currentRow + 1, this.t.pairs.length);
    return this.setActive();
  }

  randomResult() {
    var a, b, j, len, pa, pb, ref, res;
    ref = this.t.pairs;
    for (j = 0, len = ref.length; j < len; j++) {
      [a, b] = ref[j];
      pa = this.t.persons[a];
      pb = this.t.persons[b];
      res = this.elo_probabilities(pa.elo - pb.elo);
      if (pa.res.length < pa.col.length) {
        pa.res += res;
        pb.res += 2 - res;
      }
    }
    return this.setActive();
  }

  handleDelete() {
    var a, b, e, i, pa, pb;
    i = this.lista.currentRow;
    [a, b] = this.t.pairs[i];
    pa = this.t.persons[a];
    pb = this.t.persons[b];
    this.lista.errors = (function() {
      var j, len, ref, results;
      ref = this.lista.errors;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        e = ref[j];
        if (e !== i) {
          results.push(e);
        }
      }
      return results;
    }).call(this);
    if (pa.res.length === pb.res.length) {
      [a, b] = this.t.pairs[i];
      pa = this.t.persons[a];
      pb = this.t.persons[b];
      pa.res = pa.res.substring(0, pa.res.length - 1);
      pb.res = pb.res.substring(0, pb.res.length - 1);
    }
    this.lista.currentRow = modulo(this.lista.currentRow + 1, this.t.pairs.length);
    return this.setActive();
  }

  make(res, header) {
    var a, b, i, j, len, pa, pb, ref, results;
    res.push("TABLES" + header);
    res.push("");
    ref = range(this.t.pairs.length);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      [a, b] = this.t.pairs[i];
      if (i % this.t.tpp === 0) {
        res.push(`Table      ${g.RINGS.w}`.padEnd(25) + _.pad("", 28 + 10) + `${g.RINGS.b}`);
      }
      pa = this.t.persons[a];
      pb = this.t.persons[b];
      res.push("");
      res.push(_.pad(i + 1, 6) + pa.elo + ' ' + g.txtT(pa.name, 25, LEFT) + ' ' + _.pad("|____| - |____|", 20) + ' ' + pb.elo + ' ' + g.txtT(pb.name, 25, LEFT));
      if (i % this.t.tpp === this.t.tpp - 1) {
        results.push(res.push("\f"));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV90YWJsZXMuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3RhYmxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsT0FBQTtFQUFBOzs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxJQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsTUFBVDtFQUFnQixNQUFoQjtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLEtBQVQ7Q0FBQSxNQUFBOztBQUVBLE9BQUEsR0FBVSxRQUFBLENBQUMsRUFBRCxFQUFJLEVBQUosQ0FBQTtBQUNWLE1BQUEsQ0FBQSxFQUFBO0VBQUMsQ0FBQSxHQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBRDtFQUNYLENBQUEsR0FBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUQ7RUFDWCxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQWUsV0FBTyxFQUF0Qjs7RUFDQSxJQUFHLENBQUEsS0FBSyxDQUFSO0FBQWUsV0FBTyxFQUF0Qjs7RUFDQSxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQWUsV0FBTyxFQUF0Qjs7QUFMUzs7QUFPVixPQUFBLElBQWEsU0FBTixNQUFBLE9BQUEsUUFBcUIsS0FBckI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUFlZCxDQUFBLGVBQUEsQ0FBQTtRQW1EQSxDQUFBLG1CQUFBLENBQUE7SUEvREMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsU0FBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxF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LENBQUEsQ0FBQyxDQUFDLEdBQUgsR0FBTyxDQUF4QjtxQkFBK0IsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEdBQS9CO09BQUEsTUFBQTs2QkFBQTs7SUFQRCxDQUFBOztFQUhNOztBQTNHRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3BhZ2UuanMnIFxyXG5pbXBvcnQgeyBCdXR0b24sc3ByZWFkIH0gZnJvbSAnLi9idXR0b24uanMnICBcclxuaW1wb3J0IHsgTGlzdGEgfSBmcm9tICcuL2xpc3RhLmpzJyBcclxuXHJcbmNvbXBhcmUgPSAocGEscGIpIC0+XHJcblx0YSA9IHBhLm5hbWVbMF1cclxuXHRiID0gcGIubmFtZVswXVxyXG5cdGlmIGEgPiBiICB0aGVuIHJldHVybiAwXHJcblx0aWYgYSA9PSBiIHRoZW4gcmV0dXJuIDFcclxuXHRpZiBhIDwgYiAgdGhlbiByZXR1cm4gMlxyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlcyBleHRlbmRzIFBhZ2VcclxuXHJcblx0Y29uc3RydWN0b3IgOiAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cclxuXHRcdEBidXR0b25zLkFycm93TGVmdCAgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLlNUQU5ESU5HU1xyXG5cdFx0QGJ1dHRvbnMuQXJyb3dSaWdodCA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuTkFNRVNcclxuXHJcblx0XHRAYnV0dG9ucy5wICAgICAgPSBuZXcgQnV0dG9uICdQYWlyJywgICAnUCA9IFBlcmZvcm0gcGFpcmluZyBub3cnLCgpID0+IEB0LmxvdHRhKClcclxuXHRcdEBidXR0b25zLkswICAgICA9IG5ldyBCdXR0b24gJzAnLCAgICAgICcwID0gV2hpdGUgTG9zcycsICAgICAgICAgKCkgPT4gQGhhbmRsZVJlc3VsdCAnMCdcclxuXHRcdEBidXR0b25zWycgJ10gICA9IG5ldyBCdXR0b24gJ8K9JywgICAgICAnc3BhY2UgPSBEcmF3JywgICAgICAgICAgICgpID0+IEBoYW5kbGVSZXN1bHQgJyAnXHJcblx0XHRAYnV0dG9ucy5LMSAgICAgPSBuZXcgQnV0dG9uICcxJywgICAgICAnMSA9IFdoaXRlIFdpbicsICAgICAgICAgICgpID0+IEBoYW5kbGVSZXN1bHQgJzEnXHJcblx0XHRAYnV0dG9ucy5EZWxldGUgPSBuZXcgQnV0dG9uICdEZWxldGUnLCAnZGVsZXRlID0gUmVtb3ZlIHJlc3VsdCcsICgpID0+IEBoYW5kbGVEZWxldGUoKVxyXG5cdFx0QGJ1dHRvbnMuciAgICAgID0gbmV3IEJ1dHRvbiAnUmFuZG9tJywgJ1IgPSBSYW5kb20gcmVzdWx0cycsICAgICAoKSA9PiBAcmFuZG9tUmVzdWx0KClcclxuXHJcblx0XHRAYnV0dG9ucy50LmFjdGl2ZSA9IGZhbHNlXHJcblxyXG5cdHNldExpc3RhIDogPT5cclxuXHRcdCMgcHJpbnQgJ0xpc3RhJywgZy50b3VybmFtZW50LnBhaXJzLmxlbmd0aFxyXG5cdFx0aGVhZGVyID0gXCJcIlxyXG5cdFx0aGVhZGVyICs9ICAgICAgIGcudHh0VCAnVGJsJywgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ0VsbycsICAgIDQsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUICdXaGl0ZScsIDI1LCBMRUZUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUICdSZXN1bHQnLCA3LCBDRU5URVJcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ0JsYWNrJywgMjUsIExFRlRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ0VsbycsICAgIDQsIFJJR0hUXHJcblxyXG5cdFx0QGxpc3RhID0gbmV3IExpc3RhIEB0LnBhaXJzLCBoZWFkZXIsIEBidXR0b25zLCAocGFpcixpbmRleCxwb3MpID0+XHJcblx0XHRcdFthLGJdID0gcGFpclxyXG5cdFx0XHRwYSA9IEB0LnBlcnNvbnNbYV1cclxuXHRcdFx0cGIgPSBAdC5wZXJzb25zW2JdXHJcblx0XHRcdGJvdGggPSBpZiBwYS5yZXMubGVuZ3RoID09IHBhLmNvbC5sZW5ndGggdGhlbiBnLnByQm90aCBfLmxhc3QocGEucmVzKSBlbHNlIFwiICAgLSAgIFwiXHJcblxyXG5cdFx0XHRuciA9IGluZGV4ICsgMVxyXG5cdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRzICs9ICAgICAgIGcudHh0VCAocG9zKzEpLnRvU3RyaW5nKCksIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwYS5lbG8udG9TdHJpbmcoKSwgIDQsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwYS5uYW1lLCAgICAgICAgICAgMjUsICBMRUZUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIGJvdGgsICAgICAgICAgICAgICAgNywgIENFTlRFUlxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwYi5uYW1lLCAgICAgICAgICAgMjUsICBMRUZUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBiLmVsby50b1N0cmluZygpLCAgNCwgIFJJR0hUXHJcblx0XHRcdHNcclxuXHJcblx0XHRAbGlzdGEuZXJyb3JzID0gW11cclxuXHRcdHNwcmVhZCBAYnV0dG9ucywgMTAsIEB5LCBAaFxyXG5cdFx0QHNldEFjdGl2ZSgpXHJcblxyXG5cdG1vdXNlV2hlZWwgICA6IChldmVudCApLT4gQGxpc3RhLm1vdXNlV2hlZWwgZXZlbnRcclxuXHRtb3VzZVByZXNzZWQgOiAoZXZlbnQpIC0+IEBsaXN0YS5tb3VzZVByZXNzZWQgZXZlbnRcclxuXHRrZXlQcmVzc2VkICAgOiAoZXZlbnQsa2V5KSAtPiBAYnV0dG9uc1trZXldLmNsaWNrKClcclxuXHJcblx0ZHJhdyA6IC0+XHJcblx0XHRmaWxsICd3aGl0ZSdcclxuXHRcdEBzaG93SGVhZGVyIEB0LnJvdW5kXHJcblx0XHRmb3Iga2V5LGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG5cdFx0XHRidXR0b24uZHJhdygpXHJcblx0XHRAbGlzdGEuZHJhdygpXHJcblxyXG5cdGVsb19wcm9iYWJpbGl0aWVzIDogKGRpZmYpIC0+XHJcblx0XHRpZiAyICogQHQucm91bmQgPiBhYnMgZGlmZiB0aGVuIHJldHVybiAxICMgZHJhd1xyXG5cdFx0cHJvYiA9IGcuRiBkaWZmXHJcblx0XHQjIHByaW50IHByb2IsIGRpZmZcclxuXHRcdGlmIHJhbmRvbSgpID4gcHJvYiB0aGVuIDIgZWxzZSAwXHJcblx0XHJcblx0c2V0QWN0aXZlIDogLT5cclxuXHRcdEBidXR0b25zLnAuYWN0aXZlID0gZy5jYWxjTWlzc2luZygpID09IDBcclxuXHRcdGlmIGcucGFnZXNbZy5BQ1RJVkVdIHRoZW4gZy5wYWdlc1tnLkFDVElWRV0uYnV0dG9ucy5wLmFjdGl2ZSA9IEBidXR0b25zLnAuYWN0aXZlXHJcblxyXG5cdGhhbmRsZVJlc3VsdCA6IChrZXkpID0+XHJcblx0XHRbYSxiXSA9IEB0LnBhaXJzW0BsaXN0YS5jdXJyZW50Um93XVxyXG5cdFx0cGEgPSBAdC5wZXJzb25zW2FdXHJcblx0XHRwYiA9IEB0LnBlcnNvbnNbYl1cclxuXHRcdGluZGV4ID0gJzAgMScuaW5kZXhPZiBrZXlcclxuXHRcdGNoID0gXCIwMTJcIltpbmRleF1cclxuXHRcdGlmIHBhLnJlcy5sZW5ndGggPT0gcGEuY29sLmxlbmd0aCBcclxuXHRcdFx0aWYgY2ggIT0gXy5sYXN0IHBhLnJlcyB0aGVuIEBsaXN0YS5lcnJvcnMucHVzaCBAbGlzdGEuY3VycmVudFJvd1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBwYS5yZXMubGVuZ3RoIDwgcGEuY29sLmxlbmd0aCB0aGVuIHBhLnJlcyArPSBcIjAxMlwiW2luZGV4XVxyXG5cdFx0XHRpZiBwYi5yZXMubGVuZ3RoIDwgcGIuY29sLmxlbmd0aCB0aGVuIHBiLnJlcyArPSBcIjIxMFwiW2luZGV4XVxyXG5cdFx0QGxpc3RhLmN1cnJlbnRSb3cgPSAoQGxpc3RhLmN1cnJlbnRSb3cgKyAxKSAlJSBAdC5wYWlycy5sZW5ndGhcclxuXHRcdEBzZXRBY3RpdmUoKVxyXG5cclxuXHRyYW5kb21SZXN1bHQgOiAtPlxyXG5cdFx0Zm9yIFthLGJdIGluIEB0LnBhaXJzXHJcblx0XHRcdHBhID0gQHQucGVyc29uc1thXVxyXG5cdFx0XHRwYiA9IEB0LnBlcnNvbnNbYl1cclxuXHRcdFx0cmVzID0gQGVsb19wcm9iYWJpbGl0aWVzIHBhLmVsbyAtIHBiLmVsb1xyXG5cdFx0XHRpZiBwYS5yZXMubGVuZ3RoIDwgcGEuY29sLmxlbmd0aCBcclxuXHRcdFx0XHRwYS5yZXMgKz0gcmVzXHJcblx0XHRcdFx0cGIucmVzICs9IDIgLSByZXNcclxuXHRcdEBzZXRBY3RpdmUoKVxyXG5cclxuXHRoYW5kbGVEZWxldGUgOiAtPlxyXG5cdFx0aSA9IEBsaXN0YS5jdXJyZW50Um93XHJcblx0XHRbYSxiXSA9IEB0LnBhaXJzW2ldXHJcblx0XHRwYSA9IEB0LnBlcnNvbnNbYV1cclxuXHRcdHBiID0gQHQucGVyc29uc1tiXVxyXG5cdFx0QGxpc3RhLmVycm9ycyA9IChlIGZvciBlIGluIEBsaXN0YS5lcnJvcnMgd2hlbiBlICE9IGkpXHJcblx0XHRpZiBwYS5yZXMubGVuZ3RoID09IHBiLnJlcy5sZW5ndGhcclxuXHRcdFx0W2EsYl0gPSBAdC5wYWlyc1tpXVxyXG5cdFx0XHRwYSA9IEB0LnBlcnNvbnNbYV1cclxuXHRcdFx0cGIgPSBAdC5wZXJzb25zW2JdXHJcblx0XHRcdHBhLnJlcyA9IHBhLnJlcy5zdWJzdHJpbmcgMCxwYS5yZXMubGVuZ3RoLTFcclxuXHRcdFx0cGIucmVzID0gcGIucmVzLnN1YnN0cmluZyAwLHBiLnJlcy5sZW5ndGgtMVxyXG5cdFx0QGxpc3RhLmN1cnJlbnRSb3cgPSAoQGxpc3RhLmN1cnJlbnRSb3cgKyAxKSAlJSBAdC5wYWlycy5sZW5ndGhcclxuXHRcdEBzZXRBY3RpdmUoKVxyXG5cclxuXHRtYWtlIDogKHJlcyxoZWFkZXIpIC0+XHJcblx0XHRyZXMucHVzaCBcIlRBQkxFU1wiICsgaGVhZGVyXHJcblx0XHRyZXMucHVzaCBcIlwiXHJcblx0XHRmb3IgaSBpbiByYW5nZSBAdC5wYWlycy5sZW5ndGhcclxuXHRcdFx0W2EsYl0gPSBAdC5wYWlyc1tpXVxyXG5cdFx0XHRpZiBpICUgQHQudHBwID09IDAgdGhlbiByZXMucHVzaCBcIlRhYmxlICAgICAgI3tnLlJJTkdTLnd9XCIucGFkRW5kKDI1KSArIF8ucGFkKFwiXCIsMjgrMTApICsgXCIje2cuUklOR1MuYn1cIiAjLnBhZEVuZCgyNSlcclxuXHRcdFx0cGEgPSBAdC5wZXJzb25zW2FdXHJcblx0XHRcdHBiID0gQHQucGVyc29uc1tiXVxyXG5cdFx0XHRyZXMucHVzaCBcIlwiXHJcblx0XHRcdHJlcy5wdXNoIF8ucGFkKGkrMSw2KSArIHBhLmVsbyArICcgJyArIGcudHh0VChwYS5uYW1lLCAyNSwgIExFRlQpICsgJyAnICsgXy5wYWQoXCJ8X19fX3wgLSB8X19fX3xcIiwyMCkgKyAnICcgKyBwYi5lbG8gKyAnICcgKyBnLnR4dFQocGIubmFtZSwgMjUsICBMRUZUKVxyXG5cdFx0XHRpZiBpICUgQHQudHBwID09IEB0LnRwcC0xIHRoZW4gcmVzLnB1c2ggXCJcXGZcIiJdfQ==
//# sourceURL=c:\github\ELO-Pairings\coffee\page_tables.coffee