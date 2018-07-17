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
	rank: string;
    name: string;
    score: string;
    danger: boolean;
	connectionStatus: ConnectionStatus;
	scoreboardStatus: ScoreboardStatus;
	playStatus: PlayStatus;
	field: Object;
}