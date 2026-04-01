<template>
  <main class="public-docs public-guide">
    <div class="public-docs__grid">
      <aside class="public-docs__sidebar">
        <div class="public-docs__sidebar-inner">
          <div>
            <p class="compact-label">Leírás szegmensek</p>
            <nav class="public-docs__nav">
              <a href="#world">A világ</a>
              <a href="#resources">Nyersanyagok</a>
              <a href="#combat">Harc</a>
              <a href="#progression">Fejlődés</a>
              <a href="#clans">Klánok</a>
            </nav>
          </div>

          <div class="public-docs__support tonal-panel">
            <p class="eyebrow">Terminal status</p>
            <p>A kézikönyv a jelenlegi szezon rendszerállapotával szinkronban van.</p>
            <div class="progress-track">
              <div class="progress-fill" style="width: 67%"></div>
            </div>
          </div>
        </div>
      </aside>

      <section class="public-docs__content">
        <header class="public-docs__hero">
          <span class="eyebrow">Archive node</span>
          <h1>Játékleírás</h1>
          <p>
            Az Obsidian Astral hivatalos kézikönyve. Itt találod a túléléshez, fejlődéshez és hódításhoz szükséges
            alapokat.
          </p>
        </header>

        <section id="world" class="public-guide__section">
          <header class="public-guide__section-header">
            <h2><span class="material-symbols-outlined">public</span>A világ</h2>
            <span>GEO_DATA_01</span>
          </header>

          <div class="public-guide__hero-image">
            <img alt="Astral landscape" src="/public-docs/astral-landscape.webp" />
            <div class="public-guide__hero-overlay">
              <article class="tonal-panel">
                <h3>Üvegcsúcsok</h3>
                <p>Magas kockázatú kristálybányák. Extrém sugárzás.</p>
              </article>
              <article class="tonal-panel">
                <h3>Void-láp</h3>
                <p>Lassú mozgás, magas erőforrás-sűrűség.</p>
              </article>
              <article class="tonal-panel">
                <h3>Astral mag</h3>
                <p>Klánháborús övezet. Belépés csak engedéllyel.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="resources" class="public-guide__section">
          <header class="public-guide__section-header">
            <h2><span class="material-symbols-outlined">diamond</span>Nyersanyagok</h2>
            <span>CRAFT_LOG_02</span>
          </header>

          <div class="public-guide__resource-grid">
            <div class="public-guide__resource-copy">
              <p>
                A gazdaság ritka asztrális anyagok finomítására épül. Az egyes nyersanyagokhoz eltérő műhelyek és
                feldolgozási láncok tartoznak.
              </p>

              <div class="public-guide__resource-list">
                <article>
                  <div>
                    <span class="material-symbols-outlined">token</span>
                    <strong>Obszidián shard</strong>
                  </div>
                  <div class="progress-track"><div class="progress-fill" style="width: 85%"></div></div>
                </article>
                <article>
                  <div>
                    <span class="material-symbols-outlined">flare</span>
                    <strong>Asztráleszencia</strong>
                  </div>
                  <div class="progress-track"><div class="progress-fill progress-fill--secondary" style="width: 40%"></div></div>
                </article>
                <article>
                  <div>
                    <span class="material-symbols-outlined">category</span>
                    <strong>Void matter</strong>
                  </div>
                  <div class="progress-track"><div class="progress-fill progress-fill--tertiary" style="width: 15%"></div></div>
                </article>
              </div>
            </div>

            <article class="public-guide__resource-visual tonal-panel">
              <img alt="Tech workshop" src="/public-docs/tech-workshop.webp" />
              <div>
                <p class="compact-label">Refining process</p>
                <p>A finomítás során az alapanyagokat asztrális hevítőben kell kezelni a maximális hozamért.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="combat" class="public-guide__section">
          <header class="public-guide__section-header">
            <h2><span class="material-symbols-outlined">swords</span>Harc</h2>
            <span>COMBAT_SYS_03</span>
          </header>

          <div class="public-guide__combat-grid">
            <article class="tonal-panel">
              <span class="material-symbols-outlined">favorite</span>
              <h3>Health Points</h3>
              <p>A karakter fizikai állapota. Ha nullára esik, megszakad az átviteli kapcsolat.</p>
              <strong>120 BASE</strong>
            </article>
            <article class="tonal-panel">
              <span class="material-symbols-outlined">bolt</span>
              <h3>Attack Power</h3>
              <p>A fegyverek és képességek által okozott célzott sebzés mértéke.</p>
              <strong>85 DPS</strong>
            </article>
            <article class="tonal-panel">
              <span class="material-symbols-outlined">battery_charging_full</span>
              <h3>Aura Energy</h3>
              <p>A speciális képességek, relikviák és pajzsok működtetéséhez szükséges energia.</p>
              <strong>250 MAX</strong>
            </article>
          </div>
        </section>

        <section id="progression" class="public-guide__section">
          <header class="public-guide__section-header">
            <h2><span class="material-symbols-outlined">trending_up</span>Fejlődés</h2>
            <span>EVOLVE_V3</span>
          </header>

          <div class="public-guide__progress-grid tonal-panel">
            <article>
              <h3>Lv. 10</h3>
              <p>Novice Explorer</p>
              <ul>
                <li>Tier 1 craftolás</li>
                <li>Helyi warp hozzáférés</li>
              </ul>
            </article>
            <article>
              <h3>Lv. 25</h3>
              <p>Void Walker</p>
              <ul>
                <li>Klánalapítás</li>
                <li>Elite gear slotok</li>
              </ul>
            </article>
            <article>
              <h3>Lv. 50</h3>
              <p>Astral Sovereign</p>
              <ul>
                <li>Relikviamanifesztáció</li>
                <li>Zónakormányzás</li>
              </ul>
            </article>
            <article class="is-muted">
              <h3>Lv. 100</h3>
              <p>Ascended Entity</p>
              <ul>
                <li>Adat zárolva</li>
              </ul>
            </article>
          </div>
        </section>
      </section>
    </div>
  </main>
</template>
