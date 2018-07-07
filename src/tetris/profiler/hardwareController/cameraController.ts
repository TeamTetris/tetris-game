import HardwarePermission from "tetris/profiler/hardwareController/hardwarePermission";

export default class CameraController {

	//region public members
	public get permissionState(): HardwarePermission {
		return this._permissionState;
	}
	//endregion

	//region public methods
	public startVideoStream(): Promise<MediaStream> {
		if (this.permissionState === HardwarePermission.denied) {
			return Promise.reject(new Error('No Permissions granted'));
		}
		return new Promise( (resolve, reject) => {
			navigator.mediaDevices.getUserMedia({video: true})
				.then((stream: MediaStream) => {
					this._permissionState = HardwarePermission.granted;
					this._videoElement.classList.add('visible');
					this._videoElement.srcObject = stream;
					this._videoStream = stream;
					this._videoElement.play().then(() => resolve(stream));
				})
				.catch(reason => {
					this._permissionState = HardwarePermission.denied;
					console.log('Can not start video stream. Message: ' + reason);
					reject(new Error('Can not start video stream'));
				});
		});
	}

	public stopVideoStream(): void {
		if (!this._videoStream) {
			return;
		}
		this._videoElement.pause();
		this._videoStream.stop();
		this._videoElement.src = null;
	}

	public takeSnapshot(): Promise<string> {
		if (this._videoStream) {
			return Promise.resolve(this._takeSnapshot());
		}
		return new Promise((resolve, reject) => {
			this.startVideoStream()
				.then(() => resolve(this._takeSnapshot()))
				.catch(error => reject(error));
		});

	}

	//endregion

	//region constructor
	private static _instance: CameraController;

	public static get instance(): CameraController {
		if (!this._instance) {
			this._instance = new CameraController();
		}
		return this._instance;
	}

	private constructor() {
		this._canvas = document.getElementById('hidden-camera-canvas') as HTMLCanvasElement;
		this._videoElement = document.getElementById('camera-stream') as HTMLVideoElement;
		this._takePhotoButton = document.getElementById('take-photo') as HTMLLinkElement;
		this._deletePhotoButton = document.getElementById('delete-photo') as HTMLLinkElement;
		this._photoPreview = document.getElementById('snap') as HTMLImageElement;
		this._permissionState = HardwarePermission.requested;
		this._takePhotoButton.addEventListener('click', this._takePhotoButtonClicked.bind(this));
		this._deletePhotoButton.addEventListener('click', this._deletePhotoButtonClicked.bind(this));
	}
	//endregion

	//region private members
	private readonly _canvas: HTMLCanvasElement;
	private readonly _videoElement: HTMLVideoElement;
	private readonly _takePhotoButton: HTMLLinkElement;
	private readonly  _deletePhotoButton: HTMLLinkElement;
	private readonly  _photoPreview: HTMLImageElement;
	private _permissionState: HardwarePermission;
	private _videoStream: MediaStream;
	//endregion

	//region private methods
	private _takeSnapshot(): string {
		this._canvas.width = this._videoElement.videoWidth;
		this._canvas.height = this._videoElement.videoHeight;
		this._canvas.getContext('2d').drawImage(
			this._videoElement,
			0,
			0 ,
			this._videoElement.videoWidth,
			this._videoElement.videoHeight
		);

		return this._canvas
			.toDataURL('image/png')
			.replace(/^data:image\/(png|jpg);base64,/, "");
	}

	private _takePhotoButtonClicked(event: Event): void {
		event.preventDefault();

		this.takeSnapshot().then(image => {
			this._photoPreview.src = "data:image/png;base64, " + image;
			this._photoPreview.classList.add('visible');
			this._deletePhotoButton.classList.remove('disabled');
			this._videoElement.pause();
		});
	}

	private _deletePhotoButtonClicked(event: Event): void {
		event.preventDefault();

		this._photoPreview.classList.remove('visible');
		this._photoPreview.src = '';
		this._deletePhotoButton.classList.add('disabled');
		this._videoElement.play();
	}
	//endregion
}