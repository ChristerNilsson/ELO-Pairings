import { g, range, print, scalex, scaley } from './globals.js' 
import { parseExpr } from './parser.js'
import { Player } from './player.js'
import { Edmonds } from './mattkrick.js' 

import { Tables } from './page_tables.js' 
import { Names } from './page_names.js' 
import { Standings } from './page_standings.js' 
import { Active } from './page_active.js' 

export class Tournament 
	constructor : () ->
		@title = ''
		#@rounds = 0
		@round = 0
		@sp = 0.0 # 0.01
		@tpp = 30
		@ppp = 60

		# dessa tre listor pekar på samma objekt
		@players = []
		@persons = [] # stabil, sorterad på id och elo
		@pairs = [] # varierar med varje rond

		@robin = range g.N
		# @fetchURL()
		@mat = []

		@bonus = {'w2': 1, 'b2': 1+2*@sp, 'w1': 0.5-@sp, 'b1': 0.5+@sp, 'w0': 0, 'b0': 0}

	write : () ->

	makeEdges : ->
		edges = []
		for a in range g.N  # tag med frironden
			pa = @persons[a]
			if not pa.active then continue
			for b in range a+1,g.N
				pb = @persons[b]
				if not pb.active then continue
				if g.DIFF == 'ELO' then diff = abs pa.elo - pb.elo
				if g.DIFF == 'ID'  then diff = abs pa.id - pb.id
				if g.COST == 'LINEAR'    then cost = 2000 - diff
				if g.COST == 'QUADRATIC' then cost = 2000 - diff ** 1.01
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

	preMatch : ->
		for p in @persons
			if p.res.length < p.col.length then p.res += '0'

		active = _.filter @persons.slice(0,@persons.length-1), (p) -> p.active
		# @persons[g.N].active = active.length % 2 == 1

	postMatch : ->
		for p in @persons
			if p.active then continue
			p.opp.push -1
			# p.res += '0'
			p.col += ' '

		for [a,b] in @pairs
			pa = @persons[a]
			pb = @persons[b]
			pa.opp.push pb.id
			pb.opp.push pa.id

		# print @persons

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

		g.calcMissing()

		if @round > 0 
			missing = 0
			for p in @persons
				if p.active and p.res.length < p.col.length then missing++
			if missing > 0
				print 'lottning ej genomförd!'
				return

		@preMatch()

		print "Lottning av rond #{@round}"
		document.title = "Round #{@round+1}"

		start = new Date()
		net = @makeEdges @persons
		solution = @findSolution net
		print 'cpu:',new Date() - start,'ms'
		print 'solution', solution

		missing = _.filter solution, (x) -> x==-1

		inactive = _.filter @persons.slice(0,@persons.length-1), (p) -> not p.active

		print 'lotta', missing.length, inactive.length
		if missing.length != inactive.length
			print 'Solution failed!'
			return 

		@pairs = @unscramble solution
		print 'pairs',@pairs

		@postMatch()

		g.pages[g.NAMES].setLista()
		g.pages[g.TABLES].setLista()
		g.pages[g.STANDINGS].setLista()

		timestamp = new Date().toLocaleString('se-SE').replaceAll ' ','_'

		@downloadFile @makeURL(timestamp), "#{timestamp}-#{@round} URL.txt"
		@downloadFile @makeStandardFile(), "#{timestamp}-#{@round}.txt"

		# if @round > 0 then print @makeMatrix() # skriver till debug-fönstret, time outar inte.
		# if @round > 0 then downloadFile @makeMatrix(), "#{@title} R#{@round} Matrix.txt" # (time outar, filen sparas inte)

		@round += 1

		print 'lotta round', @round
		g.state = g.TABLES

	fetchURL : (url = location.search) ->
		if url == '' then window.location.href = "https://github.com/ChristerNilsson/Dense/blob/main/README.md"
		print 'fetchURL',url
		getParam = (name,def) -> urlParams.get(name) || def

		urlParams = new URLSearchParams url
		@players = []
		@title = urlParams.get('TOUR').replaceAll '_',' '
		@datum = urlParams.get('DATE') or ""
		#@rounds = parseInt urlParams.get 'ROUNDS'
		@round = parseInt urlParams.get 'ROUND'
		@first = getParam 'FIRST','bw' # Determines if first player has white or black in the first round
		@sp = parseFloat getParam 'SP', 0.0 # ScorePoints
		@tpp = parseInt getParam 'TPP',30 # Tables Per Page
		@ppp = parseInt getParam 'PPP',60 # Players Per Page

		players = urlParams.get 'PLAYERS'
		players = players.replaceAll ')(', ')|('
		players = players.replaceAll '_',' '
		players = '(' + players + ')'
		players = parseExpr players
		print 'fetchURL.players',players

		g.N = players.length

		if g.N < 4
			print "Error: Number of players must be 4 or more!"
			return
		if g.N > 999
			print "Error: Number of players must be 1999 or less!"
			return

		# g.N-- # pga BYE

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

		# if @round == 0 then @persons.push new Player g.N, 'BYE', 0 # Frirond ska ALLTID finnas, men kanske vara inaktiv

		# @playersByName = _.sortBy @persons.slice(0, @persons.length-1), (player) -> player.name
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
		#res.push "https://christernilsson.github.io/Dense"
		res.push "http://127.0.0.1:5500"
		res.push "?TOUR=" + @title.replaceAll ' ','_'
		res.push "&TIMESTAMP=" + timestamp
		#res.push "&ROUNDS=" + @rounds
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
		players = []
		for i in range @pairs.length
			[a,b] = @pairs[i]
			pa = @persons[a]
			pb = @persons[b]
			players.push [pa,2*i]
			players.push [pb,2*i+1]
		players = _.sortBy players, (p) -> p[0].name

		timestamp = new Date().toLocaleString('se-SE') #.slice 0,16
		print timestamp
		header_after = " for " + @title + " after Round #{@round}    #{timestamp}"
		header_in    = " for " + @title + " in Round #{@round+1}    #{timestamp}"

		if @round < 999 then g.pages[g.STANDINGS].make res, header_after
		if @round >= 0  then g.pages[g.NAMES].make     res, header_in,players
		if @round < 999 then g.pages[g.TABLES].make    res, header_in

		res.join "\n"	

	distans : (rounds) ->
		result = []
		for i in range(rounds.length) 
			for [a,b] in rounds[i]
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
		output.push "Sparseness: #{average}  (Average Elo Difference) DIFF:#{g.DIFF} COST:#{g.COST} COLORS:#{g.COLORS} SP:#{@sp}"
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