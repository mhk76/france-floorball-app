import { defineStore } from 'pinia';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { ref } from 'vue';

export interface PathItem {
	label: string;
	to: string;
}

interface CacheData {
	expiration: number;
	data: object;
}

const CACHE_TIME = 60 * 60 * 1000; // one hour
const quasar = useQuasar();

export const useGlobalStore = defineStore('global', {
	state: () => ({
		path: ref<PathItem[]>([]),
		cache: new Map<string, CacheData>(),
		selectedDivision: undefined as number | undefined,
		selectedSeason: undefined as number | undefined,
		selectedView: undefined as string | undefined,
		timezone: new Intl.DateTimeFormat('fr-FR', {
			timeZone: 'Europe/Paris',
			timeZoneName: 'longOffset',
		})
			.format(new Date())
			.split(' UTC')[1],
	}),

	actions: {
		date(date: string, time: string = '00:00:00'): Date {
			return new Date(`${date}T${time}.000${this.timezone}`);
		},

		async loadData<T>(
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

		notify(options: QNotifyCreateOptions) {
			quasar.notify(options);
		},

		setData(key: string, data: object) {
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

		setPath(pathItems: PathItem[]) {
			this.path = pathItems;
		},
	},
});
