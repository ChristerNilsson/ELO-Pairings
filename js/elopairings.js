// Generated by CoffeeScript 2.7.0
var datum;

import {
  parseExpr
} from './parser.js';

import {
  g,
  print,
  range
} from './globals.js';

import {
  Button,
  spread
} from './button.js';

import {
  Lista
} from './lista.js';

import {
  Tournament
} from './tournament.js';

import {
  Tables
} from './page_tables.js';

import {
  Names
} from './page_names.js';

import {
  Standings
} from './page_standings.js';

import {
  Active
} from './page_active.js';


// g.LPP = 14
g.RINGS = {
  'b': '•',
  ' ': ' ',
  'w': 'o'
};

g.ASCII = '0123456789abcdefg';

g.ALFABET = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 62 ronder maximalt

datum = '';

g.tournament = null;

g.errors = []; // id för motsägelsefulla resultat. Tas bort med Delete

g.pages = [];

window.windowResized = function() {
  resizeCanvas(windowWidth, windowHeight - 4);
  return g.LPP = Math.trunc(height / g.ZOOM[g.state] - 5);
};

window.setup = function() {
  createCanvas(windowWidth - 4, windowHeight - 4);
  textFont('Courier New');
  // textAlign window.LEFT,window.TOP
  textAlign(CENTER, CENTER);
  rectMode(window.CORNER);
  noStroke();
  g.ZOOM = [
    20,
    20,
    20,
    20 // vertical line distance for four states
  ];
  g.state = g.TABLES;
  g.LPP = Math.trunc(height / g.ZOOM[g.state] - 5);
  g.N = 0; // number of players
  g.tournament = new Tournament();
  g.state = g.ACTIVE;
  g.pages = [new Tables(), new Names(), new Standings(), new Active()];
  print(g.pages);
  g.tournament.fetchURL();
  return window.windowResized();
};

window.draw = function() {
  background('gray');
  textSize(g.ZOOM[g.state]);
  return g.pages[g.state].draw();
};

window.mousePressed = function(event) {
  return g.pages[g.state].mousePressed(event);
};

window.mouseWheel = function(event) {
  return g.pages[g.state].mouseWheel(event);
};

