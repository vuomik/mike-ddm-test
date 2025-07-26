<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useBooks } from '../composables/useBooks';

const { hello, loadHello } = useBooks();

onMounted(async () => {
    loadHello(); // @todo do we need async
})

</script>

<template>
    <div>Hello {{ hello }}</div>
</template>