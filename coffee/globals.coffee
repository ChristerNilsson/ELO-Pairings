import { Tournament } from './tournament.js' 
import { Tables } from './page_tables.js' 
import { Names } from './page_names.js' 
import { Standings } from './page_standings.js' 
import { Active } from './page_active.js' 

export print = console.log
export range = _.range
export scalex = (x) -> x * g.ZOOM[g.state] / 20
export scaley = (y) -> y * g.ZOOM[g.state]

export g = {}

g.seed = 0
export random = -> (((Math.sin(g.seed++)/2+0.5)*10000)%100)/100

# parameters that somewhat affects matching
g.COST = 'QUADRATIC' # QUADRATIC=1.01 or LINEAR=1
g.DIFF = 'ID' # ID or ELO
g.COLORS = 1 # 1 or 2

g.TABLES    = 0
g.NAMES     = 1
g.STANDINGS = 2
g.ACTIVE    = 3

g.pages = []

g.message = ""

g.showType = (a) -> if typeof a == 'string' then "'#{a}'" else a
export assert = (a,b) -> if not _.isEqual a,b then print "Assert failure: #{JSON.stringify a} != #{JSON.stringify b}"

g.ok = (p0, p1) -> p0.id != p1.id and p0.id not in p1.opp and abs(p0.balans() + p1.balans()) <= g.COLORS
g.other = (col) -> if col == 'b' then 'w' else 'b'

g.myRound = (x,decs) -> x.toFixed decs
assert "2.0", g.myRound 1.99,1
assert "0.6", g.myRound 0.61,1

g.ints2strings = (ints) -> "#{ints}"
assert "1,2,3", g.ints2strings [1,2,3]
assert "1", g.ints2strings [1]
assert "", g.ints2strings []

g.res2string = (ints) -> (i.toString() for i in ints).join ''
assert "123", g.res2string [1,2,3]
assert "1", g.res2string [1]
assert "", g.res2string []

g.zoomIn  = (n) -> g.ZOOM[g.state]++
g.zoomOut = (n) -> g.ZOOM[g.state]--
g.setState = (newState) -> if g.tournament.round > 0 then g.state = newState

g.invert = (arr) ->
	res = []
	for i in range arr.length
		res[arr[i]] = i
	return res
assert [0,1,2,3], g.invert [0,1,2,3]
assert [3,2,0,1], g.invert [2,3,1,0]
assert [2,3,1,0], g.invert g.invert [2,3,1,0]

xxx = [[2,1],[12,2],[12,1],[3,4]]
xxx.sort (a,b) -> 
	diff = a[0] - b[0] 
	if diff == 0 then a[1] - b[1] else diff
assert [[2,1], [3,4], [12,1], [12,2]], xxx	
assert true, [2] > [12]
assert true, "2" > "12"
assert false, 2 > 12

# xxx = [[2,1],[12,2],[12,1],[3,4]]
# assert [[2,1],[12,1],[12,2],[3,4]], _.sortBy(xxx, (x) -> [x[0],x[1]])
# assert [[3,4],[2,1],[12,1],[12,2]], _.sortBy(xxx, (x) -> -x[0])
# assert [[2,1],[12,1],[3,4],[12,2]], _.sortBy(xxx, (x) -> x[1])
# assert [[3,4],[12,1],[2,1],[12,2]], _.sortBy(xxx, (x) -> -x[1])

g.normera = (a,b,k) -> Math.round (b - k*a) / (k-1) # Räknar ut vad som ska adderas till elotalen
assert  -406, g.normera 1406,2406,2   # 1000,2000
assert -1900, g.normera 1950,2000,2   #   50,100
assert     0, g.normera 1000,2000,2   # 1000,2000
assert   200, g.normera 900,2000,2    # 1100,2200
assert -1200, g.normera 1600,2000,2   #  400,800
assert  -500, g.normera 1000,2000,3   #  500,1500
assert -1000, g.normera 1200,1800,4   #  200,800
assert -1067, g.normera 1400,2400,4   #  333,1333
assert  -800, g.normera 1600,2000,1.5 #  800,1200
assert   400, g.normera 1600,2000,1.2 # 2000,2400
assert  2400, g.normera 1600,2000,1.1 # 4000,4400

g.calcMissing = ->
	missing = 0
	for p in g.tournament.persons
		if p.active and p.res.length < p.col.length then missing++
	g.message = "#{missing//2} results missing"
	missing == 0

g.sum = (s) ->
	res = 0
	for item in s
		res += parseFloat item
	res
assert 6, g.sum '012012'

g.txtT = (value, w, align=window.CENTER) -> 
	if value.length > w then value = value.substring 0,w
	if value.length < w and align==window.RIGHT then value = value.padStart w
	if align==window.LEFT then res = value + _.repeat ' ',w-value.length
	if align==window.RIGHT then res = _.repeat(' ',w-value.length) + value
	if align==window.CENTER 
		diff = w-value.length
		lt = _.repeat ' ',(1+diff)//2
		rt = _.repeat ' ',diff//2
		res = lt + value + rt
	res

g.prBoth = (score) -> " #{'0½1'[score]} - #{'1½0'[score]} "
