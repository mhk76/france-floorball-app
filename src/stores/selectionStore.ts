import { defineStore } from 'pinia';

type SelectionValue = number | string;

export const useSelectionStore = defineStore('selection', {
	state: () => ({
		cache: new Map<string, SelectionValue>(),
	}),

	actions: {
		clear(key: string) {
			this.cache.delete(key);
		},

		get(key: string, defaultValue?: SelectionValue) {
			return this.cache.get(key) ?? defaultValue;
		},

		set(key: string, value: SelectionValue | undefined) {
			if (value === undefined) {
				this.cache.delete(key);
			} else {
				this.cache.set(key, value);
			}
		},
	},
});
