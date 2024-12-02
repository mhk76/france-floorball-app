import { useGlobalStore } from 'src/stores/globalStore';
import MatchRefereeInfoApi from 'src/models/api/MatchRefereeInfoApi';
import MatchRefereeInfo from 'src/models/MatchRefereeInfo';

const global = useGlobalStore();

export function useMatchRefereeInfoMapper(
	api: MatchRefereeInfoApi
): MatchRefereeInfo {
	return {
		id: api.id,
		name: global.name(api.firstname, api.lastname),
	};
}
