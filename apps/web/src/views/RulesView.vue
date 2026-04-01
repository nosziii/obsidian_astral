<template>
  <main class="public-docs">
    <div class="public-docs__grid">
      <aside class="public-docs__sidebar">
        <div class="public-docs__sidebar-inner">
          <div>
            <p class="compact-label">Dokumentáció</p>
            <nav class="public-docs__nav">
              <a href="#magatartas">Magatartási kódex</a>
              <a href="#fairplay">Fair play</a>
              <a href="#gazdasag">Gazdasági integritás</a>
              <a href="#biztonsag">Biztonsági protokollok</a>
              <a href="#szankcio">Szankciós rend</a>
              <a href="#jelentes">Jelentési csatorna</a>
            </nav>
          </div>

          <div class="public-docs__support tonal-panel">
            <p class="eyebrow">Support</p>
            <p>Az Enforcer Tanács sürgős vitás helyzetekben folyamatosan elérhető.</p>
            <button class="ghost-button" type="button">Ticket nyitása</button>
          </div>
        </div>
      </aside>

      <section class="public-docs__content">
        <header class="public-docs__hero">
          <span class="eyebrow">Regulatory Framework v4.2</span>
          <h1>Szabályzat</h1>
          <p>
            Az Obsidian Astral perzisztens világa a tiszteletre, versenyre és technológiai fegyelemre épül. A
            belépéssel a Hegemony Protocol szabályait fogadod el.
          </p>
        </header>

        <div class="public-docs__cards">
          <article id="fairplay" class="public-docs__card tonal-panel">
            <span class="material-symbols-outlined">sports_esports</span>
            <h2>Fair play és harc</h2>
            <ul>
              <li>Nem megengedett a játékmechanikák szándékos kihasználása tisztességtelen előnyért.</li>
              <li>Tilos a külső automatizáció, bot vagy script alapú harci támogatás.</li>
              <li>A klánháborús ghosting és megbeszélt eredmény súlyos vétség.</li>
            </ul>
          </article>

          <article id="magatartas" class="public-docs__card tonal-panel">
            <span class="material-symbols-outlined">forum</span>
            <h2>Kommunikáció</h2>
            <ul>
              <li>A zaklatás, gyűlöletkeltés és személyes támadás nem tolerált.</li>
              <li>Tilos a globális csatornák spam-elése vagy külső piactér reklámozása.</li>
              <li>Admin vagy moderátor megszemélyesítése azonnali szankciót von maga után.</li>
            </ul>
          </article>

          <article id="gazdasag" class="public-docs__card tonal-panel">
            <span class="material-symbols-outlined">account_balance</span>
            <h2>Gazdasági integritás</h2>
            <ul>
              <li>A hivatalos piactéren kívüli valódi pénzes kereskedelem tiltott.</li>
              <li>Tilos a mesterséges piaci manipuláció vagy koordinált készlethiány generálása.</li>
              <li>Fiókok adásvétele vagy átadása a világ stabilitása miatt korlátozott.</li>
            </ul>
          </article>

          <article id="biztonsag" class="public-docs__card tonal-panel">
            <span class="material-symbols-outlined">shield_lock</span>
            <h2>Biztonsági protokollok</h2>
            <ul>
              <li>A kliens vagy szerver visszafejtése, feltörése, sebezhetőség-kihasználása tiltott.</li>
              <li>Kártékony link, adathalász eszköz vagy hitelesítő adatlopás azonnali kitiltást ér.</li>
              <li>A kritikus hibák visszatartása személyes előnyért szankcionált viselkedés.</li>
            </ul>
          </article>
        </div>

        <section id="szankcio" class="public-docs__policy">
          <h2>Szankciós rend</h2>
          <div class="public-docs__policy-grid">
            <article class="tonal-panel">
              <p class="eyebrow">Tier 1</p>
              <h3>Figyelmeztetés</h3>
              <p>Első szabálysértésnél ideiglenes korlátozás és hivatalos figyelmeztetés jár.</p>
            </article>
            <article class="tonal-panel">
              <p class="eyebrow">Tier 2</p>
              <h3>Karantén</h3>
              <p>Ismételt vétség 7 napos zárolást és részleges erőforrásvesztést hozhat.</p>
            </article>
            <article class="tonal-panel">
              <p class="eyebrow">Tier 3</p>
              <h3>Száműzetés</h3>
              <p>A legsúlyosabb esetek végleges kitiltással és az eszközök elvesztésével járnak.</p>
            </article>
          </div>
        </section>

        <section id="jelentes" class="public-docs__report tonal-panel">
          <div>
            <h2>Jelentsd a szabálysértést</h2>
            <p>A bejelentések titkosítva kerülnek be a rendszerbe, és emberi moderátor vizsgálja őket.</p>
          </div>
          <button class="ghost-button" type="button">Jelentés küldése</button>
        </section>
      </section>
    </div>
  </main>
</template>
