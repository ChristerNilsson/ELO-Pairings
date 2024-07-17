import { g,print,range,scalex,scaley } from './globals.js' 
import { Page } from './page.js' 
import { Button,spread } from './button.js'  
import { Lista } from './lista.js' 

export class Standings extends Page

	constructor : ->
		super()
		@t = g.tournament
		@buttons.ArrowLeft  = new Button '', '', () => g.setState g.ACTIVE
		@buttons.ArrowRight = new Button '', '', () => g.setState g.TABLES
		@buttons.s.active = false

	setLista : ->

		rheader = _.map range(1,@t.round+1), (i) -> " #{i%10} "
		rheader = rheader.join ''
		header = ""
		header +=       g.txtT "Pos",          3,window.RIGHT
		header += ' ' + g.txtT "Id",           3,window.RIGHT
		header += ' ' + g.txtT "Elo",          4,window.RIGHT
		header += ' ' + g.txtT "Name",        25,window.LEFT
		header += '' + g.txtT rheader, 3*@round,window.LEFT 
		header += ' ' + g.txtT "Change",       8,window.RIGHT

		@playersByPerformance = _.clone @t.persons.slice 0,g.N
		@playersByPerformance = _.sortBy @playersByPerformance, (p) => -(p.change(@t.round))

		print (p.change(@t.round).toFixed(1) for p in @playersByPerformance).join ' '

		@lista = new Lista @playersByPerformance, header, @buttons, (p,index,pos) => # returnera strängen som ska skrivas ut. Dessutom ritas lightbulbs här.
			@y_bulb = (5 + index) * g.ZOOM[g.state] 
			textAlign LEFT
			fill 'black' 
			s = ""
			s +=       g.txtT (1+pos).toString(),     3, window.RIGHT
			s += ' ' + g.txtT (1+p.id).toString(),    3, window.RIGHT
			s += ' ' + g.txtT p.elo0.toString(),      4, window.RIGHT
			s += ' ' + g.txtT p.name,                25, window.LEFT
			s += ' ' + g.txtT '',      3 * (@t.round-1), window.CENTER
			s += ' ' + g.txtT (p.change(@t.round)).toFixed(5), 8, window.RIGHT

			for r in range g.tournament.round - 1 #- 1
				x = g.ZOOM[g.state] * (24.2 + 1.8*r)
				# if p.opp[r] == -1 then @txt "P", x, @y+1, window.CENTER, 'black'
				# else if p.opp[r] == g.N then @txt "BYE", x, @y+1, window.CENTER, 'black'
				# print 'yyy',"<#{p.opp[r]}>"
				@lightbulb p.id, p.col[r], x, @y_bulb, p.res.slice(r,r+1), p.opp[r]
			s
		@lista.paintYellowRow = false
		spread @buttons, 10, @y, @h

	mouseMoved : =>
		r = round ((mouseX / g.ZOOM[g.state] - 24.2) / 1.8)
		iy = @lista.offset + round mouseY / g.ZOOM[g.state] - 5
		if 0 <= iy < @playersByPerformance.length and 0 <= r < g.tournament.round - 1
			a = iy
			pa = @playersByPerformance[a]
			b = pa.opp[r]
			if b == g.BYE   then g.help = "#{pa.elo0} #{pa.name} has a bye => chg = #{g.K/2}"
			if b == g.PAUSE then g.help = "#{pa.elo0} #{pa.name} has a pause => chg = 0"
			if b >= 0				
				pb = @t.persons[b]
				diff = pa.elo0 - pb.elo0
				PD = g.K * g.scoringProbability diff
				chg = pa.calcRound r

				s = ""
				s +=       g.txtT '',                      3, window.RIGHT
				s += ' ' + g.txtT (1+pb.id).toString(),    3, window.RIGHT
				s += ' ' + g.txtT pb.elo0.toString(),      4, window.RIGHT
				s += ' ' + g.txtT pb.name,                25, window.LEFT
				s += ' ' + g.txtT '',       3 * (@t.round-1), window.LEFT
				s += ' ' + g.txtT chg.toFixed(3),          7, window.RIGHT
				s += ' ' + g.txtT diff,                    6, window.RIGHT
				g.help = s
		else
			g.help = ""

	mouseWheel   : (event )-> @lista.mouseWheel event
	mousePressed : (event) -> @lista.mousePressed event
	keyPressed   : (event) -> @buttons[key].click()

	draw : ->
		fill 'white'
		@showHeader @t.round-1
		@lista.draw()
		for key,button of @buttons
			button.draw()
		textAlign LEFT
		text g.help, 10, 3*g.ZOOM[g.state]

	show : (s,x,y,bg,fg) ->
		fill bg
		rect x, y, 1.6 * g.ZOOM[g.state], 0.9 * g.ZOOM[g.state]
		fill fg
		@txt s, x, y+1, window.CENTER

	lightbulb : (id, color, x, y, result, opponent) ->
		# print "lightbulb id:#{id} color:#{color} x:#{x} y#{y} result:#{result} opponent:#{opponent}"
		push()
		rectMode window.CENTER
		s = 1 + opponent
		if opponent == g.PAUSE then @show " P ",x,y,"gray",'yellow'
		if opponent == g.BYE   then @show "BYE",x,y,"green",'yellow'
		if opponent >= 0
			result = '012'.indexOf result
			@show 1+opponent, x, y, 'red gray green'.split(' ')[result], {b:'black', ' ':'yellow', w:'white'}[color]
		pop()

	make : (res,header) ->
		if @t.pairs.length == 0 then res.push "This ROUND can't be paired! (Too many rounds)"

		res.push "STANDINGS" + header
		res.push ""

		header = ""
		header +=       g.txtT "Pos",   3, window.RIGHT
		header += ' ' + g.txtT 'Id',    3, window.RIGHT
		header += ' ' + g.txtT "Elo0",  4, window.RIGHT
		header += ' ' + g.txtT "Name", 25, window.LEFT
		for r in range @t.round
			header += g.txtT "#{r+1}",  6,window.RIGHT
		header += ' ' + g.txtT "Chg",   7,window.RIGHT
		header += ' ' + g.txtT "Elo",   7,window.RIGHT
		if @t.round <= @expl then header += '  ' + g.txtT "Explanation", 12,window.LEFT
		
		for person,i in @playersByPerformance
			# elo = person.elo # @t.round
			if i % @t.ppp == 0 then res.push header
			s = ""
			s +=       g.txtT (1+i).toString(),          3, window.RIGHT
			s += ' ' + g.txtT (1+person.id).toString(),  3, window.RIGHT
			s += ' ' + g.txtT person.elo0.toString(),    4, window.RIGHT
			s += ' ' + g.txtT person.name,              25, window.LEFT
			s += ' '
			for r in range @t.round
				if person.opp[r] == -2 then s += '    P '
				if person.opp[r] == -1 then s += '   BYE'
				if person.opp[r] >= 0
					s += g.txtT "#{1+person.opp[r]}#{g.RINGS[person.col[r][0]]}#{"0½1"[person.res[r]]}", 6, window.RIGHT			

			s += ' ' + g.txtT (person.change(@t.round)).toFixed(1),  6, window.RIGHT
			# s += ' ' + g.txtT elo.toFixed(2),  7, window.RIGHT
			# s += ' ' + g.txtT person.elo(@t.round).toFixed(1),  8, window.RIGHT
			res.push s 
			if i % @t.ppp == @t.ppp-1 then res.push "\f"
		res.push "\f"