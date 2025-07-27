
<script setup lang="ts">
import { ref } from 'vue';
import BookList from '@/components/BookList.vue';
import BookDetails from '@/components/BookDetails.vue';

const selectedId = ref<string | null>(null);
</script>

<template>
  <div>
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
      <h1 class="text-2xl sm:text-4xl font-bold">Goodreads Book Explorer</h1>
      <p class="text-sm sm:text-base mt-2">Search and browse books with ease</p>
    </div>

    <BookList v-if="!selectedId" @select="selectedId = $event">
      <template #banner>
        <!-- Optional image banner or ad space -->
      </template>
    </BookList>

    <BookDetails v-else :id="selectedId" @back="selectedId = null" />
  </div>
</template>

