<script setup lang="ts">
import { useBooks } from '@/composables/useBooks'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { z } from 'zod'
import type { Message } from '@shared/types'
import { INITIAL_PAGE } from '@server/utils/pages'

const route = useRoute()
const router = useRouter()

const { books, isLoading, loadBooks, pagination, getErrorMessages } = useBooks()

const query = ref(z.coerce.string().default('').parse(route.query.q))
const page = ref(
  z.coerce.number().int().default(INITIAL_PAGE).parse(route.query.page)
)

const emit = defineEmits<(e: 'error', messages: Message[]) => void>()

const onSearch = async (): Promise<void> => {
  page.value = INITIAL_PAGE
  try {
    await loadBooks(query.value, page.value)
    await updateUrl()
  } catch (e: unknown) {
    emit('error', getErrorMessages(e))
  }
}

const updateUrl = async (): Promise<void> => {
  await router.push({
    query: {
      q: query.value,
      page: page.value.toString(),
    },
  })
}

const nextPage = async (): Promise<void> => {
  if (page.value < pagination.value.totalPages) {
    page.value++
    await loadBooks(query.value, page.value)
    await updateUrl()
  }
}

const prevPage = async (): Promise<void> => {
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- First page is 1 */
  if (page.value > 1) {
    page.value--
    await loadBooks(query.value, page.value)
    await updateUrl()
  }
}

const selectBook = async (id: string): Promise<void> => {
  await router.push({ path: `/books/${id}` })
}

/* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- First page is 1 */
const showPrevPage = computed(() => page.value > 1)
const showNextPage = computed(() => page.value < pagination.value.totalPages)
const showSearchResults = computed(
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Make sure we have at least 1 book to show results */
  () => query.value !== '' && books.value.length > 0
)

onMounted(async () => {
  await loadBooks(query.value, page.value)
})
</script>

<template>
  <div class="p-4">
    <slot name="banner" />

    <div class="my-4">
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          v-model="query"
          type="text"
          placeholder="Search books..."
          class="w-full p-2 border border-gray-300 rounded"
          @keyup.enter="onSearch"
        />
        <button
          class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          @click="onSearch"
        >
          Search
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-4">Loading...</div>
    <div v-else-if="showSearchResults">
      <div class="flex justify-between items-center mt-6 mb-6">
        <button
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          :disabled="!showPrevPage"
          @click="prevPage"
        >
          Previous
        </button>
        <span class="text-sm"
          >Page {{ page }} of {{ pagination.totalPages }}</span
        >
        <button
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          :disabled="!showNextPage"
          @click="nextPage"
        >
          Next
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div
          v-for="book in books"
          :key="book.id"
          class="p-4 border rounded hover:shadow cursor-pointer transition"
          @click="selectBook(book.id)"
        >
          <h3 class="text-lg font-semibold">{{ book.title }}</h3>
          <p class="text-sm text-gray-600">by {{ book.author }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4">
      There are no search results. Please try a different search.
    </div>
  </div>
</template>
