# Teknik

* Spela in med MS Snipping Tool. Nås via tangenten Print Screen
* Använd t ex Sennheiser BlueTooth Headset
* Dela in avsnitten efter t ex skärmarna. Döp dem till A, B osv
* Sätt ihop delarna med MS ClipChamp
* Resultatet hamnar på Downloads

# Intro

[A Tyresö Open 2024](https://member.schack.se/ShowTournamentServlet?id=13664&listingtype=2).  
This is the score sheet of a Swiss tournament in Sweden, named Tyresö Open 2024.  
It had eight rounds and 81 participants.  
As you can see the first round had a huge ELO gap between the players. Number 1 with ELO 2416 met 53 with ELO 1835.

[B ELO Chart](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=483813383#gid=483813383)

In this chart I'm showing the sorted ELO ratings.  
Quite steep in the top and bottom 10% and more flattened in the remaining 80%.

[C 1985 Nordenfur](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=243754366#gid=243754366)
Let's study one player. He has elo 1985 and is marked in green.  
The red bars indicates the players he met in the Swiss tournament,  
ranging from 1721 to 2416, 695 elos.  
The dark blue bars indicates the players he would have met using ELO Pairings instead,  
ranging from 1936 to 2035, 99 elos.  
Please note, in Swiss he never met ANY of his closest players.  

[D 1828 Johansson](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=10301852#gid=10301852)
This is another view of another player. He has elo 1828.  
The blue bars indicates ELO Pairings and the red bars Swiss Pairing.  
Please note the big swings in Swiss, containing some nasty slaughter rounds.  
ELO Pairings starts with the closest player, in elo,  
and then the amplitude rises slowly with every round.  
Note the differences: 538 vs 25  

[E Swiss Matrix](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=1809770193#gid=1809770193)
This matrix indicates which player met each other.  
It is mirrored in the main diagonal and  
contains the round numbers.  
The axis are sorted by elo strength.  
As you can see the games have quite wide elo differences,
the worst being around 750 elos

[F ELO Matrix](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=830847657#gid=830847657)
The same tournament, but paired using ELO Pairings instead.  
Most games are very close to the diagonal.  
No matter the game results, the matrix will always look like this.  
One chess friend of mine, christened this *Floating Berger*.  
Every player has his personal Berger group, kind of, with himself in the middle.  
Our friend, 1985 Nordenfur can be found in line 22:  
  8 5 4 1 * 3 2 6 7

# Probability

[G What does a difference of 500 elo mean?](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=1487995663#gid=1487995663)

As you can see here, if the difference is 500 elos, the better player will win 19 times out of 20.  
The inferior player will win one game in twenty.  

[H Formula](https://docs.google.com/spreadsheets/d/1DHRnlp8Q6RnnG-gF-fg0liyS2zZINEF5typxI497JyE/edit?gid=60645458#gid=60645458)

RA = 1400 and RB = 2800 gives PA = 0.000316  
(one win in 3163 games)

# A small demo

This is a simulation of a smaller chess tournament with 14 players and four rounds  
using the brand new ELO Pairings web page.  

[I 14 players demo](https://christernilsson.github.io/ELO-Pairings/?TOUR=Senior_Stockholm&DATE=2024-05-28&PLAYERS=(1825!JOHANSSON_Lennart)(1697!BJ%C3%96RKDAHL_G%C3%B6ran)(1684!SILINS_Peteris)(1681!STOLOV_Leonid)(1644!PETTERSSON_Lars-%C3%85ke)(1598!ISRAEL_Dan)(1598!AIKIO_Onni)(1583!PERSSON_Kjell)(1561!LILJESTR%C3%96M_Tor)(1559!LEHVONEN_Jouko)(1539!ANDERSSON_Lars_Owe)(1535!%C3%85BERG_Lars-Erik)(1532!ANTONSSON_G%C3%B6rgen)(1400!STR%C3%96MB%C3%84CK_Henrik))

This is the starting screen.  
You have prepared all the names and elos the night before and maybe you would like to pause some of the people that got delayed in traffic.
Use toggle or space to alter their statuses.

# [J] Pair four rounds
I will start by pairing four rounds, filling in random results.  
  P RP RP RP RP
  
# [K] Standings
* The winner of this simulation is SILINS
* The last column, Elos, contains the sum of all game scores weighted with the elos of the opponents.
   * This is similar to calculating with the well known Sonneborn-Berger, using elos instead of total scores.
* Green background indicates a win
* Red a loss
* And Gray a draw
   * Colors of the pieces are the same as the color of the numbers.
* In the first round, SILINS met STOLOV and won with black pieces, earning 1681 elos.
* In the second round, SILINS met JOHANSSON and won as white, earning 1825 elos.
* In the third round SILINS met BJÖRKDAHL and drew with black, winning half of 1697 = 848.5 elos
   * BJÖRKDAHL got half of 1684 = 842 elos
   * In the fourth round, SILINS met ÅBERG and won as white, earning 1644 elos.
* Please note that SILINS met all the four highest ranked players 4 1 2 5 except number 3 as this is SILINS himself.   
* This sums up to 1681 + 1825 + 848.5 + 1644 = 5998.5, which is the winning weighted score.
* Also note, ANDERSSON ended up as number four, even being as low rated as 1539.
* ANDERSSON, having elo 1539, met players with ratings 1532, 1535, 1561 and 1598.
   * Two players were stronger and two weaker.

# [L] Navigation
* You can navigate using the keys and the mouse
* You can also use the keys Up Down PageUp PageDown Home and End
* Finally, You can also scroll with the mouse wheel and click with the mouse

# [M] Pages
* Top left you see four pages:
   * Standings
   * Tables
   * Names
   * Active

Zooming is handled using the I key for In and O key for Out

# [N] Entering Results
* This is done in the Tables page.
* Jump to the top with Home and start entering the collected results using
   * 1 for white Win
   * space for Draw
   * 0 for white Loss
* You may enter the results one more time to double check.
* Delete erroneous results with the Delete key.
* The educational button Random, fills in random results.

# [O] Pairing
* After entering all the results, you may pair the next round using the Pair button.
* Print Names, Standings and Tables lists by clicking Ctrl+J to see the downloaded files.
* Print the top file, the newest one.

# [P] How do I continue?
A good starting point is to edit this [URL](https://github.com/ChristerNilsson/ELO-Pairings/blob/main/tournaments/14.txt) and then copy and paste it in the address field of your browser.
