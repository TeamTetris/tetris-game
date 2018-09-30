import Match from "tetris/match/match";

export default interface JoinResult {
	success: boolean;
	message: string;
	match: Match;
}