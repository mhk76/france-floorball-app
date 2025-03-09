import { TrophyApi } from 'src/models/api/TrophyApi';
import { Trophy } from 'src/models/Trophy';

export default function useTrophyMapper(items: TrophyApi[]): Trophy[] {
	return items
		.sort((a: TrophyApi, b: TrophyApi) => {
			const order = b.winning_id - b.winning_id;

			if (order === 0) {
				return a.weight - b.weight;
			} else {
				return order;
			}
		})
		.map(
			(api) =>
				({
					tournament: api.name,
					rank: api.title,
				} as Trophy)
		);
}
