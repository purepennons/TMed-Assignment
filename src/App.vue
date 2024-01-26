<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/dashboard">Dashboard</RouterLink>
  </header>

  <RouterView />
</template>

<style lang="scss" scoped>
</style>
