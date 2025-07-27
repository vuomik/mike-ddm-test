
<script setup lang="ts">
import { ref } from 'vue';
//import BookList from '@/components/BookList.vue';
//import BookDetails from '@/components/BookDetails.vue';
import { Message } from '@server/types';

//const selectedId = ref<string | null>(null);
const errorMessages = ref<Message[] | null>(null);

const handleError = (messages: Message[]) => {
  errorMessages.value = messages;
  setTimeout(() => errorMessages.value = null, 1000);
}

</script>

<template>
  <div>
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
      <h1 class="text-2xl sm:text-4xl font-bold">Goodreads Book Explorer</h1>
      <p class="text-sm sm:text-base mt-2">Search and browse books with ease</p>
    </div>

    <div v-if="errorMessages?.length" class="my-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
        <div class="block font-semibold mb-1">Oops! Something went wrong</div>
        <div v-for="errorMessage in errorMessages" :key="errorMessage.text">{{ errorMessage.text }}</div>
    </div>

    <RouterView @error="handleError" />
  </div>
</template>

