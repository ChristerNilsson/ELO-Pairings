import { g, range, print, scalex, scaley, assert, wrap, SEPARATOR } from './globals.js' 
import { parseExpr } from './parser.js'
import { Player } from './player.js'
import { Edmonds } from './blossom.js' 
import { Tables } from './page_tables.js' 
import { Names } from './page_names.js' 
import { Standings } from './page_standings.js' 
import { Active } from './page_active.js' 

export class Tournament 
	constructor : ->
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
		@virgin = true

	write : ->

	makeEdges : (iBye) -> # iBye är ett id eller -1
		edges = []
		r = @round
		for a in range g.N
			pa = @persons[a]
			if not pa.active or pa.id == iBye then continue
			for b in range a+1, g.N
				pb = @persons[b]
				if not pb.active or pb.id == iBye then continue
				if g.DIFF == 'ELO' then diff = abs pa.elo - pb.elo
				if g.DIFF == 'POS' then diff = abs pa.pos[r] - pb.pos[r]
				cost = 9999 - diff ** g.EXPONENT
				if g.ok pa,pb then edges.push [pa.id, pb.id, cost]
		edges
	
	findSolution : (edges) -> 
		edmonds = new Edmonds edges
		edmonds.maxWeightMatching edges

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
				result.push [i,j]
				solution[j] = -1
				solution[i] = -1
		result

	solutionCost : (pair) ->
		[a,b] = pair
		pa = @persons[a]
		pb = @persons[b]
		if g.DIFF == 'ELO'
			r = @round
			da = pa.elo
			db = pb.elo
		if g.DIFF == 'POS'
			da = pa.pos[r]
			db = pb.pos[r]
		diff = Math.abs da - db
		diff ** g.EXPONENT
	
	solutionCosts : (pairs) -> g.sumNumbers (@solutionCost(pair) for pair in pairs)

	preMatch : -> # return id för spelaren som ska ha bye eller -1 om bye saknas

		for p in @persons
			if not p.active then p.res += '0'

		temp = _.filter @persons, (p) -> p.active 
		if temp.length % 2 == 1 # Spelaren med lägst elo och som inte har haft frirond, får frironden
			temp = _.filter @persons, (p) -> p.active and p.bye() == false
			pBye = _.last temp
			pBye.opp.push g.BYE
			pBye.col += '_'
			pBye.res += '2'
			return pBye.id
		g.BYE

	postMatch : ->
		for p in @persons
			if p.active then continue
			p.opp.push g.PAUSE
			p.col += '_'

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

	lotta : ->

		if @round > 0 and g.calcMissing() > 0
			print 'lottning ej genomförd!'
			return

		# @dump 'lotta'

		@virgin = false
		timestamp = new Date().toLocaleString('se-SE').replaceAll ' ','_'
		@downloadFile @makeTournament(timestamp), "#{timestamp}-#{@round} Tournament.txt"

		@personsSorted = _.clone @persons
		@personsSorted.sort (pa,pb) => 
			da = pa.elo
			db = pb.elo
			db - da

		for i in range @personsSorted.length
			@personsSorted[i].pos[@round] = i

		print 'sorted',@personsSorted

		print "Lottning av rond #{@round} ====================================================="
		document.title = "Round #{@round+1}"

		print 'pos',(p.id for p in @personsSorted)

		start = new Date()
		edges = @makeEdges @preMatch() # -1 om bye saknas
		print 'cpu1', (new Date() - start)
		print 'edges:', ("#{a}-#{b} #{(9999-c).toFixed(1)}" for [a,b,c] in edges)

		start = new Date()
		solution = @findSolution edges
		print 'cpu2', (new Date() - start)
		print 'solution', solution

		@pairs = @unscramble solution

		print @persons.length,@paused.length,@pairs.length
		if @pairs.length < (@persons.length - @paused.length) // 2 
			alert 'Pairing impossible. Too many rounds or paused players'
			print 'Pairing impossible'
			return 

		if @round == 0 then print 'pairs', @pairs
		if @round > 0  then print 'pairs', ([a, b, @persons[a].elo, @persons[b].elo, Math.abs(@persons[a].elo - @persons[b].elo).toFixed(1)] for [a,b] in @pairs)
		print 'solutionCosts', @solutionCosts @pairs

		@postMatch()

		g.pages[g.NAMES].setLista()
		g.pages[g.TABLES].setLista()
		g.pages[g.STANDINGS].setLista()

		if g.N < 80 then print @makeMatrix() # skriver till debug-fönstret, time outar inte.
		# @downloadFile @makeBubbles(), "#{timestamp}-#{@round} Bubbles.txt"
		@downloadFile @makeStandardFile(), "#{timestamp}-#{@round}.txt"

		@round += 1

		g.state = g.TABLES

	dump : (title) ->
		print "##### #{title} #####"
		print 'TOUR',@title
		print 'DATE',@datum
		print 'ROUND',@round
		print 'TPP',@tpp
		print 'PPP',@ppp
		print 'K',g.K
		print 'PAUSED',@paused
		print 'FACTOR',g.FACTOR
		# print 'PLAYERS'
		# for p in @persons
		# 	print '  ', p.id, p.elo, p.name, p.opp, p.col, p.res

		print '################'

	fetchData : () ->

		data = document.getElementById("definition").value
		data = data.split('\n')

		hash = {}
		for line in data
			arr = line.split '='
			if arr.length == 2
				hash[arr[0]] = arr[1]
				if arr[0] = 'PLAYERS' then hash['PLAYERS'] = []
			else if line.length > 0
				hash['PLAYERS'].push line.split '!'
			
		print hash

		@players = []
		@title = hash.TOUR
		@datum = hash.DATE or ""
		@round = parseInt hash.ROUND or 0
		@tpp = parseInt hash.TPP or 30 # Tables Per Page
		@ppp = parseInt hash.PPP or 60 # Players Per Page
		g.K  = parseInt hash.K or 20 # 40, 20 or 10 normally

		g.FACTOR = parseFloat hash.FACTOR or 2

		players = hash.PLAYERS
		g.N = players.length

		if not (4 <= g.N < 1000)
			print "Error: Number of players must be between 4 and 9999!"
			return

		@persons = []
		for i in range g.N
			player = new Player i
			player.read players[i]
			@persons.push player

		@paused = hash.PAUSED or "" # list of zero based ids
		if @paused == ""
			@paused = []
		else
			@paused = @paused.split '!'
			for id in @paused
				if id != "" then @persons[id].active = false

		print 'fetchData.persons', @persons
		
		@persons.sort (a,b) -> 
			if a.elo != b.elo then return b.elo - a.elo
			if a.name > b.name then 1 else -1

		for i in range g.N
			@persons[i].id = i
			@persons[i].elo = parseInt @persons[i].elo

		if g.FACTOR > 0  
			if g.FACTOR < 1.2 then g.FACTOR = 1.2
			XMAX = @persons[0].elo
			XMIN = _.last(@persons).elo
			g.OFFSET = (XMAX - XMIN) / (g.FACTOR - 1) - XMIN
			g.OFFSET = Math.round g.OFFSET
			print 'XMIN,XMAX,g.OFFSET',g.OFFSET,XMIN,XMAX

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

		@dump 'fetch'
		
		g.pages = [new Tables, new Names, new Standings, new Active]

		g.pages[g.NAMES].setLista()
		g.pages[g.TABLES].setLista()
		g.pages[g.STANDINGS].setLista()

	makePaused : -> @paused.join SEPARATOR # (12!34)

	makePlayers : ->
		players = (p.write() for p in @persons)
		players.join "\n"

	makeTournament : (timestamp) ->
		res = []
		res.push "FACTOR=" + g.FACTOR
		res.push "ROUND=" + @round
		res.push "TOUR=" + @title
		res.push "DATE=" + @datum
		res.push "TIMESTAMP=" + timestamp
		res.push "K=" + g.K
		res.push "TPP=" + @tpp
		res.push "PPP=" + @ppp
		res.push "PAUSED=" + @makePaused()
		res.push "PLAYERS="
		res.push @makePlayers()
		res.join '\n'

	makeStandardFile : ->
		res = []
		timestamp = new Date().toLocaleString 'se-SE'
		# print timestamp
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
					result.push abs(pa.elo - pb.elo) 
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
		output.push "Sparseness: #{average}  (Average Elo Difference) DIFF:#{g.DIFF} EXPONENT:#{g.EXPONENT} COLORS:#{g.COLORS} K:#{g.K}"
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
				# print 'drawMatrix',a,b
				if a < 0 or b < 0 then continue
				if @persons[a].active and @persons[b].active
					canvas[a][b] = g.ALFABET[i]
					canvas[b][a] = g.ALFABET[i]
		@dumpCanvas title,@distans(rounds),canvas

	makeMatrix : ->
		matrix = []
		for r in range @round
			res = []
			for p in @persons
				res.push [p.id,p.opp[r]]				
			matrix.push res
		@drawMatrix @title, matrix

	makeBubbles : ->
		res = []
		for pa in @persons
			for r in range @round
				if pa.opp[r] >= 0 
					pb = @persons[pa.opp[r]]
					res.push "#{pa.elo}\t#{pb.elo}"
		res.join '\n'
