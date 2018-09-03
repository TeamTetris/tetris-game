import Match from "tetris/interfaces/Match";

export default interface JoinResult {
	success: boolean;
	message: string;
	match: Match;
}