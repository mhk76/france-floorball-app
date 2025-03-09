import TeamInfoApi from 'src/models/api/TeamInfoApi';
import TeamInfo from 'src/models/TeamInfo';

export default function useTeamInfoMapper(api: TeamInfoApi): TeamInfo {
	return {
		id: api.id,
		name: api.name,
		clubId: api.clubid,
		category: api.category,
	};
}
