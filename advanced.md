# Advanced

# Obligatoriska fält

* TOUR - turneringens namn
* PLAYERS - spelarnas elo och namn, separerade med !

# Fält som skapas automatiskt (default)

* ROUND - aktuell rond (0)
* PAUSED - inaktiva spelare
* TIMESTAMP - finns även i filnamnet

# Fält som kan läggas till
* TPP - Tables Per Page (30)
* PPP - Players Per Page (60)

# Färsk URL skapas vid varje lottning
Den hamnar på Downloads

# Använd bordsformulär för backup.
Bra att ha om resultaten måste matas in igen.
Även sparade URL-er kan vara användbara.

# Teckenhantering

* Byt mellanslag mot underscore, "_"
* "!" används som särskiljare och är därmed reserverad
* "(" och ")" används för listor och är därmed reserverade

# Begränsningar

De flesta servrar tillåter bara URL:er mindre än 16kB.  
Denna gräns går att utöka t ex genom att ändra Apaches inställningar.  
Denna gräns kommer med stor sannolikhet att utökas i framtiden.

Ett sätt komma runt denna gräns är att köra en lokal server.
```
python -m http.server 8000
```

Man kan uppskatta hur lång URL:en blir:

* N = antal spelare
* R = antal ronder
* M = namnens medellängd (cirka 15)
* B = Antal bytes

B = N * (10 + M + R * 5)

 ```
 R  Max antal spelare
 4	364
 5	327
 6	297
 7	273
 8	252
 9	234
10	218
11	204
12	192
13	182
14	172
15	163
16	156
17	148
18	142
19	136
20	131
```

Med lite packning kan denna formel bli: B = N * (12 + 2R)  
Det bygger på att namnet kodas med fyra bytes (t ex ChNi), elo med två bytes och OPP+COL+RES med två bytes.  

OPP+COL+RES kan packas så här:  
Bitar: OOOOOO OOOCRR (O=Opposition C=Color R=Result) 
Bara 6 bitar kan användas i varje byte. Max 512 spelare.  

```
 R  Max antal spelare, dock högst 512 pga nio bitar ovan i OPP
 4	819
 5	744
 6	682
 7	630
 8	585
 9	546
10	512
11	481
12	455
13	431
14	409
15	390
16	372
17	356
18	341
19	327
20	315
```
För tillfället används "½" i URL:en. Den kräver två bytes i UTF-8 och borde bytas ut mot 1.  
Även åäöÅÄÖ tar upp två bytes vardera. De används dock bara en gång per spelare, till skillnaden från resultaten.
