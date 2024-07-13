# Elo Pairings

* All players meet players with similar Elo rating
* All Elo ratings are also updated after each round

# Philosophy

* Players should always meet players of similar strength
* Elo rating is used instead of adding game scores (1,0.5 and 0)
* Similar Elo rating has higher priority then similar score
* The Elo rating is used as the primary measurement and reflects the coming official Elo update.

# Color handling

* Same color only possible after even number of rounds. 
* •o•o•o or o•o•o• is the ideal
* •o•oo• happens for most players
* •• never happens
* o•• may happen 
* #of blacks minus #of whites is always one of -1, 0 or 1

# Pages

The are four pages:
* Standings (The final listing ordered by Elo rating)
* Tables    (shows where to sit and also used for entering results)
* Names     (shows where to sit alphabetically)
* Activity  (Pause and activate players)

Navigate between them by clicking with the mouse, using the letters STNA or Left and Right Arrow.

# Lists

The following keys are available:  
Up, Down, Home, End, PageUp, PageDown  
You can also use the mouseWheel to scroll.  

# Zoom

* In and Out

# Always print the Table Sheets for entering results.

This is your secondary backup!  
You can handle a tournament without a printer, but it is not recommended.  
After pairing, go to the Downloads section of your browser (ctrl+j) and open the top file.  
It contains Standings, Names and Tables.  
Print the file, and put up the alphabetical Name sheets, well separated, in the same position every time.  

# Entering Results

* Use 1, space and 0 to enter each result.
* Enter the result twice to double check
* A result can be deleted with the Delete key

# Standings

* Get detailed information about a game by hovering the mouse
* Columns
	* Pos - the leader is number 1.
	* Id - the player identification
	* Elo0 - the elo before the first round
	* Name
	* The rounds
		* Green background - a Win
		* Red background - a Loss
		* Gray background - a draw
		* White id - white pieces
		* Black id - black pieces
	* Chg - the total Elo rating change in all rounds
		* Most changes are approx: Win = K/2 Draw = 0 Loss = -K/2 as the elo differences are small.
	* Elo = Elo0 + Chg

# Downloads

* The first file is a copy of Standings, Names and Tables
* The second file contains a URL containing all data. Use as a backup.

# Demos

