import { g,print,range,scalex,scaley } from './globals.js' 

export class Player
	constructor : (@id, @name="", @elo="1400", @opp=[], @col="", @res="") -> @active = true

	toString : -> "#{@id} #{@name} elo:#{@elo} #{@col} res:#{@res} opp:[#{@opp}] score:#{@score().toFixed(1)} eloSum:#{@eloSum(g.tournament.round).toFixed(0)}"

	toggle : -> 
		@active = not @active
		g.tournament.paused = (p.id for p in g.tournament.persons when not p.active)

	eloSum : (rounds) => 
		#if g.tournament.round == 0 then return 0
		summa = 0
		if @name == 'BYE' then return 0
		for r in range rounds
			if @opp[r] != -1 then summa += g.tournament.persons[@opp[r]].elo * @res[r] / 2 # g.tournament.bonus[@col[r] + @res[r]] 
		summa

	avgEloDiff : ->
		res = []
		for id in @opp.slice 0, @opp.length - 1
			#res.push abs normera(@elo) - normera(tournament.persons[id].elo)
			if id != -1 then res.push abs @elo - g.tournament.persons[id].elo
		if res.length == 0 then 0 else g.sum(res) / res.length

	balans : -> # färgbalans
		result = 0
		for ch in @col
			if ch=='b' then result -= 1
			if ch=='w' then result += 1
		result

	score : ->
		result = 0
		n = g.tournament.round
		sp = g.tournament.sp
		for i in range n
			if i < @col.length and i < @res.length
				key = @col[i] + @res[i]
				#result += {'w2': 1-sp, 'b2': 1, 'w1': 0.5-sp, 'b1': 0.5+sp, 'w0': 0, 'b0': sp}[key]
				res = {'w2': 1, 'b2': 1+2*sp, 'w1': 0.5-sp, 'b1': 0.5+sp, 'w0': 0, 'b0': 0}[key]
		#print 'id,score',@id, @res, result,n
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
			if arr.length == 2 and arr[1].length == 1
				@res += {'0':'0', '½':'1', '1':'2'}[arr[1]]  
		# print 'Player.read',@

	write : -> # (1234|Christer|(12w0|23b½|14w)) Elo:1234 Name:Christer opponent:23 color:b result:½
		res = []
		res.push @elo
		res.push @name.replaceAll ' ','_'
		nn = @opp.length - 1
		ocr = ("#{@opp[i]}#{@col[i]}#{if i < nn then "0½1"[@res[i]] else ''}" for i in range(nn)) 
		res.push '(' + ocr.join('|') + ')'
		res.join '|'