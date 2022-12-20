import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

import {
	environment
} from '../../environment/environment'; 
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService extends FormGroup {
	private readonly apiUrl = `https://api.imgbb.com/1/upload?key=${environment.IMGBB_KEY}`
	private readonly options = { headers: {
		'content-type': 'multipart/form-data'
	}}
	private _imagePreview:string = ''
	private _imagePreviewSubscription: Subscription|undefined

  constructor(private httpClient: HttpClient) {
		const formControl = {
			name: new FormControl(''),
			email: new FormControl(''),
			whatsapp: new FormControl(''),
			street: new FormControl(''),
			number: new FormControl(''),
			city: new FormControl(''),
			state: new FormControl(''),
			picture: new FormControl()
		}

		super(formControl)
		return this
	}

	onImageChange(event:Event) {
		const { files } = event.target as HTMLInputElement
		if(!files || files === null) return;

		const file = files[0]
		this.setValue({
			...this.getRawValue(),
			picture: file
		})

		const reader = new FileReader()
		reader.onload = () => {
			this._imagePreview = reader.result?.toString() ?? ''
		}

		reader.readAsDataURL(file)
	}

	uploadImage(image:File) {
		const uploadData = new FormData()
		uploadData.append('image', image)
		//uploadData.append('key', environment.IMGBB_KEY)

		this
		  .httpClient
			.post(this.apiUrl, uploadData, this.options)
			.subscribe(console.log)
	}

	submit() {
		if(!this.getRawValue().picture) {
			throw Error('No file/image selected')
		}

		this.uploadImage(this.getRawValue().picture)
		this.reset()
		this._imagePreview = ''
	}

	get imagePreview():string {
		return this._imagePreview
	}

	get subscribe() {
		return this._imagePreviewSubscription
	}
}
