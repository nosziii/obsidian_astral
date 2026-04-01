# Fejlesztési állapot

Utolsó frissítés: 2026-04-01

## Elkészült

- frontend szerkezeti és vizuális rendbetétel a tervfájlok alapján
- auth alapok: regisztráció, bejelentkezés, profil, session, route védelem
- login oldal redesign a konkrét HTML terv alapján, lokális háttér assetekkel
- regisztrációs oldal tervhű auth panelként, közös háttérrel és animált login-regisztráció váltással
- dashboard layout átrendezése szellősebb, jobban tagolt szerkezetre
- dashboard jobb oldali összefoglaló sáv aktív eseményekkel és zónastátusszal
- dashboard kompakt értesítési blokk a korábbi zsúfolt notification center helyett
- lebegő, csukható chat widget két tabbal: globál és műhely
- shell mobil navigáció offcanvas menüvel a korábbi széteső mobil layout helyett
- műhely nézet redesign a `nyersanyagok_gy_jt_s` terv vizuális irányára építve
- műhely hero fejléc, szűrősáv és kiemelt séma panel
- receptkártyák és épületfejlesztési kártyák új, tervhűbb vizuális struktúrával
- expedíciós nézet redesign a `r_szletes_exped_ci_run` terv háromoszlopos kompozíciója alapján
- külön csapatstátusz, loot secured, mission comms és threat radar blokkok expedícióhoz
- központi mission panel idővonallal, pulzáló kurzorral és taktikai metrikákkal
- design system finomhangolás kisebb rádiuszokkal, tonális üvegfelületekkel és közös mikromozgás utilitykkel
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

- további dashboard finomhangolás a következő képi visszajelzések alapján
- további műhely finomhangolás, ha a tervhez külön craft/building részletező képernyő is érkezik
- expedíciós utóképernyő és jutalom-claim animáció tervhű külön panellel
- zónaesemények és random encounter rendszer
- equipment tárgyforrások: drop, craft, jutalomlánc
- napi küldetések és achievement rendszer
- notification center további interactionök célzott navigációval
- részletes admin account moderation export és szűrhető audit nézet
