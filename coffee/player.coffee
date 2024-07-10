import { g,print,range,scalex,scaley } from './globals.js' 

export class Player
	constructor : (@id, @name="", @elo="1400", @opp=[], @col="", @res="") -> @active = true

	toString : -> "#{@id} #{@name} elo:#{@elo} #{@col} res:#{@res} opp:[#{@opp}] score:#{@score().toFixed(1)} perf:#{@performance(g.tournament.round).toFixed(0)}"

	toggle : -> 
		@active = not @active
		g.tournament.paused = (p.id for p in g.tournament.persons when not p.active)

	scoringProbability : (diff) -> 1 / (1 + pow 10, diff/400)

	calcRound : (r) -> # Hur hantera frirond?
		if @opp[r] == -1 then return 0
		b = @elo
		c = g.tournament.persons[@opp[r]].elo
		diff = b - c
		if @res[r] == '2' then return       g.K * @scoringProbability diff
		if @res[r] == '1' then return 0.5 * g.K * @scoringProbability diff
		if @res[r] == '0' then return      -g.K * @scoringProbability -diff
		0

	performance : (rounds) -> 
		asum = 0
		for r in range rounds
			asum += @calcRound r
		@elo + asum

	avgEloDiff : ->
		res = []
		for id in @opp.slice 0, @opp.length - 1
			if id != -1 then res.push abs @elo - g.tournament.persons[id].elo
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