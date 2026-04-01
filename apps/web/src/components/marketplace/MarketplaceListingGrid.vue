<script setup lang="ts">
import type { MarketplaceListing, MarketplaceSellCard } from "../../lib/marketplace-overview";

defineProps<{
  listings: MarketplaceListing[];
  mode: "buy" | "sell";
  sellCards: MarketplaceSellCard[];
}>();

function rarityLabel(rarity: MarketplaceListing["rarity"]) {
  const labels = {
    common: "Gyakori",
    rare: "Ritka",
    epic: "Epikus",
  };

  return labels[rarity];
}

function marketplaceTagClass(rarity: MarketplaceListing["rarity"]) {
  if (rarity === "epic") {
    return "tertiary";
  }

  if (rarity === "rare") {
    return "secondary";
  }

  return "";
}
</script>

<template>
  <section class="marketplace-grid">
    <template v-if="mode === 'buy'">
      <article
        v-for="listing in listings"
        :key="listing.id"
        class="marketplace-card"
        :class="`tone-${listing.rarity}`"
      >
        <div class="marketplace-card__chrome"></div>
        <div class="marketplace-card__top">
          <div class="marketplace-card__icon">
            <span class="material-symbols-outlined">{{ listing.icon }}</span>
          </div>

          <div class="marketplace-card__meta">
            <span class="tag-pill" :class="marketplaceTagClass(listing.rarity)">{{ rarityLabel(listing.rarity) }}</span>
            <div class="detail-row">
              <span class="compact-label">Mennyiség</span>
              <strong>{{ listing.quantity }}</strong>
            </div>
          </div>
        </div>

        <div class="marketplace-card__copy">
          <h2>{{ listing.title }}</h2>
          <p>{{ listing.description }}</p>
        </div>

        <div class="marketplace-card__seller">
          <img :alt="listing.sellerName" :src="listing.sellerAvatarUrl" class="marketplace-card__seller-avatar" />
          <div>
            <span class="compact-label">Eladó</span>
            <strong>{{ listing.sellerName }}</strong>
          </div>
          <div class="marketplace-card__seller-meta">
            <span class="compact-label">Hátralévő idő</span>
            <strong>{{ listing.timeLeftLabel }}</strong>
          </div>
        </div>

        <div class="marketplace-card__footer">
          <div>
            <span class="compact-label">{{ listing.buyoutOnly ? "Fix ár" : "Aktuális ár" }}</span>
            <div class="marketplace-card__price">
              <span class="material-symbols-outlined">{{ listing.currency === "credits" ? "monetization_on" : "diamond" }}</span>
              <strong>{{ new Intl.NumberFormat("hu-HU").format(listing.price) }}</strong>
            </div>
          </div>

          <button class="primary-button" type="button">
            {{ listing.buyoutOnly ? "Megvétel" : "Ajánlat" }}
          </button>
        </div>
      </article>
    </template>

    <template v-else>
      <article v-for="card in sellCards" :key="card.id" class="marketplace-sell-card">
        <div class="marketplace-sell-card__icon">
          <span class="material-symbols-outlined">{{ card.icon }}</span>
        </div>
        <div class="marketplace-sell-card__copy">
          <h2>{{ card.title }}</h2>
          <p>{{ card.description }}</p>
          <div class="tag-row">
            <span class="chip">{{ card.quantity }} db</span>
            <span class="chip">{{ card.source === "equipment" ? "Felszerelés" : "Készlet" }}</span>
          </div>
        </div>
        <div class="marketplace-sell-card__actions">
          <div>
            <span class="compact-label">Javasolt ár</span>
            <strong>{{ new Intl.NumberFormat("hu-HU").format(card.suggestedPrice) }}</strong>
          </div>
          <button class="secondary-button" type="button">Listázás</button>
        </div>
      </article>
    </template>
  </section>
</template>