window.keyPressed = function(event) {
  var key2;
  key2 = key;
  if (key2 === 'Control' || key2 === 'Shift' || key2 === 'I') {
    return;
  }
  if (key2 === '1') {
    key2 = 'K1';
  }
  if (key2 === '0') {
    key2 = 'K0';
  }
  return g.pages[g.state].keyPressed(event, key2);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxvcGFpcmluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxlbG9wYWlyaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLFNBQVQ7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxDQUFUO0VBQVcsS0FBWDtFQUFpQixLQUFqQjtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsVUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsU0FBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7Q0FBQSxNQUFBLG1CQVJBOzs7O0FBV0EsQ0FBQyxDQUFDLEtBQUYsR0FBVTtFQUFDLEdBQUEsRUFBSSxHQUFMO0VBQVUsR0FBQSxFQUFJLEdBQWQ7RUFBbUIsR0FBQSxFQUFJO0FBQXZCOztBQUNWLENBQUMsQ0FBQyxLQUFGLEdBQVU7O0FBQ1YsQ0FBQyxDQUFDLE9BQUYsR0FBWSxnRUFiWjs7QUFlQSxLQUFBLEdBQVE7O0FBRVIsQ0FBQyxDQUFDLFVBQUYsR0FBZTs7QUFDZixDQUFDLENBQUMsTUFBRixHQUFXLEdBbEJYOztBQW1CQSxDQUFDLENBQUMsS0FBRixHQUFVOztBQUVWLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLFFBQUEsQ0FBQSxDQUFBO0VBQ3RCLFlBQUEsQ0FBYSxXQUFiLEVBQTBCLFlBQUEsR0FBYSxDQUF2QztTQUNBLENBQUMsQ0FBQyxHQUFGLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFBLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSCxDQUFmLEdBQTJCLENBQXRDO0FBRmM7O0FBSXZCLE1BQU0sQ0FBQyxLQUFQLEdBQWUsUUFBQSxDQUFBLENBQUE7RUFDZCxZQUFBLENBQWEsV0FBQSxHQUFZLENBQXpCLEVBQTJCLFlBQUEsR0FBYSxDQUF4QztFQUNBLFFBQUEsQ0FBUyxhQUFULEVBREQ7O0VBR0MsU0FBQSxDQUFVLE1BQVYsRUFBaUIsTUFBakI7RUFDQSxRQUFBLENBQVMsTUFBTSxDQUFDLE1BQWhCO0VBQ0EsUUFBQSxDQUFBO0VBRUEsQ0FBQyxDQUFDLElBQUYsR0FBUztJQUFDLEVBQUQ7SUFBSSxFQUFKO0lBQU8sRUFBUDtJQUFVLEVBQVY7O0VBQ1QsQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUM7RUFDWixDQUFDLENBQUMsR0FBRixHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBQSxHQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBZixHQUEyQixDQUF0QztFQUVSLENBQUMsQ0FBQyxDQUFGLEdBQU0sRUFYUDtFQVlDLENBQUMsQ0FBQyxVQUFGLEdBQWUsSUFBSSxVQUFKLENBQUE7RUFDZixDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQztFQUVaLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxJQUFJLE1BQUosQ0FBQSxDQUFELEVBQWEsSUFBSSxLQUFKLENBQUEsQ0FBYixFQUF3QixJQUFJLFNBQUosQ0FBQSxDQUF4QixFQUF1QyxJQUFJLE1BQUosQ0FBQSxDQUF2QztFQUNWLEtBQUEsQ0FBTSxDQUFDLENBQUMsS0FBUjtFQUVBLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBYixDQUFBO1NBRUEsTUFBTSxDQUFDLGFBQVAsQ0FBQTtBQXJCYzs7QUF1QmYsTUFBTSxDQUFDLElBQVAsR0FBYyxRQUFBLENBQUEsQ0FBQTtFQUNiLFVBQUEsQ0FBVyxNQUFYO0VBQ0EsUUFBQSxDQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBZjtTQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxDQUFDLElBQWpCLENBQUE7QUFIYTs7QUFLZCxNQUFNLENBQUMsWUFBUCxHQUFzQixRQUFBLENBQUMsS0FBRCxDQUFBO1NBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSCxDQUFTLENBQUMsWUFBakIsQ0FBOEIsS0FBOUI7QUFBWDs7QUFDdEIsTUFBTSxDQUFDLFVBQVAsR0FBc0IsUUFBQSxDQUFDLEtBQUQsQ0FBQTtTQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxDQUFDLFVBQWpCLENBQTRCLEtBQTVCO0FBQVg7O0FBQ3RCLE1BQU0sQ0FBQyxVQUFQLEdBQXNCLFFBQUEsQ0FBQyxLQUFELENBQUE7QUFDdEIsTUFBQTtFQUFDLElBQUEsR0FBTztFQUNQLElBQUcsU0FBUyxhQUFULFNBQW1CLFdBQW5CLFNBQTJCLEdBQTlCO0FBQXdDLFdBQXhDOztFQUNBLElBQUcsSUFBQSxLQUFRLEdBQVg7SUFBb0IsSUFBQSxHQUFPLEtBQTNCOztFQUNBLElBQUcsSUFBQSxLQUFRLEdBQVg7SUFBb0IsSUFBQSxHQUFPLEtBQTNCOztTQUNBLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxDQUFDLFVBQWpCLENBQTRCLEtBQTVCLEVBQWtDLElBQWxDO0FBTHFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGFyc2VFeHByIH0gZnJvbSAnLi9wYXJzZXIuanMnXHJcbmltcG9ydCB7IGcscHJpbnQscmFuZ2UgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5pbXBvcnQgeyBCdXR0b24sc3ByZWFkIH0gZnJvbSAnLi9idXR0b24uanMnIFxyXG5pbXBvcnQgeyBMaXN0YSB9IGZyb20gJy4vbGlzdGEuanMnIFxyXG5pbXBvcnQgeyBUb3VybmFtZW50IH0gZnJvbSAnLi90b3VybmFtZW50LmpzJyBcclxuaW1wb3J0IHsgVGFibGVzIH0gZnJvbSAnLi9wYWdlX3RhYmxlcy5qcycgXHJcbmltcG9ydCB7IE5hbWVzIH0gZnJvbSAnLi9wYWdlX25hbWVzLmpzJyBcclxuaW1wb3J0IHsgU3RhbmRpbmdzIH0gZnJvbSAnLi9wYWdlX3N0YW5kaW5ncy5qcycgXHJcbmltcG9ydCB7IEFjdGl2ZSB9IGZyb20gJy4vcGFnZV9hY3RpdmUuanMnIFxyXG5cclxuIyBnLkxQUCA9IDE0XHJcbmcuUklOR1MgPSB7J2InOifigKInLCAnICc6JyAnLCAndyc6J28nfVxyXG5nLkFTQ0lJID0gJzAxMjM0NTY3ODlhYmNkZWZnJ1xyXG5nLkFMRkFCRVQgPSAnMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicgIyA2MiByb25kZXIgbWF4aW1hbHRcclxuXHJcbmRhdHVtID0gJydcclxuXHJcbmcudG91cm5hbWVudCA9IG51bGxcclxuZy5lcnJvcnMgPSBbXSAjIGlkIGbDtnIgbW90c8OkZ2Vsc2VmdWxsYSByZXN1bHRhdC4gVGFzIGJvcnQgbWVkIERlbGV0ZVxyXG5nLnBhZ2VzID0gW11cclxuXHJcbndpbmRvdy53aW5kb3dSZXNpemVkID0gLT4gXHJcblx0cmVzaXplQ2FudmFzIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQtNFxyXG5cdGcuTFBQID0gTWF0aC50cnVuYyBoZWlnaHQgLyBnLlpPT01bZy5zdGF0ZV0gLSA1XHJcblxyXG53aW5kb3cuc2V0dXAgPSAtPlxyXG5cdGNyZWF0ZUNhbnZhcyB3aW5kb3dXaWR0aC00LHdpbmRvd0hlaWdodC00XHJcblx0dGV4dEZvbnQgJ0NvdXJpZXIgTmV3J1xyXG5cdCMgdGV4dEFsaWduIHdpbmRvdy5MRUZULHdpbmRvdy5UT1BcclxuXHR0ZXh0QWxpZ24gQ0VOVEVSLENFTlRFUlxyXG5cdHJlY3RNb2RlIHdpbmRvdy5DT1JORVJcclxuXHRub1N0cm9rZSgpXHJcblxyXG5cdGcuWk9PTSA9IFsyMCwyMCwyMCwyMF0gIyB2ZXJ0aWNhbCBsaW5lIGRpc3RhbmNlIGZvciBmb3VyIHN0YXRlc1xyXG5cdGcuc3RhdGUgPSBnLlRBQkxFU1xyXG5cdGcuTFBQID0gTWF0aC50cnVuYyBoZWlnaHQgLyBnLlpPT01bZy5zdGF0ZV0gLSA1XHJcblxyXG5cdGcuTiA9IDAgIyBudW1iZXIgb2YgcGxheWVyc1xyXG5cdGcudG91cm5hbWVudCA9IG5ldyBUb3VybmFtZW50KClcclxuXHRnLnN0YXRlID0gZy5BQ1RJVkVcclxuXHJcblx0Zy5wYWdlcyA9IFtuZXcgVGFibGVzLCBuZXcgTmFtZXMsIG5ldyBTdGFuZGluZ3MsIG5ldyBBY3RpdmVdXHJcblx0cHJpbnQgZy5wYWdlc1xyXG5cclxuXHRnLnRvdXJuYW1lbnQuZmV0Y2hVUkwoKVxyXG5cclxuXHR3aW5kb3cud2luZG93UmVzaXplZCgpXHJcblxyXG53aW5kb3cuZHJhdyA9IC0+IFxyXG5cdGJhY2tncm91bmQgJ2dyYXknXHJcblx0dGV4dFNpemUgZy5aT09NW2cuc3RhdGVdXHJcblx0Zy5wYWdlc1tnLnN0YXRlXS5kcmF3KClcclxuXHJcbndpbmRvdy5tb3VzZVByZXNzZWQgPSAoZXZlbnQpIC0+IGcucGFnZXNbZy5zdGF0ZV0ubW91c2VQcmVzc2VkIGV2ZW50XHJcbndpbmRvdy5tb3VzZVdoZWVsICAgPSAoZXZlbnQpIC0+IGcucGFnZXNbZy5zdGF0ZV0ubW91c2VXaGVlbCBldmVudFxyXG53aW5kb3cua2V5UHJlc3NlZCAgID0gKGV2ZW50KSAtPiBcclxuXHRrZXkyID0ga2V5XHJcblx0aWYga2V5MiBpbiBbJ0NvbnRyb2wnLCdTaGlmdCcsJ0knXSB0aGVuIHJldHVyblxyXG5cdGlmIGtleTIgPT0gJzEnIHRoZW4ga2V5MiA9ICdLMSdcclxuXHRpZiBrZXkyID09ICcwJyB0aGVuIGtleTIgPSAnSzAnXHJcblx0Zy5wYWdlc1tnLnN0YXRlXS5rZXlQcmVzc2VkIGV2ZW50LGtleTJcclxuIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\elopairings.coffee