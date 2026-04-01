<script setup lang="ts">
import { RouterView } from "vue-router";

import PublicFooter from "../public/PublicFooter.vue";
import PublicTopNav from "../public/PublicTopNav.vue";
</script>

<template>
  <div class="public-layout">
    <PublicTopNav />
    <RouterView />
    <PublicFooter />
  </div>
</template>
