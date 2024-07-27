# Elo Pairings

[Try it!](https://christernilsson.github.io/ELO-Pairings)

* All games has a low gap
* Improving your ELO is your ultimate struggle

## Swiss throws away information 

* A win against the strongest is worth exactly as much as a win against the weakest
	* Every game should be weighted with the player strength
* Big gaps gives very little new information
	* Small gaps are more unpredictable and therefore more important

## Motivation

[Swiss Matrix](swiss-78.txt)  
[ELO Matrix](elo-78.txt)  

The Swiss Matrix shows the games actually played in a tournament paired with Swiss.  
The ELO Matrix shows which games would actually be played in a tournament paired with ELO Pairings.  
The diagonal is marked with asterisks as players never meet themselves.  
The axes contains the elos of the players.  
The numbers in the matrices are round numbers.  
The Swiss Matrix is quite spread out, which indicates many games with large elo gaps.  

## Swiss vs ELO Pairings

* Upper right corner: the strongest players. Small gaps
* Lower left corner: the weakest players. Small gaps
* Upper left and lower right corner: Big gaps where strong meets weak

[Bubble Chart](https://christernilsson.github.io/2024/027-BubbleChart)  

[Manual](markdown/manual.md)  

[Handicap](markdown/handicap.md)  

## Links

[14 players](tournaments/14.txt)  

[78 players](tournaments/78.txt)  

## Instructions for organizers
* Edit one of the files above.
* Add the elos and names of the players, eventually in alphabetical order. Like 1601!NILSSON Christer
* Fields
	* **TOUR** the header of the tournament. Optional
	* **DATE** the Date. Optional
	* **K**, the development coefficient, 40 for beginners, **20** for ordinary, 10 for expert players. Optional
	* **TPP** Tables Per Page. Default 30. Optional
	* **PPP** Players Per Page. Default 60. Optional
	* **PAUSED** id:s of paused players. Optional
	* **PLAYERS** elos and names, separated with an exclamation sign. Mandatory
	* **FACTOR** 0 = uses normal distribution (default), otherwise the [FACTOR](markdown/factor.md) method

[Calculation](markdown/calculation.md)

## Number of Rounds Limit

14 active players could pair 8 rounds (57%).  
78 active players could pair 46 rounds (59%).   

If you need more, consider a round robin Berger instead.
