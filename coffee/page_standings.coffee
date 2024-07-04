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

		rheader = _.map range(1,@t.round+1), (i) -> "#{i%10} "
		rheader = rheader.join ' '
		header = ""
		header +=       g.txtT "Pos",          3,window.RIGHT
		header += ' ' + g.txtT "Id",           3,window.RIGHT
		header += ' ' + g.txtT "Elo",          4,window.RIGHT
		header += ' ' + g.txtT "Name",        25,window.LEFT
		header += ' ' + g.txtT rheader,3*@round,window.LEFT 
		header += ' ' + g.txtT "Elos",       8,window.RIGHT

		#print 'standings.setLista:@t.round',@t.round
		# for player in @t.persons
		# 	print player.name,player.opp[@t.round-1], player.eloSum @t.round-1

		# print (p.eloSum(@t.round) for p in @t.persons)

		# print 'before sort',@t.round
		@playersByEloSum = _.clone @t.persons.slice 0,g.N
		@playersByEloSum = _.sortBy @playersByEloSum, (p) => -p.eloSum(@t.round)

		# print 'after sort'
		print (p.eloSum(@t.round) for p in @playersByEloSum)

		@lista = new Lista @playersByEloSum, header, @buttons, (p,index) => # returnera strängen som ska skrivas ut. Dessutom ritas lightbulbs här.
			@y_bulb = (5 + index - @lista.currentRow + g.LPP//2) * g.ZOOM[g.state] 
			textAlign LEFT
			fill 'black' 
			s = ""
			s +=       g.txtT (1+index).toString(),   3, window.RIGHT
			s += ' ' + g.txtT (1+p.id).toString(),    3, window.RIGHT
			s += ' ' + g.txtT p.elo.toString(),       4, window.RIGHT
			s += ' ' + g.txtT p.name,                25, window.LEFT
			s += ' ' + g.txtT '',         3 * (@t.round-1), window.CENTER
			s += ' ' + g.txtT p.eloSum(@t.round-1).toFixed(1),  7, window.RIGHT

			for r in range g.tournament.round #- 1
				x = g.ZOOM[g.state] * (24.2 + 1.8*r)
				if p.opp[r] == -1 then @txt "P", x, @y+1, window.CENTER, 'black'
				else if p.opp[r] == g.N then @txt "BYE", x, @y+1, window.CENTER, 'black'
				else @lightbulb p.col[r], x, @y_bulb, p.res.slice(r,r+1), 1 + p.opp[r]
			s
		@lista.paintYellowRow = false
		spread @buttons, 10, @y, @h

	mouseWheel   : (event )-> @lista.mouseWheel event
	mousePressed : (event) -> @lista.mousePressed event
	keyPressed   : (event) -> @buttons[key].click()

	draw : ->
		# print 'standings.draw'
		fill 'white'
		@showHeader @t.round-1
		@lista.draw()
		for key,button of @buttons
			button.draw()
			# print button.title,button.x,button.y,button.w,button.h

	lightbulb : (color, x, y, result, opponent) ->
		if result == "" then return
		push()
		result = '012'.indexOf result
		fill 'red gray green'.split(' ')[result]
		rectMode window.CENTER
		rect x, y, 1.6 * g.ZOOM[g.state], 0.9 * g.ZOOM[g.state]
		fill {b:'black', ' ':'yellow', w:'white'}[color]
		@txt opponent,x,y+1,window.CENTER
		pop()			

	make : (res,header) ->
		if @t.pairs.length == 0 then res.push "This ROUND can't be paired! (Too many rounds)"

		res.push "STANDINGS" + header
		res.push ""

		header = ""
		header +=       g.txtT "Pos",   3, window.RIGHT
		header += ' ' + g.txtT 'Id',    3, window.RIGHT
		header += ' ' + g.txtT "Elo",   4, window.RIGHT
		header += ' ' + g.txtT "Name", 25, window.LEFT
		for r in range @t.round
			header += g.txtT "#{r+1}",6,window.RIGHT
		header += ' ' + g.txtT "Elos", 9,window.RIGHT
		if @t.round <= @expl then header += '  ' + g.txtT "Explanation", 12,window.LEFT
		
		for person,i in @playersByEloSum
			if i % @t.ppp == 0 then res.push header
			s = ""
			s +=       g.txtT (1+i).toString(),          3, window.RIGHT
			s += ' ' + g.txtT (1+person.id).toString(),  3, window.RIGHT
			s += ' ' + g.txtT person.elo.toString(),     4, window.RIGHT
			s += ' ' + g.txtT person.name,              25, window.LEFT
			s += ' '
			for r in range @t.round
				if person.opp[r] == -1
					s += '      '
				else 
					s += g.txtT "#{1+person.opp[r]}#{g.RINGS[person.col[r][0]]}#{"0½1"[person.res[r]]}", 6, window.RIGHT			
			s += ' ' + g.txtT person.eloSum(@t.round).toFixed(1),  8, window.RIGHT
			res.push s 
			if i % @t.ppp == @t.ppp-1 then res.push "\f"
		res.push "\f"