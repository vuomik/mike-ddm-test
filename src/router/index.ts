import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Books from '../views/Books.vue';

export default function createRouter() {
  return _createRouter({
    history: typeof window === 'undefined'
      ? createMemoryHistory() // for SSR server
      : createWebHistory(),   // for browser client
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/books',
        name: 'Books',
        component: Books,
      },
      {
        path: '/books/:id',
        name: 'Book Details',
        component: Books,
      },
    ],
  });
}