[14 players](https://christernilsson.github.io/ELO-Pairings/?TOUR=Klass_1&DATE=2024-05-28&PLAYERS=(1825!JOHANSSON_Lennart_B.)(1697!BJÖRKDAHL_Göran)(1684!SILINS_Peteris)(1681!STOLOV_Leonid)(1644!PETTERSSON_Lars-Åke)(1598!AIKIO_Onni)(1598!ISRAEL_Dan)(1583!PERSSON_Kjell)(1561!LILJESTRÖM_Tor)(1559!LEHVONEN_Jouko)(1539!ANDERSSON_Lars_Owe)(1535!ÅBERG_Lars-Erik)(1532!ANTONSSON_Görgen)(1400!STRÖMBÄCK_Henrik)) 

[Edit](https://github.com/ChristerNilsson/ELO-Pairings/blob/main/tournaments/14.txt)  

[78 players](https://christernilsson.github.io/ELO-Pairings/?TOUR=Tyresö_Open_2024&DATE=2024-05-03&PLAYERS=(2416!Hampus_Sörensen)(2413!Michael_Wiedenkeller)(2366!Joar_Ölund)(2335!Joar_Östlund)(2272!Vidar_Grahn)(2235!Leo_Crevatin)(2213!Daniel_Vesterbaek_Pedersen)(2141!Victor_Muntean)(2113!Filip_Björkman)(2109!Vidar_Seiger)(2108!Pratyush_Tripathi)(2093!Erik_Dingertz)(2076!Michael_Duke)(2065!Matija_Sakic)(2048!Michael_Mattsson)(2046!Lukas_Willstedt)(2039!Lavinia_Valcu)(2035!Oliver_Nilsson)(2031!Lennart_Evertsson)(2022!Jussi_Jakenberg)(2001!Aryan_Banerjee)(1985!Tim_Nordenfur)(1977!Elias_Kingsley)(1954!Per_Isaksson)(1944!Cristine_Rose_Mariano)(1936!Lo_Ljungros)(1923!Herman_Enholm)(1907!Carina_Wickström)(1897!Joel_Åhfeldt)(1896!Stefan_Nyberg)(1893!Hans_Rånby)(1889!Mikael_Blom)(1886!Joar_Berglund)(1885!Mikael_Helin)(1880!Olle_Ålgars)(1878!Jesper_Borin)(1871!Khaschuluu_Sergelenbaatar)(1852!Roy_Karlsson)(1848!Fredrik_Möllerström)(1846!Kenneth_Fahlberg)(1835!Peder_Gedda)(1833!Karam_Masoudi)(1828!Christer_Johansson)(1827!Anders_Kallin)(1818!Morris_Bergqvist)(1803!Martti_Hamina)(1800!Björn_Löfström)(1796!Nicholas_Bychkov_Zwahlen)(1794!Jonas_Sandberg)(1793!Rohan_Gore)(1787!Kjell_Jernselius)(1783!Radu_Cernea)(1778!Mukhtar_Jamshedi)(1768!Neo_Malmquist)(1763!Joacim_Hultin)(1761!Lars-Åke_Pettersson)(1748!André_J_Lindebaum)(1733!Lars_Eriksson)(1733!Hugo_Hardwick)(1728!Hugo_Sundell)(1726!Simon_Johansson)(1721!Jouni_Kaunonen)(1709!Eddie_Parteg)(1695!Sid_Van_Den_Brink)(1691!Svante_Nödtveidt)(1688!Anders_Hillbur)(1680!Sayak_Raj_Bardhan)(1671!Salar_Banavi)(1650!Patrik_Wiss)(1641!Anton_Nordenfur)(1624!Jens_Ahlström)(1622!Hanns_Ivar_Uniyal)(1579!Christer_Carmegren)(1575!Christer_Nilsson)(1524!Måns_Nödtveidt)(1480!Karl-Oskar_Rehnberg)(1417!David_Broman)(1406!Vida_Radon)) 

[Edit](https://github.com/ChristerNilsson/ELO-Pairings/blob/main/tournaments/78.txt)

[Dev](https://127.0.0.1:5500)

[Dev 14](https://127.0.0.1:5500/?TOUR=Klass_1&DATE=2024-05-28&PLAYERS=(1825!JOHANSSON_Lennart_B.)(1697!BJÖRKDAHL_Göran)(1684!SILINS_Peteris)(1681!STOLOV_Leonid)(1644!PETTERSSON_Lars-Åke)(1598!AIKIO_Onni)(1598!ISRAEL_Dan)(1583!PERSSON_Kjell)(1561!LILJESTRÖM_Tor)(1559!LEHVONEN_Jouko)(1539!ANDERSSON_Lars_Owe)(1535!ÅBERG_Lars-Erik)(1532!ANTONSSON_Görgen)(1400!STRÖMBÄCK_Henrik)) 

[Edit](https://github.com/ChristerNilsson/ELO-Pairings/blob/main/tournaments/14.txt)  

[Dev 78](https://127.0.0.1:5500/?TOUR=Tyresö_Open_2024&DATE=2024-05-03&PLAYERS=(2416!Hampus_Sörensen)(2413!Michael_Wiedenkeller)(2366!Joar_Ölund)(2335!Joar_Östlund)(2272!Vidar_Grahn)(2235!Leo_Crevatin)(2213!Daniel_Vesterbaek_Pedersen)(2141!Victor_Muntean)(2113!Filip_Björkman)(2109!Vidar_Seiger)(2108!Pratyush_Tripathi)(2093!Erik_Dingertz)(2076!Michael_Duke)(2065!Matija_Sakic)(2048!Michael_Mattsson)(2046!Lukas_Willstedt)(2039!Lavinia_Valcu)(2035!Oliver_Nilsson)(2031!Lennart_Evertsson)(2022!Jussi_Jakenberg)(2001!Aryan_Banerjee)(1985!Tim_Nordenfur)(1977!Elias_Kingsley)(1954!Per_Isaksson)(1944!Cristine_Rose_Mariano)(1936!Lo_Ljungros)(1923!Herman_Enholm)(1907!Carina_Wickström)(1897!Joel_Åhfeldt)(1896!Stefan_Nyberg)(1893!Hans_Rånby)(1889!Mikael_Blom)(1886!Joar_Berglund)(1885!Mikael_Helin)(1880!Olle_Ålgars)(1878!Jesper_Borin)(1871!Khaschuluu_Sergelenbaatar)(1852!Roy_Karlsson)(1848!Fredrik_Möllerström)(1846!Kenneth_Fahlberg)(1835!Peder_Gedda)(1833!Karam_Masoudi)(1828!Christer_Johansson)(1827!Anders_Kallin)(1818!Morris_Bergqvist)(1803!Martti_Hamina)(1800!Björn_Löfström)(1796!Nicholas_Bychkov_Zwahlen)(1794!Jonas_Sandberg)(1793!Rohan_Gore)(1787!Kjell_Jernselius)(1783!Radu_Cernea)(1778!Mukhtar_Jamshedi)(1768!Neo_Malmquist)(1763!Joacim_Hultin)(1761!Lars-Åke_Pettersson)(1748!André_J_Lindebaum)(1733!Lars_Eriksson)(1733!Hugo_Hardwick)(1728!Hugo_Sundell)(1726!Simon_Johansson)(1721!Jouni_Kaunonen)(1709!Eddie_Parteg)(1695!Sid_Van_Den_Brink)(1691!Svante_Nödtveidt)(1688!Anders_Hillbur)(1680!Sayak_Raj_Bardhan)(1671!Salar_Banavi)(1650!Patrik_Wiss)(1641!Anton_Nordenfur)(1624!Jens_Ahlström)(1622!Hanns_Ivar_Uniyal)(1579!Christer_Carmegren)(1575!Christer_Nilsson)(1524!Måns_Nödtveidt)(1480!Karl-Oskar_Rehnberg)(1417!David_Broman)(1406!Vida_Radon)) 

[Edit](https://github.com/ChristerNilsson/ELO-Pairings/blob/main/tournaments/78.txt)

### Instructions
	Edit the URL above.  
	Add the elos and names of the players.  

	* TOUR contains the header of the tournament. Optional
	* DATE contains the Date. Optional
	* PLAYERS contains elos and names, separated with an exclamation sign.
	* K0 contains 40 for beginners, 20 for ordinary, 10 for expert players. Default: 20
	* k <= 1.0
	* TPP contains Tables Per Page. Default 30
	* PPP contains Players Per Page. Default 60
	* PAUSED contains id:s of paused players

### Speed parameters K0 and k
	* Default: 40 and 1.0
	* Normal:  20 and 1.0
	* Masters: 10 and 1.0
	* "Simulated Annealing": 100 and 0.7
		* This will make K shrink with every round. K = K0 * k ** round
		* Example 100 70 49 34.3 ...
		* For players that prefer large elo gaps, like in Swiss

### Elo calculation

Elo is calculated using this formula:  
PA = probability of win for stronger player  
RB = rating for weaker player  
RA = rating for stronger player  

![formula](image.png)
	
### Entering results twice
Make a habit of always entering the result twice.  
As soon as a score sheet is finished, start entering the results, using the keyboard.  
By entering the same results twice, you will reduce the risk of mis-entering.  
The erroneous line will be red and you have to delete the result before entering the correct one.  

### Saving the tournament
	* The updated URL contains all information to display the result page.
	* No data will be stored on the server. All data is in the URL.

[swiss_36.txt](swiss_36.txt)  
[tight_36.txt](tight_36.txt)  

* Open Source
* The database == The URL
* Backup files downloaded automatically after every pairing
* Player with zero Elo is considered to have 1400.

## Advantages

* Players will meet similar strength players
* One person maximum needs a bye
* Available in the browser
* Pages can be zoomed

