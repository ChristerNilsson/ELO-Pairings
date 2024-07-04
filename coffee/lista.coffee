import { g,print,range,scalex,scaley } from './globals.js' 

export class Lista
	constructor : (@objects=[], @columnTitles="", @buttons={}, @drawFunction=null) -> # a list of players. Or a list of pairs of players
		#(g.LPP+10)//2 # den skall alltid visas i mitten
		@N = @objects.length
		@paintYellowRow = true
		@errors = [] # list with index of erroneous rows
		@currentRow = 0 
		@PageDown()

	draw : -> # ritar de rader som syns i fönstret enbart
		s = @columnTitles
		fill 'white'
		textAlign window.LEFT
		text s,10,scaley(4)

		y = (2 + g.LPP)//2 # mitten av skärmen
		fill 'black'
		r = g.tournament.round - 1
		a = (1-g.LPP)//2
		b = (1+g.LPP)//2
		for delta in range a,b
			iRow = @currentRow + delta
			if iRow < 0 then continue
			if iRow >= @N then continue
			p = @objects[iRow]
			s = @drawFunction p, iRow
			if iRow == @currentRow
				fill 'yellow'
				w = if @paintYellowRow then width else scaley(23.4)
				rect 0, scaley(y + 3.5), w, scaley(1)
				fill 'black'
			fill if iRow in @errors then 'red' else 'black'
			text s,10, scaley(y + delta+4)

	keyPressed : (event, key) -> @buttons[key].click()
	mouseWheel : (event) -> @move if event.delta < 0 then -1 else 1
	mousePressed : -> 
		if mouseY > scaley(4)
			@move round mouseY / g.ZOOM[g.state] - g.LPP/2 - 4 - 1
		else
			for key,button of @buttons
				if button.active and button.inside mouseX,mouseY then button.click()

	ArrowUp   : -> @move -1
	ArrowDown : -> @move 1
	PageUp    : -> @move -g.LPP//2 
	PageDown  : -> @move g.LPP//2
	Home      : -> @move -@currentRow
	End       : -> @move @N - @currentRow

	move : (delta) ->
		@currentRow += delta
		if @currentRow < 0 then @currentRow = 0
		if @currentRow >= @N then @currentRow = @N-1
		event.preventDefault()