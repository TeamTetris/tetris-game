export default class Profile {
	//region public members
	//endregion

	//region public methods
	public add(name: string, data: object) {
		this._profileData.push({
			'name': name,
			'data': data
		});
	}
	//endregion

	//region constructor
	//endregion

	//region private members
	private _profileData: object[] = [];
	//endregion

	//region private methods
	//endregion
}