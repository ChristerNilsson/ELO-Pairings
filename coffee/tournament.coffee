import { g, range, print, scalex, scaley } from './globals.js' 
import { parseExpr } from './parser.js'
import { Player } from './player.js'
import { Edmonds } from './blossom.js' 
import { Tables } from './page_tables.js' 
import { Names } from './page_names.js' 
import { Standings } from './page_standings.js' 
import { Active } from './page_active.js' 

export class Tournament 
	constructor : () ->
		@title = ''
		@round = 0
		@tpp = 30
		@ppp = 60

		# dessa tre listor pekar på samma objekt
		@players = []
		@persons = [] # stabil, sorterad på id och elo
		@pairs = [] # varierar med varje rond

		@robin = range g.N
		@mat = []

	write : () ->

	makeEdges : (bye) -> # bye är ett id eller -1
		print 'bye',bye
		edges = []
		for a in range g.N
			pa = @persons[a]
			if not pa.active or pa.id == bye then continue
			for b in range a+1, g.N
				pb = @persons[b]
				if not pb.active or pb.id == bye then continue
				if g.DIFF == 'ELO'  then diff = abs pa.elo - pb.elo
				if g.DIFF == 'PERF' then diff = abs pa.performance(g.tournament.round) - pb.performance(g.tournament.round)
				if g.DIFF == 'ID'   then diff = abs pa.id - pb.id
				cost = 9999 - diff ** g.EXPONENT
				if g.ok pa,pb then edges.push [pa.id, pb.id, cost]
		edges
	
	findSolution : (edges) -> 
		edmonds = new Edmonds edges
		edmonds.maxWeightMatching edges

	flip : (p0,p1) -> # p0 byter färg, p0 anpassar sig
		col0 = _.last p0.col
		col1 = col0
		col0 = other col0
		p0.col += col0
		p1.col += col1

	assignColors : (p0,p1) ->
		b0 = p0.balans()
		b1 = p1.balans()
		if b0 < b1 then x = 0
		else if b0 > b1 then x = 1
		else if p0.id < p1.id then x = 0 else x = 1
		p0.col += 'wb'[x]
		p1.col += 'bw'[x]

	unscramble : (solution) -> # [5,3,4,1,2,0] => [[0,5],[1,3],[2,4]]
		solution = _.clone solution
		result = []
		for i in range solution.length
			if solution[i] != -1
				j = solution[i]
				result.push [i,j] #[@players[i].id,@players[j].id]
				solution[j] = -1
				solution[i] = -1
		result

	solutionCost : (pairs) ->
		summa = 0
		for [a,b] in pairs
			pa = @persons[a]
			pb = @persons[b]
			if g.DIFF == 'PERF'
				da = pa.performance(g.tournament.round)
				db = pb.performance(g.tournament.round)
			if g.DIFF == 'ELO'
				da = pa.elo
				db = pb.elo
			if g.DIFF == 'ID'
				da = pa.id
				db = pb.id
			diff = Math.abs da - db
			print a,b,da,db,diff
			summa += diff ** g.EXPONENT
		summa

	preMatch : -> # return id för spelaren som ska ha bye eller -1 om bye saknas

		for p in @persons
			if p.active then continue
			p.opp.push g.PAUSE
			p.col += ' '
			p.res += '0'

		temp = _.filter @persons, (p) -> p.active 
		if temp.length % 2 == 1 # Spelaren med lägst elo och som inte har haft frirond, får frironden
			temp = _.filter @persons, (p) -> p.active and p.bye == false
			bye = _.last temp
			bye.bye = true
			bye.opp.push g.BYE
			bye.col += ' '
			if bye.name == 'Vida Radon' then print 'preMatch',bye
			return bye.id
		g.BYE

	postMatch : ->
		for p in @persons
			if p.active then continue
			p.opp.push g.PAUSE
			p.col += ' '

		for [a,b] in @pairs
			pa = @persons[a]
			pb = @persons[b]
			pa.opp.push pb.id
			pb.opp.push pa.id

		if @round == 0
			for i in range @pairs.length
				[a,b] = @pairs[i]
				pa = @persons[a]
				pb = @persons[b]
				col1 = "bw"[i%2]
				col0 = g.other col1
				pa.col += col0
				pb.col += col1
				if i%2==1 then @pairs[i].reverse()
		else
			for i in range @pairs.length
				[a,b] = @pairs[i]
				pa = @persons[a]
				pb = @persons[b]
				@assignColors pa,pb
				if pa.col[@round]=='b' then @pairs[i].reverse()

		for [a,b],i in @pairs
			pa = @persons[a]
			pb = @persons[b]
			pa.chair = 2*i
			pb.chair = 2*i + 1

	downloadFile : (txt,filename) ->
		blob = new Blob [txt], { type: 'text/plain' }
		url = URL.createObjectURL blob
		a = document.createElement 'a'
		a.href = url
		a.download = filename
		document.body.appendChild a
		a.click()
		document.body.removeChild a
		URL.revokeObjectURL url

	lotta : () ->

		if @round > 0 and g.calcMissing() > 0
			print 'lottning ej genomförd!'
			return

		print "Lottning av rond #{@round}"
		document.title = "Round #{@round+1}"

		start = new Date()
		bye =  @preMatch()
		net = @makeEdges bye # -1 om bye saknas
		print net
		solution = @findSolution net

		print 'cpu:',new Date() - start,'ms'
		print 'solution', solution

		for index,id in solution
			p = @persons[index]
			if id == -1 and (p.bye == false or p.active)
				print 'Solution failed!'
				return 

		@pairs = @unscramble solution
		print 'pairs',@pairs
		print 'solutionCost', @solutionCost @pairs

		@postMatch()

		g.pages[g.NAMES].setLista()
		g.pages[g.TABLES].setLista()
		g.pages[g.STANDINGS].setLista()

		timestamp = new Date().toLocaleString('se-SE').replaceAll ' ','_'

		@downloadFile @makeURL(timestamp), "#{timestamp}-#{@round} URL.txt"
		@downloadFile @makeStandardFile(), "#{timestamp}-#{@round}.txt"

		if @round > 0 then print @makeMatrix() # skriver till debug-fönstret, time outar inte.
		# if @round > 0 then downloadFile @makeMatrix(), "#{@title} R#{@round} Matrix.txt" # (time outar, filen sparas inte)

		@round += 1

		print 'lotta round', @round
		g.state = g.TABLES

	fetchURL : (url = location.search) ->
		if url == '' then window.location.href = "https://github.com/ChristerNilsson/ELO-Pairings/blob/main/README.md"
		print 'fetchURL',url
		getParam = (name,def) -> urlParams.get(name) || def

		urlParams = new URLSearchParams url
		@players = []
		@title = urlParams.get('TOUR').replaceAll '_',' '
		@datum = urlParams.get('DATE') or ""
		@round = parseInt getParam 'ROUND',0
		@first = getParam 'FIRST','bw' # Determines if first player has white or black in the first round
		@tpp = parseInt getParam 'TPP',30 # Tables Per Page
		@ppp = parseInt getParam 'PPP',60 # Players Per Page
		g.K0 = parseInt getParam 'K0', 40 # 40, 20 or 10 normally
		g.k  = parseFloat getParam 'k',1.0

		players = urlParams.get 'PLAYERS'
		players = players.replaceAll ')(', ')!('
		players = players.replaceAll '_',' '
		players = '(' + players + ')'
		players = parseExpr players
		print 'fetchURL.players',players

		g.N = players.length

		if 4 <= g.N < 1000
		else
			print "Error: Number of players must be between 4 and 999!"
			return

		@persons = []
		for i in range g.N
			player = new Player i
			player.read players[i]
			# print 'fetchURL.player',player
			@persons.push player

		@paused = getParam 'PAUSED','()' # list of zero based ids
		@paused = parseExpr @paused
		for id in @paused
			@persons[id].active = false

		print 'fetchURL.persons', @persons
		
		@persons.sort (a,b) -> 
			if a.elo != b.elo then return b.elo - a.elo
			if a.name > b.name then 1 else -1
		# @persons = @persons.reverse()

		XMAX = @persons[0].elo
		XMIN = _.last(@persons).elo
		for i in range g.N
			@persons[i].id = i

		print (p.elo for p in @persons)
		print 'sorted players', @persons # by id AND descending elo

		@playersByName = _.sortBy @persons, (player) -> player.name
		print 'playersByName', (p.name for p in @playersByName)

		# extract @pairs from the last round
		@pairs = []
		for p in @persons
			a = p.id
			b = _.last p.opp
			if a < b 
				pa = @persons[a]
				pb = @persons[b]
				@pairs.push if 'w' == _.last p.col
					pa.chair = 2 * @pairs.length
					pb.chair = 2 * @pairs.length + 1
					[a,b]
				else 
					pa.chair = 2 * @pairs.length + 1
					pb.chair = 2 * @pairs.length
					[b,a]

		print '@pairs',@pairs

		g.pages = [new Tables, new Names, new Standings, new Active]

		g.pages[g.NAMES].setLista()
		g.pages[g.TABLES].setLista()
		g.pages[g.STANDINGS].setLista()

	makeURL : (timestamp) ->
		res = []
		res.push "https://christernilsson.github.io/ELO-Pairings"
		#res.push "http://127.0.0.1:5500"
		res.push "?TOUR=" + @title.replaceAll ' ','_'
		res.push "&TIMESTAMP=" + timestamp
		res.push "&ROUND=" + @round
		res.push "&PLAYERS=" 
		
		players = []
		for p in @persons
			s = p.write()
			players.push '(' + s + ')'
		players = players.join("\n")
		res = res.concat players
		res.join '\n'

	makeStandardFile : () ->
		res = []
		timestamp = new Date().toLocaleString 'se-SE'
		print timestamp
		header_after = " for " + @title + " after Round #{@round}    #{timestamp}"
		header_in    = " for " + @title + " in Round #{@round+1}    #{timestamp}"

		if @round < 999 then g.pages[g.STANDINGS].make res, header_after
		if @round >= 0  then g.pages[g.NAMES].make     res, header_in,@playersByName
		if @round < 999 then g.pages[g.TABLES].make    res, header_in

		res.join "\n"	

	distans : (rounds) ->
		result = []
		for i in range(rounds.length) 
			for [a,b] in rounds[i]
				if a < 0 or b < 0 then continue
				pa = @persons[a]
				pb = @persons[b]
				if pa.active and pb.active 
					result.push abs(pa.elo-pb.elo) 
		(g.sum(result)/result.length).toFixed 2

	makeCanvas : ->
		result = []
		for i in range g.N
			line = new Array g.N
			_.fill line, '·'
			line[i] = '*'
			result.push line
		result

	dumpCanvas : (title,average,canvas) ->
		output = ["", title]
		output.push "Sparseness: #{average}  (Average Elo Difference) DIFF:#{g.DIFF} EXPONENT:#{g.EXPONENT} COLORS:#{g.COLORS} K0:#{g.K0} k:#{g.k}"
		output.push ""
		header = (str((i + 1) % 10) for i in range(g.N)).join(' ')
		output.push '     ' + header + '   Elo    AED'
		ordning = (p.elo for p in @persons)
		for i in range canvas.length
			row = canvas[i]
			nr = str(i + 1).padStart(3)
			output.push "#{nr}  #{(str(item) for item in row).join(" ")}  #{ordning[i]} #{@persons[i].avgEloDiff().toFixed(1).padStart(6)}"
		output.push '     ' + header
		output.join '\n'

	drawMatrix : (title,rounds) ->
		canvas = @makeCanvas()
		for i in range rounds.length
			for [a,b] in rounds[i]
				print 'drawMatrix',a,b
				if a < 0 or b < 0 then continue
				if @persons[a].active and @persons[b].active
					canvas[a][b] = g.ALFABET[i]
					canvas[b][a] = g.ALFABET[i]
		@dumpCanvas title,@distans(rounds),canvas

	makeMatrix : ->
		# return
		matrix = []
		for r in range @round
			res = []
			for p in @persons
				res.push [p.id,p.opp[r]]				
			matrix.push res
		@drawMatrix @title, matrix