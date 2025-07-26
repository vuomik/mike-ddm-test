<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useHello } from '../composables/useHello';

const { hello, loadHello } = useHello();

onMounted(async () => {
    loadHello(); // @todo do we need async
})

</script>

<template>
    <div>Hello {{ hello }}</div>
</template>