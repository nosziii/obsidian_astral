<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main id="top" class="landing-page">
    <section class="landing-hero">
      <div class="landing-shell">
        <div class="landing-hero__content">
          <div class="landing-hero__copy">
            <span class="eyebrow landing-hero__eyebrow">System intelligence v21.44.0</span>
            <h1 class="landing-hero__title">Obsidian Astral</h1>
            <p class="landing-hero__subtitle">
              Hódítsd meg a végtelent. <span>Kovácsold meg a legendádat.</span>
            </p>

            <div class="landing-hero__actions">
              <RouterLink class="primary-button landing-hero__primary" to="/auth/register">Belépés a szektorba</RouterLink>
              <RouterLink class="ghost-button landing-hero__ghost" to="/auth/login">Parancsnoki terminál</RouterLink>
            </div>

            <div class="landing-hero__metrics">
              <article>
                <span class="compact-label">Aktív pilóták</span>
                <strong>14.2K+</strong>
              </article>
              <article>
                <span class="compact-label">Felfedezett rendszerek</span>
                <strong>892</strong>
              </article>
              <article>
                <span class="compact-label">Jelenlegi epoch</span>
                <strong>Astral-9</strong>
              </article>
            </div>
          </div>

          <div class="landing-hero__visual">
            <div class="landing-hero__visual-frame">
              <img alt="Taktikai parancsnok" src="/landing/tactical-commander.webp" />
            </div>

            <div class="landing-hero__badge">
              <div class="landing-hero__badge-icon">
                <span class="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <strong>Identity verified</strong>
                <p>Sector 7 guard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="landing-features">
      <div class="landing-shell">
        <header class="landing-section-header">
          <h2>Core systems</h2>
          <div class="landing-section-header__line"></div>
        </header>

        <div class="landing-features__grid">
          <article class="landing-card landing-card--wide landing-card--cyan">
            <div class="landing-card__body">
              <span class="material-symbols-outlined">manufacturing</span>
              <h3>Mély nyersanyag-kitermelés</h3>
              <p>Ritka obszidián izotópok, veszélyes mezők és magas hozamú műveleti ciklusok.</p>
            </div>
          </article>

          <article class="landing-card landing-card--image landing-card--purple">
            <div class="landing-card__body">
              <span class="material-symbols-outlined">precision_manufacturing</span>
              <h3>Fejlett craftolás</h3>
              <p>Fegyverek, modulok és technológiai ereklyék többfázisú gyártása.</p>
            </div>
            <img alt="Crafting interface" src="/landing/crafting-ui.webp" />
          </article>

          <article class="landing-card landing-card--pink">
            <div class="landing-card__body">
              <span class="material-symbols-outlined">swords</span>
              <h3>Taktikai harc</h3>
              <p>Precíz ütközetek, felszerelésalapú erőforrásmenedzsment és célzott döntések.</p>
            </div>
          </article>

          <article id="clans" class="landing-clan">
            <div class="landing-clan__copy">
              <span class="chip">Globális kontroll</span>
              <h3>Klánszuverenitás</h3>
              <p>
                Saját orbitális bázisok, adóztatott kereskedelmi útvonalak és tartós befolyás a szektorok felett.
              </p>
              <RouterLink to="/guide">Leírás megnyitása</RouterLink>
            </div>

            <div class="landing-clan__icons" aria-hidden="true">
              <div><span class="material-symbols-outlined">groups</span></div>
              <div><span class="material-symbols-outlined">hub</span></div>
              <div><span class="material-symbols-outlined">language</span></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="landing-world">
      <div class="landing-world__frame">
        <img alt="Kristálycsúcsok" class="landing-world__image" src="/landing/volcanic-zone.webp" />
        <div class="landing-world__overlay"></div>

        <div class="landing-shell landing-world__content">
          <div class="landing-world__copy">
            <span class="eyebrow">Szektor-felfedezés</span>
            <h2>Vulkanikus <span>kristálycsúcsok</span></h2>
            <p>
              Navigálj az instabil tektonikus lemezek között, ahol a légkör halálos, de a jutalom felbecsülhetetlen.
            </p>

            <div class="landing-world__stats">
              <div>
                <span class="compact-label">Hőmérséklet</span>
                <strong>1,400°C</strong>
              </div>
              <div>
                <span class="compact-label">Légkör</span>
                <strong>Veszélyes</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-highlights tonal-panel">
      <div class="landing-shell landing-highlights__grid">
        <article>
          <div></div>
          <h3>Ismeretlen határok</h3>
          <p>Minden szezon új Astral-sík seedet generál, így nincs két egyforma világhódítás.</p>
        </article>
        <article>
          <div></div>
          <h3>Dinamikus ökoszisztéma</h3>
          <p>Kristálymezők, fagyott holdak és biolumineszcens dzsungelek ugyanabban a világban.</p>
        </article>
        <article>
          <div></div>
          <h3>Perzisztens univerzum</h3>
          <p>Egyetlen játékos döntése is végigfuthat a teljes galaktikus gazdaságon.</p>
        </article>
      </div>
    </section>

    <section class="landing-cta">
      <div class="landing-cta__rings"></div>

      <div class="landing-shell">
        <div class="landing-cta__content">
          <h2>Csatlakozz az <span>Astral-hálózathoz</span></h2>
          <p>A végtelen hív. Most döntöd el, hogy uralod, vagy elveszel benne.</p>

          <div class="landing-hero__actions landing-cta__actions">
            <RouterLink class="primary-button" to="/auth/register">Karakter létrehozása</RouterLink>
            <RouterLink class="ghost-button" to="/guide">Leírás megnyitása</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <a class="landing-fab" aria-label="Ugrás a tetejére" href="#top">
      <span class="material-symbols-outlined">north_east</span>
    </a>
  </main>
</template>
