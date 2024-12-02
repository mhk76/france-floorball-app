import { defineStore } from 'pinia';

interface CacheData {
	expiration: number;
	data: object;
}

const CACHE_TIME = 60 * 60 * 1000; // one hour

export const useDataStore = defineStore('data', {
	state: () => ({
		cache: new Map<string, CacheData>(),
	}),

	actions: {
		async load<T>(
			key: string,
			url: string,
			postData?: object,
			noCache?: boolean
		) {
			if (
				noCache ||
				!this.cache.has(key) ||
				this.cache.get(key)!.expiration < new Date().getTime()
			) {
				const parameters = postData
					? {
							method: 'POST',
							headers: {
								accept: 'application/json',
								'Content-Type': 'application/json; charset=UTF-8',
							},
							body: JSON.stringify(postData),
					  }
					: {
							method: 'GET',
							headers: {
								accept: 'application/json',
								'Content-Type': 'application/json; charset=UTF-8',
							},
					  };

				const response = await fetch(url, parameters);

				if (response.status === 200) {
					const data = (await response.json()) as T;

					if (!noCache) {
						this.cache.set(key, {
							expiration: new Date().getTime() + CACHE_TIME,
							data: data as object,
						});
					}

					return data;
				} else {
					return {} as T;
				}
			} else {
				return this.cache.get(key)!.data as T;
			}
		},

		set(key: string, data: object) {
			this.cache.set(key, {
				expiration: new Date().getTime() + CACHE_TIME,
				data: data,
			});
		},

		setExpiration(key: string, expiration: number) {
			const data = this.cache.get(key);

			if (data) {
				data.expiration = expiration;
			}
		},
	},
});
