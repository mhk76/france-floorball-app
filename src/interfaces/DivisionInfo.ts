export default interface DivisionInfo {
	id: number;
	name: string;
	tournament_id: number;
	tournament_name: string | null;
	type: string;
	level: number;
	comp_order: number;
	relatedtoid: number;
	relatedtoid2: number | null;
	relatedtoid3: number | null;
	relatedtoid4: number | null;
	agecategoryid: number;
	teamwinner: string | null;
	teamrunnerup: string | null;
	bestscorer: number;
	iscanceled: boolean;
	reasonofcancel: string;
	match_goalkeeper_required: boolean;
	match_max_players: number;
	status: number;
	nb_teams: number;
	ishide: boolean;
	rankingsystem: string | null;
	pointssystem: string | null;
	season_id: number;
}
