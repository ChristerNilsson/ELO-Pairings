import { g,print,range,scalex,scaley,random } from './globals.js' 
import { Page } from './page.js' 
import { Button,spread } from './button.js'  
import { Lista } from './lista.js' 

export class Tables extends Page

	constructor : ->
		super()

		@buttons.ArrowLeft  = new Button '', '', () => g.setState g.STANDINGS
		@buttons.ArrowRight = new Button '', '', () => g.setState g.NAMES

		@buttons.p      = new Button 'Pair','P = Perform pairing now',   () => @t.lotta()
		@buttons.K0     = new Button '0',      '0 = White Loss',         () => @handleResult '0'
		@buttons[' ']   = new Button '½',      'space = Draw',           () => @handleResult ' '
		@buttons.K1     = new Button '1',      '1 = White Win',          () => @handleResult '1'
		@buttons.Delete = new Button 'Delete', 'delete = Remove result', () => @handleDelete()
		@buttons.r      = new Button 'Random', 'R = Random results',     () => @randomResult()

		@buttons.t.active = false

		# @setLista()

	setLista : =>
		# print 'Lista', g.tournament.pairs.length
		header = ""
		header +=       g.txtT 'Tbl',    3,window.RIGHT
		header += ' ' + g.txtT 'Elo',    4,window.RIGHT
		header += ' ' + g.txtT 'White', 25,window.LEFT
		header += ' ' + g.txtT 'Result', 7,window.CENTER
		header += ' ' + g.txtT 'Black', 25,window.LEFT
		header += ' ' + g.txtT 'Elo',    4,window.RIGHT

		@lista = new Lista @t.pairs, header, @buttons, (pair,index) =>
			[a,b] = pair
			pa = @t.persons[a]
			pb = @t.persons[b]
			both = if pa.res.length == pa.col.length then g.prBoth _.last(pa.res) else "   -   "

			nr = index + 1
			s = ""
			s += g.txtT nr.toString(), 3, window.RIGHT
			s += ' ' + g.txtT pa.elo.toString(), 4, window.RIGHT
			s += ' ' + g.txtT pa.name, 25, window.LEFT
			s += ' ' + g.txtT both,7, window.CENTER
			s += ' ' + g.txtT pb.name, 25, window.LEFT
			s += ' ' + g.txtT pb.elo.toString(), 4, window.RIGHT
			s

		@lista.errors = []
		spread @buttons, 10, @y, @h
		@setActive()

	mouseWheel   : (event )-> @lista.mouseWheel event
	mousePressed : (event) -> @lista.mousePressed event
	keyPressed   : (event,key) -> @buttons[key].click()

	draw : ->
		fill 'white'
		@showHeader @t.round
		for key,button of @buttons
			button.draw()
		@lista.draw()

	elo_probabilities : (R_W, R_B, draw=0.2) ->
		E_W = 1 / (1 + 10 ** ((R_B - R_W) / 400))
		win = E_W - draw / 2
		loss = (1 - E_W) - draw / 2
		x = random()
		index = 2
		if x < loss + draw then index = 1
		if x < loss then index = 0
		index
	
	setActive : ->
		@buttons.p.active = g.calcMissing()
		if g.pages[g.ACTIVE] then g.pages[g.ACTIVE].buttons.p.active = @buttons.p.active

	handleResult : (key) =>
		[a,b] = @t.pairs[@lista.currentRow]
		pa = @t.persons[a]
		pb = @t.persons[b]
		index = '0 1'.indexOf key
		ch = "012"[index]
		if pa.res.length == pa.col.length 
			if ch != _.last pa.res then @lista.errors.push @lista.currentRow
		else
			if pa.res.length < pa.col.length then pa.res += "012"[index]
			if pb.res.length < pb.col.length then pb.res += "210"[index]
		@lista.currentRow = (@lista.currentRow + 1) %% @t.pairs.length
		@setActive()

	randomResult : ->
		for i in range @t.pairs.length
			[a,b] = @t.pairs[i]
			pa = @t.persons[a]
			pb = @t.persons[b]
			res = @elo_probabilities pa.elo, pb.elo
			if pa.res.length < pa.col.length then pa.res += "012"[res] 
			if pb.res.length < pb.col.length then pb.res += "210"[res]
		@setActive()

	handleDelete : ->
		i = @lista.currentRow
		[a,b] = @t.pairs[i]
		pa = @t.persons[a]
		pb = @t.persons[b]
		@lista.errors = (e for e in @lista.errors when e != i)
		if pa.res.length == pb.res.length
			[a,b] = @t.pairs[i]
			pa = @t.persons[a]
			pb = @t.persons[b]
			pa.res = pa.res.substring 0,pa.res.length-1
			pb.res = pb.res.substring 0,pb.res.length-1
		@lista.currentRow = (@lista.currentRow + 1) %% @t.pairs.length
		@setActive()

	make : (res,header) ->
		res.push "TABLES" + header
		res.push ""
		for i in range @t.pairs.length
			[a,b] = @t.pairs[i]
			if i % @t.tpp == 0 then res.push "Table      #{g.RINGS.w}".padEnd(25) + _.pad("",28+10) + "#{g.RINGS.b}" #.padEnd(25)
			pa = @t.persons[a]
			pb = @t.persons[b]
			res.push ""
			res.push _.pad(i+1,6) + pa.elo + ' ' + g.txtT(pa.name, 25, window.LEFT) + ' ' + _.pad("|____| - |____|",20) + ' ' + pb.elo + ' ' + g.txtT(pb.name, 25, window.LEFT)
			if i % @t.tpp == @t.tpp-1 then res.push "\f"