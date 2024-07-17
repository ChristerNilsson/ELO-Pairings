# import { Tournament } from './tournament.js' 
import { Tables } from './page_tables.js' 
import { Names } from './page_names.js' 
import { Standings } from './page_standings.js' 
import { Active } from './page_active.js' 

export g = {}

###########################################

g.K = 2 # 20
# g.K0 = 40 # 40=juniors 20=normal 10=masters
# g.k = 1.0 # 0.7

# parameters that affects matching
g.EXPONENT = 1.01 # 1 or 1.01 (or 2)
g.DIFF = 'ELO' # ELO använder senaste elo i Standings
#g.DIFF = 'POS' # POS använder senaste position i Standings
g.COLORS = 1 # www not ok
#g.COLORS = 2 # www ok

###########################################

export print = console.log
export range = _.range
export scalex = (x) -> x * g.ZOOM[g.state] / 20
export scaley = (y) -> y * g.ZOOM[g.state]

g.seed = 0
export random = -> (((Math.sin(g.seed++)/2+0.5)*10000)%100)/100

g.BYE = -1
g.PAUSE = -2

g.TABLES    = 0
g.NAMES     = 1
g.STANDINGS = 2
g.ACTIVE    = 3

g.pages = []

g.message = ""

g.scoringProbability = (diff) -> 1 / (1 + pow 10, diff/400)

g.showType = (a) -> if typeof a == 'string' then "'#{a}'" else a
export assert = (a,b) -> if not _.isEqual a,b then print "Assert failure: #{JSON.stringify a} != #{JSON.stringify b}"

g.ok = (a,b) -> a.id != b.id and a.id not in b.opp and abs(a.balans() + b.balans()) <= g.COLORS
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
	res
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

g.calcMissing = ->
	missing = 0
	for p in g.tournament.persons
		if not p.active then continue
		if g.BYE == _.last p.opp then continue
		if p.res.length < p.col.length then missing++
	g.message = "#{missing//2} results missing"
	missing

g.sum = (s) ->
	res = 0
	for item in s
		res += parseFloat item
	res
assert 6, g.sum '012012'

g.sumNumbers = (arr) ->
	# print 'sumNumbers',arr
	res = 0
	for item in arr
		res += item
	res
assert 15, g.sumNumbers [1,2,3,4,5]

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

g.prBth = (score) -> "#{'0½1'[score]}-#{'1½0'[score]}"
g.prBoth = (score) -> " #{'0½1'[score]} - #{'1½0'[score]} "

###########################

export class DecimalRemover
	constructor : (numbers) ->
		temp = {} # används för att bli av med dubletter
		for number in numbers
			temp[number] = number
		numbers = _.values temp
		numbers = ([nr,0] for nr in numbers)

		# anropa en extra gång för att förbättra resultatet. (decimaler läggs till vid behov)
		@data = @update @update numbers

		# Sök upp största antal decimaler
		@n = _.maxBy @data, (item) -> item[1]
		print @n
		@n = @n[1]

		@hash = {}
		for [nr,decimals] in @data
			@hash[nr] = decimals

		print 'hash',@hash

		print 'DecimalRemover',@data
		for [nr,decimals] in @data
			print nr,@format nr

	update : (pairs, levels=0) ->
		result = []
		if pairs.length == 1
			pairs[0][1] -= 1
			return pairs
		hash = {}
		for [nr,decimals] in pairs
			key = nr.toFixed decimals
			if key not of hash then hash[key] = []
			hash[key].push [nr,decimals+1]
		for key of hash
			result = result.concat @update hash[key], levels+1
		return result

	# uppdatera antalet decimaler så att varje tal blir unikt.
	# Börja med noll decimaler och lägg till fler vid behov.
	format : (number) -> # lista med flyttal
		if number not of @hash then return 'saknas'
		decimals = Math.abs @hash[number]
		# print 'format',number,decimals
		s = number.toFixed decimals
		# strings = (nr.toFixed decs for [nr,decs] in data)
		# Se till att decimalpunkterna kommer ovanför varandra
		# Lägg till blanktecken på höger sida.
		p = _.lastIndexOf s, '.'
		if p >= 0 then p = s.length - 1 - p
		s + _.repeat ' ', @n - p

rd = new DecimalRemover [1.23001, -1.19, 1.23578, 1.2397, 0, -10.3]
assert   "1.240", rd.format 1.2397
assert   "1.236", rd.format 1.23578
assert   "1.23 ", rd.format 1.23001
assert   "0    ", rd.format 0
assert  "-1    ", rd.format -1.19
assert "-10    ", rd.format -10.3
