import { defineStore } from 'pinia';

export const storeLoading = defineStore("loading", {
	state: () => ({
		_count: 0,
	}),
	actions: {
		loadingPush() {
			this._count++;
		},
		loadingPop() {
			if (this._count > 0) this._count--;
		},
		setLoading(isLoading: boolean) {
			this._count = isLoading ? 1 : 0;
		},
		resetLoading() {
			this._count = 0;
		}
	},
	getters: {
		isLoading(state) {
			return state._count > 0;
		},
	},
});