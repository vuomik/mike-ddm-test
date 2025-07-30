import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router'
import type { Router } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import BookSearch from '@/views/BookSearch.vue'
import BookList from '@/components/BookList.vue'

export default function createRouter(): Router {
  return _createRouter({
    history:
      typeof window === 'undefined'
        ? createMemoryHistory() // for SSR server
        : createWebHistory(), // for browser client
    routes: [
      {
        path: '/',
        name: 'Home',
        component: HomePage,
      },
      {
        path: '/books',
        component: BookSearch,
        children: [
          {
            name: 'Books',
            path: '',
            component: BookList,
          },
        ],
      },
    ],
  })
}
