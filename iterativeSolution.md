## Uppsnabbning vid stora turneringar.

Eftersom blossoms är kvadratisk kan exekveringstiderna växa ganska snabbt.  

Genom att gruppera länkarna på samma elo-skillnad, slipper man söka i en jättematris direkt.  
T ex n=1000 medför att antal länkar närmar sig 500K.  

Algoritm:
```
edges = []
for group in groups
    edges = edges.concat group
    solution = findSolution edges
    # när solution hittats, avbryter man
```

Detta fungerar bra eftersom länkarna närmast diagonalen undersöks först.  
Med n=1000 räcker 6000 länkar för att hitta tio ronder, vilket tar mindre än en halv sekund per rond.

