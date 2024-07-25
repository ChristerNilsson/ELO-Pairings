# Advanced

## Simulated Annealing

Start med ett stort K-värde.  
Nästa blir en faktor * detta K-värde  
T ex 100, 0.7 => 100 70 49 34 24 17 12 8 6 4 osv.  
Vinst innebär att elot ökat med halva K-värdet om man möter en spelare med samma elo.  
Detta innebär att turneringen blir mer lik Swiss.  
Dvs stora svängningar i början, som avklingar med varje rond.  
Detta kan vara användbart om elotalen har dålig kvalitet.  
Utgår man från stabila elotal är det tveksamt om SA tillför något.  
Vill spelare möta spelare man normalt inte möter, kan det dock vara en intressant metod att få lite variation.  
Det innebär att man möter fler sämre och fler bättre spelare i början av turneringen.  
Efter åtta-tio ronder ligger man förhoppningsvis nära sitt korrekta elotal.  

## URL Limits

URL:ens längd stöter ofta på gränsen 16K  
Chrome ska klara 2M tecken, enligt uppgift, så begränsningen ligger i servern.  
Apache/nginx: LimitRequestLine kan användas för att höja gränsen. Default: 8K eller 16K.  

Localstorage löser inte publiceringsproblemet.  
Zippning löser inte problemet. Man vill kunna redigera urlen och skicka in den igen. Ozippad.  

Lokal server löser inte publiceringsproblemet.  (python -m http.server 8000)  
Dock saknar pythons http.server begränsning av urlen.  
Filer som behövs: Python, index.html  
Prestanda 1560 personer tar 19 sekunder att lotta, per rond.

### Alternativ

Använd en textruta istf URL.

Fördelar:
* Kommer förbi 16K-gränsen.
* Enklare format. & och () behövs inte längre
* Ingen specialhantering av åäöÅÄÖ, mellanslag osv.

Nackdelar:

* Går ej att distribuera turneringen som en URL

Exempel:
```
FACTOR=2
ROUND=10
TOUR=Tyresö_Open_2024
DATE=2024-05-03
TIMESTAMP=2024-07-25_16:17:41
K=20
TPP=30
PPP=60
PAUSED=12!18
PLAYERS=
2416!Hampus_Sörensen!19w1!17b1!18w1!16b1!15w1!14b1!13w1!12b1!3w1!32b1
```

# Observera

Detta kan innebära att möjlighet att publicera större turneringar på vissa plattformar, t ex Youtube, inte går.
Ett enda tecken kan tiodubblas.

t ex 
```
"!" = %2521
"(" = %2528
"Å" = %25C3%2585
"Ä" = %25C3%2584
"Ö" = %25C3%2596
```

Lösningen kan vara att undvika åäöÅÄÖ och ersätta parenteser med t ex _ och -.
Eller, som chatGPT föreslår, en länkförkortare.
Oklart vad de klarar av.

Det verkar som om en JSON-förkortare kan användas istället.
jsonblob.com

Länken i Youtube måste vara manglad.  
    * "(" = %28
    * ")" = %29
    * "!" = %21
    * "=" = %3D
    * å =
    * ä =
    * ö = %C3%B6
    * Å = %C3%85
    * Ä = %C4%84
    * Ö = %C3%96

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
