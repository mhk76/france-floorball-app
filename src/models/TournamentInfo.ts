export default interface TournamentInfo {
	id: number;
	name: string;
	shortname: string;
	division: number;
	division_name: string | null;
	agecategoryid: number | null;
	kind: number;
	kind_name: string;
	non_official_teams: boolean;
	non_official_players: boolean;
	reason_of_cancel: string;
	is_canceled: boolean;
	logo: string;
	color1: string;
	color2: string;
	status: number;
	status_name: string;
	agecategory_name: string;
	agecategory_id: number;
	organizator: number;
	organizator_name: string;
	season_id: number;
	season_name: string;
}
