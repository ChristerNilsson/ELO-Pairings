import { parseExpr } from './parser.js'
import { g,print,range } from './globals.js' 
import { Button,spread } from './button.js' 
import { Lista } from './lista.js' 
import { Tournament } from './tournament.js' 
import { Tables } from './page_tables.js' 
import { Names } from './page_names.js' 
import { Standings } from './page_standings.js' 
import { Active } from './page_active.js' 

# g.LPP = 14
g.RINGS = {'b':'•', ' ':' ', 'w':'o'}
g.ASCII = '0123456789abcdefg'
g.ALFABET = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' # 62 ronder maximalt

datum = ''

g.tournament = null
g.errors = [] # id för motsägelsefulla resultat. Tas bort med Delete
g.pages = []

window.windowResized = -> 
	resizeCanvas windowWidth, windowHeight-4
	g.LPP = height // g.ZOOM[g.state] - 4

window.setup = ->
	createCanvas windowWidth-4,windowHeight-4
	textFont 'Courier New'
	# textAlign window.LEFT,window.TOP
	textAlign CENTER,CENTER
	rectMode window.CORNER
	noStroke()

	g.ZOOM = [20,20,20,20] # vertical line distance for four states
	g.state = g.TABLES
	g.LPP = height // g.ZOOM[g.state] - 4

	g.N = 0 # number of players
	g.tournament = new Tournament()
	g.state = g.ACTIVE

	g.pages = [new Tables, new Names, new Standings, new Active]
	print g.pages

	g.tournament.fetchURL()

	window.windowResized()

window.draw = ->
	background 'gray'
	textSize g.ZOOM[g.state]
	g.pages[g.state].draw()

window.mousePressed = (event) -> g.pages[g.state].mousePressed event
window.mouseWheel   = (event) -> g.pages[g.state].mouseWheel event
window.keyPressed   = (event) -> 
	key2 = key
	if key2 in ['Control','Shift','I'] then return
	if key2 == '1' then key2 = 'K1'
	if key2 == '0' then key2 = 'K0'
	g.pages[g.state].keyPressed event,key2
