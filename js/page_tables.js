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
      pa = this.t.playersByID[a];
      pb = this.t.playersByID[b];
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
    if (random() < 0.1) {
      return 1; // draw
    }
    if (random() > g.F(diff)) {
      return 0;
    } else {
      return 2;
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
    pa = this.t.playersByID[a];
    pb = this.t.playersByID[b];
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
      pa = this.t.playersByID[a];
      pb = this.t.playersByID[b];
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
    pa = this.t.playersByID[a];
    pb = this.t.playersByID[b];
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
      pa = this.t.playersByID[a];
      pb = this.t.playersByID[b];
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
      pa = this.t.playersByID[a];
      pb = this.t.playersByID[b];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV90YWJsZXMuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3RhYmxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsT0FBQTtFQUFBOzs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxJQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsTUFBVDtFQUFnQixNQUFoQjtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLEtBQVQ7Q0FBQSxNQUFBOztBQUVBLE9BQUEsR0FBVSxRQUFBLENBQUMsRUFBRCxFQUFJLEVBQUosQ0FBQTtBQUNWLE1BQUEsQ0FBQSxFQUFBO0VBQUMsQ0FBQSxHQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBRDtFQUNYLENBQUEsR0FBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUQ7RUFDWCxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQWUsV0FBTyxFQUF0Qjs7RUFDQSxJQUFHLENBQUEsS0FBSyxDQUFSO0FBQWUsV0FBTyxFQUF0Qjs7RUFDQSxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQWUsV0FBTyxFQUF0Qjs7QUFMUzs7QUFPVixPQUFBLElBQWEsU0FBTixNQUFBLE9BQUEsUUFBcUIsS0FBckI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUFlZCxDQUFBLGVBQUEsQ0FBQTtRQWlEQSxDQUFBLG1CQUFBLENBQUE7SUE3REMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsU0FBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxF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QUFTLElBQVQsR0FBL0I7T0FBQSxNQUFBOzZCQUFBOztJQVBELENBQUE7O0VBSE07O0FBekdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyxwcmludCxyYW5nZSxzY2FsZXgsc2NhbGV5IH0gZnJvbSAnLi9nbG9iYWxzLmpzJyBcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZS5qcycgXHJcbmltcG9ydCB7IEJ1dHRvbixzcHJlYWQgfSBmcm9tICcuL2J1dHRvbi5qcycgIFxyXG5pbXBvcnQgeyBMaXN0YSB9IGZyb20gJy4vbGlzdGEuanMnIFxyXG5cclxuY29tcGFyZSA9IChwYSxwYikgLT5cclxuXHRhID0gcGEubmFtZVswXVxyXG5cdGIgPSBwYi5uYW1lWzBdXHJcblx0aWYgYSA+IGIgIHRoZW4gcmV0dXJuIDBcclxuXHRpZiBhID09IGIgdGhlbiByZXR1cm4gMVxyXG5cdGlmIGEgPCBiICB0aGVuIHJldHVybiAyXHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVzIGV4dGVuZHMgUGFnZVxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IC0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0QGJ1dHRvbnMuQXJyb3dMZWZ0ICA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuU1RBTkRJTkdTXHJcblx0XHRAYnV0dG9ucy5BcnJvd1JpZ2h0ID0gbmV3IEJ1dHRvbiAnJywgJycsICgpID0+IGcuc2V0U3RhdGUgZy5OQU1FU1xyXG5cclxuXHRcdEBidXR0b25zLnAgICAgICA9IG5ldyBCdXR0b24gJ1BhaXInLCAgICdQID0gUGVyZm9ybSBwYWlyaW5nIG5vdycsKCkgPT4gQHQubG90dGEoKVxyXG5cdFx0QGJ1dHRvbnMuSzAgICAgID0gbmV3IEJ1dHRvbiAnMCcsICAgICAgJzAgPSBXaGl0ZSBMb3NzJywgICAgICAgICAoKSA9PiBAaGFuZGxlUmVzdWx0ICcwJ1xyXG5cdFx0QGJ1dHRvbnNbJyAnXSAgID0gbmV3IEJ1dHRvbiAnwr0nLCAgICAgICdzcGFjZSA9IERyYXcnLCAgICAgICAgICAgKCkgPT4gQGhhbmRsZVJlc3VsdCAnICdcclxuXHRcdEBidXR0b25zLksxICAgICA9IG5ldyBCdXR0b24gJzEnLCAgICAgICcxID0gV2hpdGUgV2luJywgICAgICAgICAgKCkgPT4gQGhhbmRsZVJlc3VsdCAnMSdcclxuXHRcdEBidXR0b25zLkRlbGV0ZSA9IG5ldyBCdXR0b24gJ0RlbGV0ZScsICdkZWxldGUgPSBSZW1vdmUgcmVzdWx0JywgKCkgPT4gQGhhbmRsZURlbGV0ZSgpXHJcblx0XHRAYnV0dG9ucy5yICAgICAgPSBuZXcgQnV0dG9uICdSYW5kb20nLCAnUiA9IFJhbmRvbSByZXN1bHRzJywgICAgICgpID0+IEByYW5kb21SZXN1bHQoKVxyXG5cclxuXHRcdEBidXR0b25zLnQuYWN0aXZlID0gZmFsc2VcclxuXHJcblx0c2V0TGlzdGEgOiA9PlxyXG5cdFx0IyBwcmludCAnTGlzdGEnLCBnLnRvdXJuYW1lbnQucGFpcnMubGVuZ3RoXHJcblx0XHRoZWFkZXIgPSBcIlwiXHJcblx0XHRoZWFkZXIgKz0gICAgICAgZy50eHRUICdUYmwnLCAgICAzLCBSSUdIVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCAnRWxvJywgICAgNCwgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ1doaXRlJywgMjUsIExFRlRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ1Jlc3VsdCcsIDcsIENFTlRFUlxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCAnQmxhY2snLCAyNSwgTEVGVFxyXG5cdFx0aGVhZGVyICs9ICcgJyArIGcudHh0VCAnRWxvJywgICAgNCwgUklHSFRcclxuXHJcblx0XHRAbGlzdGEgPSBuZXcgTGlzdGEgQHQucGFpcnMsIGhlYWRlciwgQGJ1dHRvbnMsIChwYWlyLGluZGV4LHBvcykgPT5cclxuXHRcdFx0W2EsYl0gPSBwYWlyXHJcblx0XHRcdHBhID0gQHQucGxheWVyc0J5SURbYV1cclxuXHRcdFx0cGIgPSBAdC5wbGF5ZXJzQnlJRFtiXVxyXG5cdFx0XHRib3RoID0gaWYgcGEucmVzLmxlbmd0aCA9PSBwYS5jb2wubGVuZ3RoIHRoZW4gZy5wckJvdGggXy5sYXN0KHBhLnJlcykgZWxzZSBcIiAgIC0gICBcIlxyXG5cclxuXHRcdFx0bnIgPSBpbmRleCArIDFcclxuXHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0cyArPSAgICAgICBnLnR4dFQgKHBvcysxKS50b1N0cmluZygpLCAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGEuZWxvLnRvU3RyaW5nKCksICA0LCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGEubmFtZSwgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBib3RoLCAgICAgICAgICAgICAgIDcsICBDRU5URVJcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGIubmFtZSwgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwYi5lbG8udG9TdHJpbmcoKSwgIDQsICBSSUdIVFxyXG5cdFx0XHRzXHJcblxyXG5cdFx0QGxpc3RhLmVycm9ycyA9IFtdXHJcblx0XHRzcHJlYWQgQGJ1dHRvbnMsIDEwLCBAeSwgQGhcclxuXHRcdEBzZXRBY3RpdmUoKVxyXG5cclxuXHRtb3VzZVdoZWVsICAgOiAoZXZlbnQgKS0+IEBsaXN0YS5tb3VzZVdoZWVsIGV2ZW50XHJcblx0bW91c2VQcmVzc2VkIDogKGV2ZW50KSAtPiBAbGlzdGEubW91c2VQcmVzc2VkIGV2ZW50XHJcblx0a2V5UHJlc3NlZCAgIDogKGV2ZW50LGtleSkgLT4gQGJ1dHRvbnNba2V5XS5jbGljaygpXHJcblxyXG5cdGRyYXcgOiAtPlxyXG5cdFx0ZmlsbCAnd2hpdGUnXHJcblx0XHRAc2hvd0hlYWRlciBAdC5yb3VuZFxyXG5cdFx0Zm9yIGtleSxidXR0b24gb2YgQGJ1dHRvbnNcclxuXHRcdFx0YnV0dG9uLmRyYXcoKVxyXG5cdFx0QGxpc3RhLmRyYXcoKVxyXG5cclxuXHRlbG9fcHJvYmFiaWxpdGllcyA6IChkaWZmKSAtPlxyXG5cdFx0aWYgcmFuZG9tKCkgPCAwLjEgdGhlbiByZXR1cm4gMSAjIGRyYXdcclxuXHRcdGlmIHJhbmRvbSgpID4gZy5GIGRpZmYgdGhlbiAwIGVsc2UgMlxyXG5cdFxyXG5cdHNldEFjdGl2ZSA6IC0+XHJcblx0XHRAYnV0dG9ucy5wLmFjdGl2ZSA9IGcuY2FsY01pc3NpbmcoKSA9PSAwXHJcblx0XHRpZiBnLnBhZ2VzW2cuQUNUSVZFXSB0aGVuIGcucGFnZXNbZy5BQ1RJVkVdLmJ1dHRvbnMucC5hY3RpdmUgPSBAYnV0dG9ucy5wLmFjdGl2ZVxyXG5cclxuXHRoYW5kbGVSZXN1bHQgOiAoa2V5KSA9PlxyXG5cdFx0W2EsYl0gPSBAdC5wYWlyc1tAbGlzdGEuY3VycmVudFJvd11cclxuXHRcdHBhID0gQHQucGxheWVyc0J5SURbYV1cclxuXHRcdHBiID0gQHQucGxheWVyc0J5SURbYl1cclxuXHRcdGluZGV4ID0gJzAgMScuaW5kZXhPZiBrZXlcclxuXHRcdGNoID0gXCIwMTJcIltpbmRleF1cclxuXHRcdGlmIHBhLnJlcy5sZW5ndGggPT0gcGEuY29sLmxlbmd0aCBcclxuXHRcdFx0aWYgY2ggIT0gXy5sYXN0IHBhLnJlcyB0aGVuIEBsaXN0YS5lcnJvcnMucHVzaCBAbGlzdGEuY3VycmVudFJvd1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBwYS5yZXMubGVuZ3RoIDwgcGEuY29sLmxlbmd0aCB0aGVuIHBhLnJlcyArPSBcIjAxMlwiW2luZGV4XVxyXG5cdFx0XHRpZiBwYi5yZXMubGVuZ3RoIDwgcGIuY29sLmxlbmd0aCB0aGVuIHBiLnJlcyArPSBcIjIxMFwiW2luZGV4XVxyXG5cdFx0QGxpc3RhLmN1cnJlbnRSb3cgPSAoQGxpc3RhLmN1cnJlbnRSb3cgKyAxKSAlJSBAdC5wYWlycy5sZW5ndGhcclxuXHRcdEBzZXRBY3RpdmUoKVxyXG5cclxuXHRyYW5kb21SZXN1bHQgOiAtPlxyXG5cdFx0Zm9yIFthLGJdIGluIEB0LnBhaXJzXHJcblx0XHRcdHBhID0gQHQucGxheWVyc0J5SURbYV1cclxuXHRcdFx0cGIgPSBAdC5wbGF5ZXJzQnlJRFtiXVxyXG5cdFx0XHRyZXMgPSBAZWxvX3Byb2JhYmlsaXRpZXMgcGEuZWxvIC0gcGIuZWxvXHJcblx0XHRcdGlmIHBhLnJlcy5sZW5ndGggPCBwYS5jb2wubGVuZ3RoIFxyXG5cdFx0XHRcdHBhLnJlcyArPSByZXNcclxuXHRcdFx0XHRwYi5yZXMgKz0gMiAtIHJlc1xyXG5cdFx0QHNldEFjdGl2ZSgpXHJcblxyXG5cdGhhbmRsZURlbGV0ZSA6IC0+XHJcblx0XHRpID0gQGxpc3RhLmN1cnJlbnRSb3dcclxuXHRcdFthLGJdID0gQHQucGFpcnNbaV1cclxuXHRcdHBhID0gQHQucGxheWVyc0J5SURbYV1cclxuXHRcdHBiID0gQHQucGxheWVyc0J5SURbYl1cclxuXHRcdEBsaXN0YS5lcnJvcnMgPSAoZSBmb3IgZSBpbiBAbGlzdGEuZXJyb3JzIHdoZW4gZSAhPSBpKVxyXG5cdFx0aWYgcGEucmVzLmxlbmd0aCA9PSBwYi5yZXMubGVuZ3RoXHJcblx0XHRcdFthLGJdID0gQHQucGFpcnNbaV1cclxuXHRcdFx0cGEgPSBAdC5wbGF5ZXJzQnlJRFthXVxyXG5cdFx0XHRwYiA9IEB0LnBsYXllcnNCeUlEW2JdXHJcblx0XHRcdHBhLnJlcyA9IHBhLnJlcy5zdWJzdHJpbmcgMCxwYS5yZXMubGVuZ3RoLTFcclxuXHRcdFx0cGIucmVzID0gcGIucmVzLnN1YnN0cmluZyAwLHBiLnJlcy5sZW5ndGgtMVxyXG5cdFx0QGxpc3RhLmN1cnJlbnRSb3cgPSAoQGxpc3RhLmN1cnJlbnRSb3cgKyAxKSAlJSBAdC5wYWlycy5sZW5ndGhcclxuXHRcdEBzZXRBY3RpdmUoKVxyXG5cclxuXHRtYWtlIDogKHJlcyxoZWFkZXIpIC0+XHJcblx0XHRyZXMucHVzaCBcIlRBQkxFU1wiICsgaGVhZGVyXHJcblx0XHRyZXMucHVzaCBcIlwiXHJcblx0XHRmb3IgaSBpbiByYW5nZSBAdC5wYWlycy5sZW5ndGhcclxuXHRcdFx0W2EsYl0gPSBAdC5wYWlyc1tpXVxyXG5cdFx0XHRpZiBpICUgQHQudHBwID09IDAgdGhlbiByZXMucHVzaCBcIlRhYmxlICAgICAgI3tnLlJJTkdTLnd9XCIucGFkRW5kKDI1KSArIF8ucGFkKFwiXCIsMjgrMTApICsgXCIje2cuUklOR1MuYn1cIiAjLnBhZEVuZCgyNSlcclxuXHRcdFx0cGEgPSBAdC5wbGF5ZXJzQnlJRFthXVxyXG5cdFx0XHRwYiA9IEB0LnBsYXllcnNCeUlEW2JdXHJcblx0XHRcdHJlcy5wdXNoIFwiXCJcclxuXHRcdFx0cmVzLnB1c2ggXy5wYWQoaSsxLDYpICsgcGEuZWxvICsgJyAnICsgZy50eHRUKHBhLm5hbWUsIDI1LCAgTEVGVCkgKyAnICcgKyBfLnBhZChcInxfX19ffCAtIHxfX19ffFwiLDIwKSArICcgJyArIHBiLmVsbyArICcgJyArIGcudHh0VChwYi5uYW1lLCAyNSwgIExFRlQpXHJcblx0XHRcdGlmIGkgJSBAdC50cHAgPT0gQHQudHBwLTEgdGhlbiByZXMucHVzaCBcIlxcZlwiIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\page_tables.coffee