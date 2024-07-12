import { g,print,range,scalex,scaley } from './globals.js' 

export class Player
	constructor : (@id, @name="", @elo="1400", @opp=[], @col="", @res="", @active = true) -> 

	toString : -> "#{@id} #{@name} elo:#{@elo} #{@col} res:#{@res} opp:[#{@opp}] score:#{@score().toFixed(1)} perf:#{@performance(g.tournament.round).toFixed(0)}"

	toggle : -> 
		@active = not @active
		g.tournament.paused = (p.id for p in g.tournament.persons when not p.active)

	scoringProbability : (diff) -> 1 / (1 + pow 10, diff/400)

	#bye : -> _.some @opp, (item) -> item == g.BYE
	bye : -> g.BYE in @opp

	calcRound : (r) ->
		g.K = g.K0 * g.k ** r
		if @opp[r] == g.BYE then return g.K * (1.0 - @scoringProbability 0)
		if @opp[r] == g.PAUSE then return 0
		a = @elo
		b = g.tournament.persons[@opp[r]].elo
		diff = b - a
		if @res[r] == '2' then return g.K * (1.0 - @scoringProbability diff)
		if @res[r] == '1' then return g.K * (0.5 - @scoringProbability diff)
		if @res[r] == '0' then return g.K * (0.0 - @scoringProbability diff)
		0

	performance : (rounds) -> @elo + g.sum (@calcRound r for r in range rounds)

	avgEloDiff : ->
		res = []
		for id in @opp.slice 0, @opp.length - 1
			if id >= 0 then res.push abs @elo - g.tournament.persons[id].elo
		if res.length == 0 then 0 else g.sum(res) / res.length

	balans : -> # färgbalans
		result = 0
		for ch in @col
			if ch=='b' then result -= 1
			if ch=='w' then result += 1
		result

	read : (player) -> 
		@elo = parseInt player[0]
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
		res.push @elo
		res.push @name.replaceAll ' ','_'
		r = @opp.length - 1
		ocr = ("#{@opp[i]}#{@col[i]}#{if i < r then @res[i] else ''}" for i in range(r)) 
		res.push '(' + ocr.join('!') + ')'
		res.join '!'