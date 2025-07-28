<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = (): void => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <nav class="bg-black text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo or site name -->
        <div class="flex-shrink-0 text-xl font-bold">
          <router-link to="/" class="text-white">DDM App</router-link>
        </div>

        <!-- Desktop menu -->
        <div class="hidden md:flex space-x-4">
          <router-link
            to="/"
            class="text-white hover:underline px-3 py-2 rounded-md text-2xl"
            >Home</router-link
          >
          <router-link
            to="/books"
            class="text-white hover:underline px-3 py-2 rounded-md text-2xl"
            >Books</router-link
          >
        </div>

        <!-- Hamburger icon -->
        <div class="md:hidden">
          <button
            class="text-white focus:outline-none"
            aria-controls="mobile-menu"
            :aria-expanded="isOpen ? 'true' : 'false'"
            @click="toggleMenu"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path v-if="!isOpen" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isOpen" class="md:hidden bg-black px-4 pb-4 space-y-2">
      <router-link
        to="/"
        class="block text-white hover:underline px-3 py-2 rounded-md"
        @click="isOpen = false"
        >Home</router-link
      >
      <router-link
        to="/books"
        class="block text-white hover:underline px-3 py-2 rounded-md"
        @click="isOpen = false"
        >Books</router-link
      >
    </div>
  </nav>
</template>
