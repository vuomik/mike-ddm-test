
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBooks } from '@/composables/useBooks';
const { book, isLoading, loadBook } = useBooks();

const props = defineProps<{ id: string }>();
//const book = ref<any>(null);
const loading = ref(true);

watch(
  () => props.id,
  async (newId) => {
    console.log(newId);
    loadBook(newId);
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-4">
    <button @click="$emit('back')" class="text-blue-600 mb-4">← Back to list</button>

    <div v-if="loading" class="text-center py-4">Loading book...</div>
    <div v-else-if="book" class="max-w-md mx-auto">
      <img
        :src="book.imageUrl"
        alt="Book cover"
        class="w-full max-w-xs mx-auto mb-4"
      />
      <h2 class="text-xl font-bold">{{ book.title }}</h2>
      <p class="text-gray-600 mb-2">by {{ book.author }}</p>
      <p class="mb-2"><strong>Average Rating:</strong> {{ book.averageRating }}</p>
      <p v-if="book.publicationYear"><strong>Published:</strong> {{ book.publicationYear }}</p>
      <p class="mt-4">{{ book.description || 'No description available.' }}</p>
    </div>
  </div>
</template>
