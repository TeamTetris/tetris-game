
/// <reference path="../../../definitions/phaser.d.ts"/>

import * as socketIO from 'socket.io-client';

export default class NetworkingClient {
	//region public members
	//endregion

  //region public methods
  public emit(event: string, args) {
    this._socket.emit(event, args);
  }

  public receive(event: string, callback: Function) {
    this._socket.on(event, callback);
  }
	//endregion

  //region constructor
  public constructor() {
    this._socket = socketIO('http://localhost:8081');
  }
	//endregion

  //region private members
  private _socket: SocketIOClient.Socket;
	//endregion

	//region private methods
	//endregion
}
