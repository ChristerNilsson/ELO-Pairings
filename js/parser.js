// Generated by CoffeeScript 2.7.0
var BAR, splitByTopLevelPipe;

import {
  print,
  assert
} from './globals.js';


// Lisp, kind of - more compact tree rep than XML and JSON
BAR = '!';

export var parseExpr = function(expr) {
  var parts;
  if (expr.startsWith('(') && expr.endsWith(')')) {
    expr = expr.slice(1, -1);
  }
  parts = splitByTopLevelPipe(expr);
  return parts.map(function(part) {
    if (part.startsWith('(') && part.endsWith(')')) {
      return parseExpr(part);
    } else {
      return part;
    }
  });
};

splitByTopLevelPipe = function(expr) {
  var char, i, j, len, level, part, parts;
  parts = [];
  part = '';
  level = 0;
  for (i = j = 0, len = expr.length; j < len; i = ++j) {
    char = expr[i];
    if (char === '(') {
      level++;
    } else if (char === ')') {
      level--;
    }
    if (char === BAR && level === 0) {
      parts.push(part);
      part = '';
    } else {
      part += char;
    }
  }
  if (part) {
    parts.push(part);
  }
  return parts;
};

assert(["1234", "Christer"], parseExpr("(1234!Christer)"));

assert(["1234", "Christer"], parseExpr("1234!Christer"));

assert(["1234", "Christer", ["12w0", "23b½", "14w"]], parseExpr("(1234!Christer!(12w0!23b½!14w))"));

