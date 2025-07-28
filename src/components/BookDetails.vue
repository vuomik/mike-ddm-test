<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooks } from '@/composables/useBooks'
import { Message } from '@shared/types'
import { z } from 'zod'

const { book, isLoading, loadBook, getErrorMessages } = useBooks()

const route = useRoute()
const router = useRouter()

const id = z.coerce.string().parse(route.params.id)

const emit = defineEmits<{
  (e: 'error', messages: Message[]): void
}>()

onMounted(async () => {
  try {
    await loadBook(id)
  } catch (e: unknown) {
    emit('error', getErrorMessages(e))
  }
})
</script>

<template>
  <div class="p-4">
    <div v-if="isLoading" class="text-center py-4">Loading book...</div>
    <div v-else-if="book" class="max-w-md mx-auto">
      <img
        :src="book.imageUrl"
        alt="Book cover"
        class="w-full max-w-xs mx-auto mb-4"
      />
      <h2 class="text-xl font-bold">{{ book.title }}</h2>
      <p class="text-gray-600 mb-2">by {{ book.author }}</p>
      <p class="mb-2">
        <strong>Average Rating:</strong> {{ book.averageRating }}
      </p>
      <p v-if="book.publicationYear">
        <strong>Published:</strong> {{ book.publicationYear }}
      </p>
      <p class="mt-4">{{ book.description || 'No description available.' }}</p>
    </div>
  </div>
</template>
