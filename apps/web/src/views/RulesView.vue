<template>
  <main id="top" class="public-docs public-rules">
    <div class="public-docs-shell public-rules__grid">
      <aside class="public-rules__sidebar">
        <div class="public-rules__sidebar-inner">
          <div>
            <h3 class="public-rules__sidebar-title">Dokumentáció</h3>
            <nav class="public-rules__nav">
              <a class="is-active" href="#magatartas">
                <span class="material-symbols-outlined">gavel</span>
                <span>Magatartási kódex</span>
              </a>
              <a href="#fairplay">
                <span class="material-symbols-outlined">sports_esports</span>
                <span>Fair play</span>
              </a>
              <a href="#gazdasag">
                <span class="material-symbols-outlined">account_balance</span>
                <span>Gazdasági integritás</span>
              </a>
              <a href="#biztonsag">
                <span class="material-symbols-outlined">shield_lock</span>
                <span>Biztonsági protokollok</span>
              </a>
              <a class="public-rules__nav-gap" href="#szankcio">
                <span class="material-symbols-outlined">block</span>
                <span>Szankciós rend</span>
              </a>
              <a href="#jelentes">
                <span class="material-symbols-outlined">flag</span>
                <span>Jelentési csatorna</span>
              </a>
            </nav>
          </div>

          <div class="public-rules__support">
            <p class="public-rules__support-eyebrow">Support</p>
            <p>Az Enforcer Tanács sürgős vitás helyzetekben folyamatosan elérhető.</p>
            <button class="ghost-button" type="button">Ticket nyitása</button>
          </div>
        </div>
      </aside>

      <section class="public-rules__content">
        <header class="public-rules__hero">
          <span class="eyebrow">Regulatory framework v4.2</span>
          <h1>Rules of <span>engagement</span></h1>
          <p>
            Az Obsidian Astral perzisztens világa a tiszteletre, versenyre és technológiai fegyelemre épül. A
            belépéssel a Hegemony Protocol szabályait fogadod el.
          </p>
        </header>

        <section class="public-rules__cards">
          <article id="fairplay" class="public-rules__card public-rules__card--primary">
            <div class="public-rules__card-icon">
              <span class="material-symbols-outlined">sports_esports</span>
            </div>
            <h2>Fair play és harc</h2>
            <ul>
              <li><span>01.</span><p>Nem megengedett a játékmechanikák szándékos kihasználása tisztességtelen előnyért.</p></li>
              <li><span>02.</span><p>Tilos a külső automatizáció, bot vagy script alapú harci támogatás.</p></li>
              <li><span>03.</span><p>A klánháborús ghosting és megbeszélt eredmény súlyos vétség.</p></li>
            </ul>
          </article>

          <article id="magatartas" class="public-rules__card public-rules__card--secondary">
            <div class="public-rules__card-icon">
              <span class="material-symbols-outlined">forum</span>
            </div>
            <h2>Kommunikáció</h2>
            <ul>
              <li><span>01.</span><p>A zaklatás, gyűlöletkeltés és személyes támadás nem tolerált.</p></li>
              <li><span>02.</span><p>Tilos a globális csatornák spam-elése vagy külső piactér reklámozása.</p></li>
              <li><span>03.</span><p>Admin vagy moderátor megszemélyesítése azonnali szankciót von maga után.</p></li>
            </ul>
          </article>

          <article id="gazdasag" class="public-rules__card public-rules__card--tertiary">
            <div class="public-rules__card-icon">
              <span class="material-symbols-outlined">account_balance</span>
            </div>
            <h2>Gazdasági integritás</h2>
            <ul>
              <li><span>01.</span><p>A hivatalos piactéren kívüli valódi pénzes kereskedelem tiltott.</p></li>
              <li><span>02.</span><p>Tilos a mesterséges piaci manipuláció vagy koordinált készlethiány generálása.</p></li>
              <li><span>03.</span><p>Fiókok adásvétele vagy átadása a világ stabilitása miatt korlátozott.</p></li>
            </ul>
          </article>

          <article id="biztonsag" class="public-rules__card public-rules__card--accent">
            <div class="public-rules__card-icon">
              <span class="material-symbols-outlined">shield_lock</span>
            </div>
            <h2>Biztonsági protokollok</h2>
            <ul>
              <li><span>01.</span><p>A kliens vagy szerver visszafejtése, feltörése, sebezhetőség-kihasználása tiltott.</p></li>
              <li><span>02.</span><p>Kártékony link, adathalász eszköz vagy hitelesítő adatlopás azonnali kitiltást ér.</p></li>
              <li><span>03.</span><p>A kritikus hibák visszatartása személyes előnyért szankcionált viselkedés.</p></li>
            </ul>
          </article>
        </section>

        <section id="szankcio" class="public-rules__policy">
          <div class="public-rules__policy-copy">
            <h3>Szankciós rend</h3>
            <p>
              Az ítéletek fokozatosak, de az infrastruktúrát vagy közösséget veszélyeztető visszaélések esetén azonnali
              végrehajtás lép életbe.
            </p>
          </div>

          <div class="public-rules__policy-grid">
            <article>
              <p class="eyebrow">Tier 1: Figyelmeztetés</p>
              <p>Első szabálysértésnél ideiglenes korlátozás és hivatalos figyelmeztetés jár.</p>
            </article>
            <article>
              <p class="eyebrow">Tier 2: Karantén</p>
              <p>Ismételt vétség 7 napos zárolást és részleges erőforrásvesztést hozhat.</p>
            </article>
            <article>
              <p class="eyebrow">Tier 3: Száműzetés</p>
              <p>A legsúlyosabb esetek végleges kitiltással és az eszközök elvesztésével járnak.</p>
            </article>
          </div>
        </section>

        <section id="jelentes" class="public-rules__report">
          <div>
            <h3>Láttál szabálysértést? Jelentsd.</h3>
            <p>A bejelentések titkosítva kerülnek be a rendszerbe, és emberi moderátor vizsgálja őket.</p>
          </div>
          <button class="ghost-button" type="button">Jelentés küldése</button>
        </section>
      </section>
    </div>
  </main>
</template>
