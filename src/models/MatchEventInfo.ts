import { EVENT_TYPE } from 'src/definitions/EventType';

export default interface MatchEventInfo {
	id: number;
	player1Id: number;
	player1Name: string;
	player2Id: number | undefined;
	player2Name: string | undefined;
	officialId: number | undefined;
	officialName: string | undefined;
	period: string;
	time: string;
	type: EVENT_TYPE;
	code: string;
	teamId: number;
	penalty: string;
	runningScoreHome: number;
	runningScoreAway: number;
}
