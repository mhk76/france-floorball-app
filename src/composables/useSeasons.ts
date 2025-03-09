import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import SeasonInfoApi from 'src/models/api/SeasonInfoApi';
import SeasonInfo from 'src/models/SeasonInfo';

const data = useDataStore();

export async function useSeasons(): Promise<SeasonInfo[]> {
	return (
		await data.load<SeasonInfoApi[]>('season-info', API.SEASON_LIST)
	).map((api) => ({
		id: api.id,
		name: api.name,
		isCurrent: api.iscurrent === 1,
	}));
}
