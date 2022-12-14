import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import {
	environment
} from '@environment/environment';

import {
	MappedFormData
} from '@helpers/mapFormToHttpRequest';

interface Selectors {
	city: string[]
	uf: string[]
}

interface ReverseGeolocationProps {
	lat:number,
	long:number
}

export interface PlaceProperty {
	address_line1:string  // Send as street to backend
	city:string
	county:string         // Send as state to backend

	// Do not send to backend
	street:string
	housenumber:string
}

interface Place {
	properties: PlaceProperty
}

interface PlaceResponse {
	features: Place[]
}

interface ImageUploadResponse {
	data: {
		display_url: string
	}
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
	private baseUrl:string = ''
	private apiKey:string = ''
	private backendUrl:string = ''

  constructor(
		private client:HttpClient
	) {
		this.baseUrl = environment.GEO_API_URL
		this.apiKey = environment.GEO_API_KEY
		this.backendUrl = `${environment.ECOLETA_API_URL}/points`
	}

	getReverseGeolocation(
		{ lat, long }:ReverseGeolocationProps
	) {
		const url = `${this.baseUrl}?lat=${lat}&lon=${long}&apiKey=${this.apiKey}`
		return this.client.get<PlaceResponse>(url)
	}

	getCollectorLocationSelectors() {
		return this
		  .client
			.get<Selectors>(`${this.backendUrl}/get-selectors`)
	}

	getMarksByLocation({ city }:{city:string,uf?:string}){
		return this.client.get(`${this.backendUrl}/list/${city}`)
	}

	getDetailedCollectorById<T=any>(id:string) {
		return this.client.get<T>(`${this.backendUrl}/${id}`)
	}

	registerNewCollectorPoint(data: MappedFormData) {
		const endpoint = `${this.backendUrl}/new`
		return this.client.post(endpoint, data)
	}

	uploadImage(image:File|Blob) {
		const uri = `https://api.imgbb.com/1/upload?key=${environment.IMGBB_KEY}`
		const formData = new FormData()
		formData.append('image', image)

		return this
		  .client
			.post<ImageUploadResponse>(uri, formData)
	}

	unsubscribe(subscription:Subscription) {
		subscription.unsubscribe()
	}
}
