enum ConnectionStatus {
	Connecting,
	Connected,
	Disconnected
}

enum ScoreboardStatus {
	Regular,
	Endangered,
	Spotlighted
}

enum PlayStatus {
	Playing,
	Finished
}

export default interface MatchPlayer {
	displayName: string;
	points: number;
	placement: number;
	connectionStatus: ConnectionStatus;
	scoreboardStatus: ScoreboardStatus;
	playStatus: PlayStatus;
	field: Object;
}