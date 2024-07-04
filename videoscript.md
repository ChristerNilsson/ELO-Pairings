# Intro

[ELO Chart](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=483813383#gid=483813383)

This is data taken from a tournament in Stockholm, named [Tyresö Open 2024](https://member.schack.se/ShowTournamentServlet?id=13664&listingtype=2).  
It had 81 players and 8 rounds.  
The elo numbers spans from 1400 to 2400 approx.  
Quite steep in the top and bottom 10% and more flattened in the remaining 80%.

[1985 Nordenfur](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=243754366#gid=243754366)
Let's study one player, named Tim. He had 1985 as his elo and is marked in green.  
The red bars indicates the players he met,  
ranging from 1721 to 2416, 695 elos.  
The dark blue bars indicates the players he would have met using ELO Pairings instead,  
ranging from 1936 to 2035, 99 elos.  
Please note, in Swiss this player never met ANY of his closest players.  

[1828 Johansson](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=10301852#gid=10301852)
This is another view of another player. He had elo 1828.  
The blue bars indicates ELO Pairings and the red bars Swiss Pairing.  
Please note the big swings in Swiss, containing some slaughter rounds.  
ELO Pairings starts with the closest player, in elo,  
and then the amplitude rises slowly with every round.  
Note the differences: 538 vs 25  

[Swiss Matrix](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=1809770193#gid=1809770193)
This matrix indicates which player met each other.  
It is mirrored in the main diagonal and  
contains the round numbers.  
The axis are sorted by elo strength.  
As you can see the games have quite wide elo differences.  

[ELO Matrix](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=830847657#gid=830847657)
The same tournament, but paired using ELO Pairings instead.  
The games are stacking up around the diagonal.  
No matter the game results, the matrix will always look like this.  
One chess friend of mine, christened this *Floating Berger*.  
Every player has his personal Berger group, kind of, with himself in the middle.  
Our friend, Tim 1985 can be found in line 22.

# Probability

[What does a difference of 500 elo mean?](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=1487995663#gid=1487995663)

As you can see here, if the difference is 500 elos, the better player will win 19 times out of 20.  
The inferior player will win one in twenty.  
[Rating Calculator](https://ratings.fide.com/calc.phtml?page=change)

# A small demo

This is a simulation of a smaller chess tournament with 14 players and four rounds  
using the brand new ELO Pairings web page.  

[14 players demo](http://127.0.0.1:5500/?TOUR=Senior_Stockholm&DATE=2024-05-28&ROUNDS=8&ROUND=0&SP=0.0&TPP=30&PPP=60&PAUSED=()&PLAYERS=(1825|Alpha)(1697|Bravo)(1684|Charlie)(1681|Delta)(1644|Echo)(1598|Foxtrot)(1598|Golf)(1583|Hotel)(1561|India)(1559|Juliett)(1539|Kilo)(1535|Lima)(1532|Mike)(1400|November))

This is the starting screen.  
You have prepared all the names and elos the night before and maybe you would like to pause some of the people that got delayed in traffic.
Use toggle or space to alter their statuses.

# Pair four rounds
I will start by pairing four rounds, filling in random results.  
  P RP RP RP RP RP  
  
# Standings
* The winner of this simulation is Charlie
* The last column, Elos, contains the sum of all game scores weighted with the elos of the opponents.
   * This is similar to calculating with the well known Sonneborn-Berger, using elos instead of total scores.
* Green background indicates a win
* Red a loss
* And Gray a draw
   * Colors of the pieces are the same as the color of the numbers.
* In the first round, Charlie met Delta and won with black pieces, earning 1681 elos.
* In the second round, Charlie met Alpha and won as white, earning 1825 elos.
* In the third round Charlie met Bravo and drew with black, winning half of 1697 = 848.5 elos
   * Bravo got half of 1684 = 842 elos
   * In the fourth round, Charlie met Echo and won as white, earning 1644 elos.
* Please note that Charlie met all the four highest ranked players 4 1 2 5 except number 3 as this is Charlie himself.   
* This sums up to 1681 + 1825 + 848.5 + 1644 = 5998.5, which is the winning weighted score.
* Also note, Kilo ended up as number four, even being as low rated as 1539.
* Kilo, having elo 1539, met players with ratings 1532, 1535, 1561 and 1598.
   * Two players were stronger and two weaker.

# Navigation
* You can navigate using the keys and the mouse
* You can also use the keys Up Down PageUp PageDown Home and End
* Finally, You can also scroll with the mouse wheel and click with the mouse

# Pages
* Top left you see four pages:
   * Standings
   * Tables
   * Names
   * Active
Zooming is handled using the I key for In and O key for Out

# Entering Results
* This is done in the Tables page.
* Jump to the top with Home and start entering the collected results using
   * 1 for white Win
   * space for Draw
   * 0 for white Loss
* You may enter the results one more time to double check.
* Delete erroneous results with the Delete key.
* The educational button Random, fills in random results.

# Pairing
* After entering all the results, you may pair the next round using the Pair button.
* Print Names, Standings and Tables lists by clicking Ctrl+J to see the downloaded files.
* Print the top file, the newest one.

# How do I continue?
A good starting point is to edit this [URL](tournaments/14.txt) and then copy and paste it in the address field of your browser.
