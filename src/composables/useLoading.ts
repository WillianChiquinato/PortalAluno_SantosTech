import { storeLoading } from "~/infra/store/storeLoading";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default function useLoading() {
	const loadingStore = storeLoading();
	const { isLoading } = storeToRefs(loadingStore);

	const loadingPush = () => loadingStore.loadingPush();
	const loadingPop = () => loadingStore.loadingPop();
	const setLoading = (value: boolean) => loadingStore.setLoading(value);

	return {
		loadingPush,
		loadingPop,
		setLoading,
		isLoading
	};
}