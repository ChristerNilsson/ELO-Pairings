import { g,print,range,scalex,scaley } from './globals.js' 

export class Player
	constructor : (@id, @name="", @elo0="1400", @opp=[], @col="", @res="", @active = true) -> 
		@cache = {}
		@pos = [] # one for each round

	# toString : -> "#{@id} #{@name} elo0:#{@elo0} #{@col} res:#{@res} opp:[#{@opp}] score:#{@score().toFixed(1)} elo:#{@elo(g.tournament.round).toFixed(0)}"

	toggle : -> 
		@active = not @active
		g.tournament.paused = (p.id for p in g.tournament.persons when not p.active)

	bye : -> g.BYE in @opp

	calcRound : (r) ->
		if @opp[r] == g.BYE then return g.K * (1.0 - g.scoringProbability 0)
		if @opp[r] == g.PAUSE then return 0
		a = @elo0
		b = g.tournament.persons[@opp[r]].elo0
		diff = b - a
		g.K * (@res[r]/2 - g.scoringProbability diff)
		# if @res[r] == '1' then return g.K * (0.5 - g.scoringProbability diff)
		# if @res[r] == '0' then return g.K * (0.0 - g.scoringProbability diff)
		# 0

	elo : (rounds) ->
		if rounds of @cache then return @cache[rounds]
		@cache[rounds] = @elo0 + g.sum (@calcRound r for r in range rounds) # latest elos

	avgEloDiff : ->
		res = []
		for id in @opp.slice 0, @opp.length - 1
			if id >= 0 then res.push abs @elo0 - g.tournament.persons[id].elo0
		if res.length == 0 then 0 else g.sum(res) / res.length

	balans : -> # färgbalans
		result = 0
		for ch in @col
			if ch=='b' then result -= 1
			if ch=='w' then result += 1
		result

	read : (player) -> 
		@elo0 = parseInt player[0]
		@name = player[1]
		@opp = []
		@col = ""
		@res = ""
		if player.length < 3 then return
		ocrs = player[2]
		for ocr in ocrs
			if 'w' in ocr then col='w' else col='b'
			arr = ocr.split col
			@opp.push parseInt arr[0]
			@col += col
			if arr.length == 2 and arr[1].length == 1 then @res += arr[1]

	write : -> # (1234!Christer!(12w0!23b1!142)) Elo:1234 Name:Christer opponent:23 color:b result:1
		res = []
		res.push @elo0
		res.push @name.replaceAll ' ','_'
		r = @opp.length - 1
		ocr = ("#{@opp[i]}#{@col[i]}#{if i < r then @res[i] else ''}" for i in range(r)) 
		res.push '(' + ocr.join('!') + ')'
		res.join '!'