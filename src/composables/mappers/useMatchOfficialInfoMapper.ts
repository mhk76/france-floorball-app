import { useGlobalStore } from 'src/stores/globalStore';
import MatchOfficialInfoApi from 'src/models/api/MatchOficialInfoApi';
import MatchOfficialInfo from 'src/models/MatchOfficialInfo';

const global = useGlobalStore();

export function useMatchOfficialInfoMapper(
	api: MatchOfficialInfoApi
): MatchOfficialInfo {
	return {
		id: api.id,
		name: global.name(api.firstname, api.lastname),
		teamId: api.teamid,
	};
}
