import { g,print,range,scalex,scaley } from './globals.js' 
import { Page } from './page.js' 
import { Button,spread } from './button.js' 
import { Lista } from './lista.js'  

export class Names extends Page

	constructor : ->
		super()
		@buttons.n.active = false
		@buttons.ArrowLeft  = new Button '', '', () => g.setState g.TABLES
		@buttons.ArrowRight = new Button '', '', () => g.setState g.ACTIVE

	setLista : ->
		@lista = new Lista @t.playersByName, "Table Name", @buttons, (p) =>
			r = @t.round - 1
			s = if p.active then "#{str(1 + p.chair // 2).padStart(3)} #{g.RINGS[p.col[r][0]]} " else 'pause '
			s + g.txtT p.name, 25, window.LEFT
		spread @buttons, 10, @y, @h

	mouseWheel   : (event )-> @lista.mouseWheel event
	mousePressed : (event) -> @lista.mousePressed event
	keyPressed   : (event) -> @buttons[key].click()

	make : (res,header,players) ->
		#print 'make.@t.round',@t.round
		res.push "NAMES" + header
		res.push ""
		r = @t.round
		for [player,index],i in players			
			#print 'player,index',player,index
			if i % @ppp == 0 then res.push "Table Name"
			res.push "#{str(1 + index//2).padStart(3)} #{g.RINGS[player.col[r][0]]} #{player.name}"
			if i % @ppp == @ppp-1 then res.push "\f"
		res.push "\f"

	draw : ->
		fill 'white'
		@showHeader @t.round
		@lista.draw()
		for key,button of @buttons
			button.draw()