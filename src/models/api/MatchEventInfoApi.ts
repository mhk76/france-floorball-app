export default interface MatchEventInfoApi {
	id: number;
	playerid1: number;
	player1firstname: string;
	player1lastname: string;
	playerid2: number;
	player2firstname: string | null;
	player1isprivate: number;
	player2isprivate: number | null;
	officialisprivate: number | null;
	player2lastname: string;
	officialid1: number;
	officialfirstname: string | null;
	officiallastname: string | null;
	matchid: number;
	period: string;
	time: string;
	type: string;
	penality: string;
	code: string;
	codeName: string | null;
	teamid: number;
	goalkeeperid: number;
	teamlogo: string;
	runningscore: string;
	player1Name?: string;
	player2Name?: string;
	officialName?: string;
}
