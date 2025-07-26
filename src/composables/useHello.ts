import { ref } from "vue";
import { helloService } from '../services/hello';

export function useHello() {
    const hello = ref<string>('');
    const { fetch } = helloService();

    const isLoading = ref(false);

    const loadHello = async () => {
        if (isLoading.value) return;
        isLoading.value = true;
        try {
            hello.value = await fetch();
        } catch (e) {
            alert(e);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        hello,
        loadHello
    }
}