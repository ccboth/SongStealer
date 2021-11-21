
/**
 * @description
 * Основной ответ авторизации.
 * @param {string} access_token Авторизационный токен
 * @param {number} expires_in ъ
 * @param {number} user_id Идшник юзера, который авторизовался
 * @example 
 * {
 * "access_token": "5b43464d4f57be9225df7642b9d3bd685f7c29b2f7c8646cbf96aacfd5b65282df8fe79d2ae65d40a587e",
 * "expires_in": 0,
 * "user_id": 567984712
 * } */

export interface UserAutorisaded {
	access_token?: string;
	expires_in?: number;
	user_id?: number;
	error?: string;
	error_description?: string;
	secret?: string;
}



/**
 * @description Ответ на запрос трека
 * @example
 * { 
 *    'id': 456239063, 
 *    'owner_id': 567984712, 
 *    'track_covers': [
 * 			'https://sun9-86.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=80x80&quality=96&sign=9dda9339ba68ab2f5b9ef31adbfd3c57&type=audio', 'https://sun9-86.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=150x150&quality=96&sign=0d307212a7fea2bb2f01b6ffe293b64b&type=audio'
 * 		], 
 * 		'url': 'https://cs1-42v4.vkuseraudio.net/p11/b36e7515ba7822.mp3?extra=Mgg-8TtVjptvaW8P-_vXAlqOJSVIIJ6CddvwTJT_JjI0hgaDKu4R3TTueVgIN_he6_vi7jXkhEo8CRMoSoc0h-srGFYcEfD8V2mWgIpYFDJzodCB627yTK8XBuLb2EBNwPEcSmSb0GnmVSaE8gxNqzbTaA&long_chunk=1', 
 * 		'artist': 'Fit For A King feat. Ryo Kinoshita', 
 * 		'title': 'God of Fire', 
 * 		'duration': 210
 * }
 */
export interface Track {
	id:number;
	owner_id: number;
	track_covers: string[];
	url: string;
	artist: string;
	title: string;
	duration: number
}


export interface RequestParams {
	owner_id?: number;
	lang?: "ru" | "en";
	func_v?: number;
	
}