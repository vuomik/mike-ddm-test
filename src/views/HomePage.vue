<template>
  <div class="max-w-2xl mx-auto px-4 py-8 text-center">
    <h1 class="text-4xl font-extrabold mb-6">The Mission</h1>
    <p class="text-lg text-gray-700 leading-relaxed">
      Create a small web app that lets users search for books. Use Vue, CSS, and
      JavaScript, and a server-side orchestration layer in Node.js that proxies
      and transforms the Goodreads public API.
      <br /><br />
      The front end should provide a search bar where a user can enter text, and
      a view that shows book results. The backend should contain an endpoint
      that accepts search and pagination info, connects to the Goodreads search
      API, transforms the XML into JSON, and keeps RESTful practices in mind.
      <br /><br />
      It's up to you what metadata you'd like to render for each book, and how
      you want to handle display states for pagination, errors, etc.
      <br /><br />
      <a
        href="https://github.com/vuomik/mike-ddm-test"
        class="text-blue-500 hover:underline"
        >https://github.com/vuomik/mike-ddm-test</a
      >
    </p>
  </div>
</template>
