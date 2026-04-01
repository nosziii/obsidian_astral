<template>
  <main id="top" class="public-docs public-guide">
    <div class="public-docs-shell public-guide__layout">
      <aside class="public-guide__sidebar">
        <div class="public-guide__sidebar-inner">
          <div class="public-guide__segments">
            <p class="public-guide__segments-title">Leírás szegmensek</p>
            <nav class="public-guide__nav">
              <a class="is-active" href="#world"><span class="material-symbols-outlined">public</span><span>A világ</span></a>
              <a href="#resources"><span class="material-symbols-outlined">diamond</span><span>Nyersanyagok</span></a>
              <a href="#combat"><span class="material-symbols-outlined">swords</span><span>Harc</span></a>
              <a href="#progression"><span class="material-symbols-outlined">trending_up</span><span>Fejlődés</span></a>
              <a href="#clans"><span class="material-symbols-outlined">groups</span><span>Klánok</span></a>
            </nav>
          </div>

          <div class="public-guide__status">
            <p class="public-guide__status-title">Terminal status</p>
            <div class="public-guide__status-live">
              <span></span>
              <strong>Core_sync_active</strong>
            </div>
            <div class="public-guide__status-track">
              <div class="public-guide__status-fill"></div>
            </div>
            <p class="public-guide__status-meta">DB Ver: 2.14.4-A</p>
          </div>
        </div>
      </aside>

      <section class="public-guide__content">
        <header class="public-guide__hero">
          <h1>Játékleírás és archívum</h1>
          <p>
            Üdvözlünk az Obsidian Astral hivatalos kézikönyvében. Itt találod azokat a taktikai és ökológiai adatokat,
            amelyek a túléléshez szükségesek a Peremvidéken.
          </p>
        </header>

        <section id="world" class="public-guide__section">
          <header class="public-guide__section-head">
            <h2><span class="material-symbols-outlined">public</span>The World: Zone Protocols</h2>
            <span>GEO_DATA_01</span>
          </header>

          <div class="public-guide__world-frame">
            <img alt="Astral landscape" src="/public-docs/astral-landscape.webp" />
            <div class="public-guide__world-overlay"></div>
            <div class="public-guide__world-cards">
              <article>
                <h3>Zone A: Glass Peaks</h3>
                <p>Magas kockázatú kristálybányák. Extrém sugárzás.</p>
              </article>
              <article>
                <h3>Zone B: Void Marsh</h3>
                <p>Lassú mozgás, magas erőforrás-sűrűség.</p>
              </article>
              <article>
                <h3>Zone C: Astral Core</h3>
                <p>Klánháborús övezet. Belépés csak engedéllyel.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="resources" class="public-guide__section">
          <header class="public-guide__section-head">
            <h2><span class="material-symbols-outlined">diamond</span>Resource Mastery</h2>
            <span>CRAFT_LOG_02</span>
          </header>

          <div class="public-guide__resource-layout">
            <div class="public-guide__resource-copy">
              <p>
                Az Obsidian Astral gazdasága a ritka asztrális anyagok finomítására épül. Minden elem más finomítási
                eljárást igényel a maximális hozam eléréséhez.
              </p>

              <div class="public-guide__resource-list">
                <article>
                  <div class="public-guide__resource-icon"><span class="material-symbols-outlined">token</span></div>
                  <div class="public-guide__resource-main">
                    <h3>Obszidián shard</h3>
                    <div class="public-guide__resource-track"><div class="public-guide__resource-fill"></div></div>
                  </div>
                  <span class="public-guide__resource-rarity">Rarity: C</span>
                </article>
                <article>
                  <div class="public-guide__resource-icon"><span class="material-symbols-outlined">flare</span></div>
                  <div class="public-guide__resource-main">
                    <h3>Asztráleszencia</h3>
                    <div class="public-guide__resource-track"><div class="public-guide__resource-fill public-guide__resource-fill--secondary"></div></div>
                  </div>
                  <span class="public-guide__resource-rarity">Rarity: R</span>
                </article>
                <article>
                  <div class="public-guide__resource-icon"><span class="material-symbols-outlined">category</span></div>
                  <div class="public-guide__resource-main">
                    <h3>Void matter</h3>
                    <div class="public-guide__resource-track"><div class="public-guide__resource-fill public-guide__resource-fill--tertiary"></div></div>
                  </div>
                  <span class="public-guide__resource-rarity">Rarity: L</span>
                </article>
              </div>
            </div>

            <article class="public-guide__resource-card">
              <img alt="Tech workshop" src="/public-docs/tech-workshop.webp" />
              <div class="public-guide__resource-card-body">
                <div class="public-guide__resource-card-head">
                  <span>Refining process</span>
                  <span class="material-symbols-outlined">settings_suggest</span>
                </div>
                <p>A finomítás során az alapanyagokat asztrális hevítőben kell kezelni. A folyamat időtartama a technológiától függ.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="combat" class="public-guide__section">
          <header class="public-guide__section-head">
            <h2><span class="material-symbols-outlined">swords</span>Tactical Combat</h2>
            <span>COMBAT_SYS_03</span>
          </header>

          <div class="public-guide__combat-cards">
            <article>
              <div class="public-guide__combat-icon public-guide__combat-icon--error"><span class="material-symbols-outlined">favorite</span></div>
              <h3>Health Points</h3>
              <p>A karakter fizikai épsége. Ha eléri a nullát, a neuron-transzfer megszakad.</p>
              <strong>120 <span>Base</span></strong>
            </article>
            <article>
              <div class="public-guide__combat-icon public-guide__combat-icon--primary"><span class="material-symbols-outlined">bolt</span></div>
              <h3>Attack Power</h3>
              <p>A sebzés mértéke, amit fegyverekkel és képességekkel okozhatsz az ellenfeleknek.</p>
              <strong>85 <span>DPS</span></strong>
            </article>
            <article>
              <div class="public-guide__combat-icon public-guide__combat-icon--secondary"><span class="material-symbols-outlined">battery_charging_full</span></div>
              <h3>Aura Energy</h3>
              <p>A speciális képességek és asztrális pajzsok működtetéséhez szükséges üzemanyag.</p>
              <strong>250 <span>Max</span></strong>
            </article>
          </div>
        </section>

        <section id="progression" class="public-guide__section">
          <header class="public-guide__section-head">
            <h2><span class="material-symbols-outlined">trending_up</span>Character Progression</h2>
            <span>EVOLVE_V3</span>
          </header>

          <div class="public-guide__progress-card">
            <div class="public-guide__progress-watermark">Progression Matrix v4.2</div>
            <article>
              <div class="public-guide__progress-level"><strong>Lv. 10</strong><span></span></div>
              <p class="public-guide__progress-title public-guide__progress-title--primary">Novice Explorer</p>
              <ul>
                <li>Tier 1 craftolás</li>
                <li>Helyi warp hozzáférés</li>
              </ul>
            </article>
            <article>
              <div class="public-guide__progress-level"><strong>Lv. 25</strong><span></span></div>
              <p class="public-guide__progress-title public-guide__progress-title--secondary">Void Walker</p>
              <ul>
                <li>Klánalapítás</li>
                <li>Elite gear slotok</li>
              </ul>
            </article>
            <article>
              <div class="public-guide__progress-level"><strong>Lv. 50</strong><span></span></div>
              <p class="public-guide__progress-title public-guide__progress-title--tertiary">Astral Sovereign</p>
              <ul>
                <li>Relikviamanifesztáció</li>
                <li>Zónakormányzás</li>
              </ul>
            </article>
            <article class="is-muted">
              <div class="public-guide__progress-level"><strong>Lv. 100</strong><span></span></div>
              <p class="public-guide__progress-title">Ascended Entity</p>
              <ul>
                <li>Adat zárolva</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="clans" class="public-guide__section">
          <header class="public-guide__section-head">
            <h2><span class="material-symbols-outlined">groups</span>Klánok</h2>
            <span>FACTION_NET_04</span>
          </header>
          <div class="public-guide__clan-bar">
            <div>
              <h3>Szövetségi hierarchia</h3>
              <p>A klánok közös raktárat, zónabefolyást, háborús célokat és kommunikációs csatornákat osztanak meg.</p>
            </div>
            <button class="ghost-button" type="button">Klánrendszer megnyitása</button>
          </div>
        </section>
      </section>
    </div>

    <a class="public-docs__fab" aria-label="Ugrás a tetejére" href="#top">
      <span class="material-symbols-outlined">arrow_upward</span>
    </a>
  </main>
</template>
