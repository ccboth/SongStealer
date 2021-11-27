
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
 * @description Структура возвращаемая через response, в ответ на audio.get
 * @param {number} count количество полученных треков
 * @param {Track[]} items Собственно сам список
 */

export interface ResponseTracks {
	count: number;
	items: Track[];
}

/**
 * @description Трек
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
	artist: string;
	title: string;
	url: string;
	duration: number;
	album?: Album;
	urlReadeble: boolean;
}


/**
 * @description Информация об альбоме
 * @example
 * {
 * 	"id":7822707,
 * 	"title":"The Path",
 * 	"owner_id":-2000822707,
 * 	"access_key":"f655a4a1b6ea3d222f",
 * 	"thumb":{
 * 		"width":300,
 * 		"height":300,
 * 		"photo_34":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=34x0&quality=90&sign=8d3ae8712d4be71e492546d90ffbc51f&c_uniq_tag=aCg1t3dRgoEe8HY6DoskksMTkhAIO674JGwg8ynIkaA",
 * 		"photo_68":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=68x0&quality=90&sign=1485f7900988659ad1216c0d1b1d66ee&c_uniq_tag=idCHeklEZcDAv-LXDHp1zxZ68cxhypdu5JrphEOXk88",
 * 		"photo_135":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=135x0&quality=90&sign=65e57bf7caaa2336fbbe98cbafcadeef&c_uniq_tag=3ckbXKCQzDBWc-F62oRYxLQbgC5AFtQfTHz55OrXWBQ",
 * 		"photo_270":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=270x0&quality=90&sign=a9b6f82ba237a9766237cae05bfd54db&c_uniq_tag=03L5moptwL0tNyr93AiE7SdZJNSTraaRAGqYyeuZzw4",
 * 		"photo_300":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=300x0&quality=90&sign=9a056bc3232f1c89889304c7dec0f41e&c_uniq_tag=a4MdRIMM3LuR5CnGs71WR39usMsW3S_Jh3j4nkQCjTw",
 * 		"photo_600":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=600x0&quality=90&sign=4d9a97dd015444e272fecb2f454102cc&c_uniq_tag=HgjcKHiu4nbnBiaua5k52YSUAdvUsSjHI3EAIBpKGgU",
 * 		"photo_1200":"https://sun1-57.userapi.com/impf/c858216/v858216283/2385df/hoXyHJF9Mmc.jpg?size=1184x0&quality=90&sign=8c51c1991b1315510f3e5dae1a401a5a&c_uniq_tag=WnPSpqJq4QSAgl_JrtodCIim8qhX9PHOOUKWJJ-pCak"
 * 	}
 * }
 */


export interface Album {
	id: number;
	title: string;
	owner_id: number;
	access_key: string;
	thumb: {
		width: number;
		height: number;
		photo_34: string;
		photo_68: string;
		photo_135: string;
	}
}


/**
 * @description Информация о пользователе
 * @param {Profile} profile Информация о профиле
 */

export interface User {
	profile: Profile;
}

/**
 * @description Профиль юзера
 * @param {number} id Идшник юзера в вк
 * @param {string} first_name Имя
 * @param {string} last_name Фамилия
 */

export interface Profile {
	id: number;
	first_name: string;
	last_name: string;
}

export interface RequestParams {
	owner_id?: number;
	lang?: "ru" | "en";
	func_v?: number;
	access_key?: string;
	id?: number;
	track_code?: string;
	content_id?: string;
	album_id?: number;
	count?: number;
}
