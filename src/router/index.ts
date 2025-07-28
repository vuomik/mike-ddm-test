import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router'
import Home from '@/views/Home.vue'
import Books from '@/views/Books.vue'
import BookList from '@/components/BookList.vue'
import BookDetails from '@/components/BookDetails.vue'

export default function createRouter() {
  return _createRouter({
    history:
      typeof window === 'undefined'
        ? createMemoryHistory() // for SSR server
        : createWebHistory(), // for browser client
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/books',
        component: Books,
        children: [
          {
            name: 'Books',
            path: '',
            component: BookList,
          },
          {
            path: ':id',
            component: BookDetails,
          },
        ],
      },
    ],
  })
}
