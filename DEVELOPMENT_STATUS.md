# Fejlesztési állapot

Utolsó frissítés: 2026-03-31

## Elkészült

- frontend szerkezeti és vizuális rendbetétel a tervfájlok alapján
- auth alapok: regisztráció, bejelentkezés, profil, session, route védelem
- login oldal redesign a konkrét HTML terv alapján, lokális háttér assetekkel
- admin alapok: overview, rendszerimpulzus, segélycsomag, játékos inspect
- központi időzített eseményrendszer gyűjtéshez, craftoláshoz és építéshez
- élő progress megjelenítés a dashboard, műhely és expedíció nézetekben
- alap chat rendszer globál és műhely csatornával
- slot alapú equipment rendszer karakter loadouttal és tárgyinventárral
- interaktív zónatérkép és zónához kötött expedíciószűrés
- expedíciós napló és részletes expedíciós run overview képernyő
- dashboard értesítési központ valódi backend állapotkezeléssel
- notification center kategóriaszűrése és részletes kijelölt nézete
- dashboard queue és élő követés layout javítása
- admin épület editor külön szerkesztőfelülettel és backend művelettel
- admin role váltás és account moderation
- admin audit trail az admin beavatkozásokhoz
- admin játékosrészletek: készlet, épületek, aktivitások, audit napló
- admin készletmódosítás és alap játékosérték-szerkesztés
- env és docker alapú konfiguráció rendezése
- külön production Docker Compose stack nginx alapú web kiszolgálással

## Folyamatban

- további design alapú nézetek pontos átültetése a megadott HTML és képi tervek alapján
- expedíciós és zónarendszer mélyítése
- equipment tárgyforrások előkészítése drop és craft irányba

## Még hiányzik

- regisztrációs oldal tervhű átültetése a login oldal mintájára
- zónaesemények és random encounter rendszer
- equipment tárgyforrások: drop, craft, jutalomlánc
- napi küldetések és achievement rendszer
- notification center további interactionök célzott navigációval
- részletes admin account moderation export és szűrhető audit nézet
