import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import { Trophy } from 'src/models/Trophy';
import { TrophyApi } from 'src/models/api/TrophyApi';
import useTrophyMapper from './mappers/useTrophyMapper';

const data = useDataStore();

export async function useClubTrophies(clubId: number): Promise<Trophy[]> {
	return useTrophyMapper(
		await data.load<TrophyApi[]>(
			`club-trophies-${clubId}`,
			API.CLUB_TROPHIES,
			{
				command: 'getall_club',
				club: clubId,
			}
		)
	);
}
