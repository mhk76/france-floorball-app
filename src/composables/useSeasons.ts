import { useDataStore } from 'src/stores/dataStore';
import API from 'src/definitions/API';
import SeasonInfo from 'src/models/SeasonInfo';

const data = useDataStore();

export async function useSeasons() {
	return await data.load<SeasonInfo[]>('season-info', API.SEASON_LIST);
}