assert(["1234", "Christer", ["12w0", "23b½", "14w"]], parseExpr("1234!Christer!(12w0!23b½!14w)"));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxHQUFBLEVBQUE7O0FBQUEsT0FBQTtFQUFTLEtBQVQ7RUFBZSxNQUFmO0NBQUEsTUFBQSxlQUFBOzs7O0FBSUEsR0FBQSxHQUFNOztBQUVOLE9BQUEsSUFBTyxTQUFBLEdBQVksUUFBQSxDQUFDLElBQUQsQ0FBQTtBQUNuQixNQUFBO0VBQUMsSUFBRyxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFBLElBQXlCLElBQUksQ0FBQyxRQUFMLENBQWMsR0FBZCxDQUE1QjtJQUFvRCxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBQyxDQUFmLEVBQTNEOztFQUNBLEtBQUEsR0FBUSxtQkFBQSxDQUFvQixJQUFwQjtTQUNSLEtBQUssQ0FBQyxHQUFOLENBQVUsUUFBQSxDQUFDLElBQUQsQ0FBQTtJQUFVLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBQSxJQUF5QixJQUFJLENBQUMsUUFBTCxDQUFjLEdBQWQsQ0FBNUI7YUFBb0QsU0FBQSxDQUFVLElBQVYsRUFBcEQ7S0FBQSxNQUFBO2FBQXdFLEtBQXhFOztFQUFWLENBQVY7QUFIa0I7O0FBS25CLG1CQUFBLEdBQXNCLFFBQUEsQ0FBQyxJQUFELENBQUE7QUFDdEIsTUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQTtFQUFDLEtBQUEsR0FBUTtFQUNSLElBQUEsR0FBTztFQUNQLEtBQUEsR0FBUTtFQUNSLEtBQUEsOENBQUE7O0lBQ0MsSUFBRyxJQUFBLEtBQVEsR0FBWDtNQUFvQixLQUFBLEdBQXBCO0tBQUEsTUFDSyxJQUFHLElBQUEsS0FBUSxHQUFYO01BQW1CLEtBQUEsR0FBbkI7O0lBQ0wsSUFBRyxJQUFBLEtBQVEsR0FBUixJQUFnQixLQUFBLEtBQVMsQ0FBNUI7TUFDQyxLQUFLLENBQUMsSUFBTixDQUFXLElBQVg7TUFDQSxJQUFBLEdBQU8sR0FGUjtLQUFBLE1BQUE7TUFHSyxJQUFBLElBQVEsS0FIYjs7RUFIRDtFQU9BLElBQW1CLElBQW5CO0lBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLEVBQUE7O1NBQ0E7QUFacUI7O0FBY3RCLE1BQUEsQ0FBTyxDQUFDLE1BQUQsRUFBUSxVQUFSLENBQVAsRUFBNEIsU0FBQSxDQUFVLGlCQUFWLENBQTVCOztBQUNBLE1BQUEsQ0FBTyxDQUFDLE1BQUQsRUFBUSxVQUFSLENBQVAsRUFBNEIsU0FBQSxDQUFVLGVBQVYsQ0FBNUI7O0FBQ0EsTUFBQSxDQUFPLENBQUMsTUFBRCxFQUFRLFVBQVIsRUFBbUIsQ0FBQyxNQUFELEVBQVEsTUFBUixFQUFlLEtBQWYsQ0FBbkIsQ0FBUCxFQUFrRCxTQUFBLENBQVUsaUNBQVYsQ0FBbEQ7O0FBQ0EsTUFBQSxDQUFPLENBQUMsTUFBRCxFQUFRLFVBQVIsRUFBbUIsQ0FBQyxNQUFELEVBQVEsTUFBUixFQUFlLEtBQWYsQ0FBbkIsQ0FBUCxFQUFrRCxTQUFBLENBQVUsK0JBQVYsQ0FBbEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcmludCxhc3NlcnQgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5cclxuIyBMaXNwLCBraW5kIG9mIC0gbW9yZSBjb21wYWN0IHRyZWUgcmVwIHRoYW4gWE1MIGFuZCBKU09OXHJcblxyXG5CQVIgPSAnISdcclxuXHJcbmV4cG9ydCBwYXJzZUV4cHIgPSAoZXhwcikgLT5cclxuXHRpZiBleHByLnN0YXJ0c1dpdGgoJygnKSBhbmQgZXhwci5lbmRzV2l0aCgnKScpIHRoZW4gZXhwciA9IGV4cHIuc2xpY2UgMSwgLTFcclxuXHRwYXJ0cyA9IHNwbGl0QnlUb3BMZXZlbFBpcGUgZXhwclxyXG5cdHBhcnRzLm1hcCAocGFydCkgLT4gaWYgcGFydC5zdGFydHNXaXRoKCcoJykgYW5kIHBhcnQuZW5kc1dpdGgoJyknKSB0aGVuIHBhcnNlRXhwciBwYXJ0IGVsc2UgcGFydFxyXG5cclxuc3BsaXRCeVRvcExldmVsUGlwZSA9IChleHByKSAtPlxyXG5cdHBhcnRzID0gW11cclxuXHRwYXJ0ID0gJydcclxuXHRsZXZlbCA9IDBcclxuXHRmb3IgY2hhciwgaSBpbiBleHByXHJcblx0XHRpZiBjaGFyID09ICcoJyB0aGVuIGxldmVsKytcclxuXHRcdGVsc2UgaWYgY2hhciA9PSAnKSd0aGVuIGxldmVsLS1cclxuXHRcdGlmIGNoYXIgPT0gQkFSIGFuZCBsZXZlbCA9PSAwXHJcblx0XHRcdHBhcnRzLnB1c2ggcGFydFxyXG5cdFx0XHRwYXJ0ID0gJydcclxuXHRcdGVsc2UgcGFydCArPSBjaGFyXHJcblx0cGFydHMucHVzaCBwYXJ0IGlmIHBhcnRcclxuXHRwYXJ0c1xyXG5cclxuYXNzZXJ0IFtcIjEyMzRcIixcIkNocmlzdGVyXCJdLCBwYXJzZUV4cHIgXCIoMTIzNCFDaHJpc3RlcilcIlxyXG5hc3NlcnQgW1wiMTIzNFwiLFwiQ2hyaXN0ZXJcIl0sIHBhcnNlRXhwciBcIjEyMzQhQ2hyaXN0ZXJcIlxyXG5hc3NlcnQgW1wiMTIzNFwiLFwiQ2hyaXN0ZXJcIixbXCIxMncwXCIsXCIyM2LCvVwiLFwiMTR3XCJdXSwgcGFyc2VFeHByIFwiKDEyMzQhQ2hyaXN0ZXIhKDEydzAhMjNiwr0hMTR3KSlcIlxyXG5hc3NlcnQgW1wiMTIzNFwiLFwiQ2hyaXN0ZXJcIixbXCIxMncwXCIsXCIyM2LCvVwiLFwiMTR3XCJdXSwgcGFyc2VFeHByIFwiMTIzNCFDaHJpc3RlciEoMTJ3MCEyM2LCvSExNHcpXCJcclxuIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\parser.coffee