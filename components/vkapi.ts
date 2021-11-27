import { UserAutorisaded, Track, RequestParams, User, ResponseTracks, Profile } from "./static";
import MD5 from "./hashlib";

const APP_SECRET = "hHbZxrka2uZ6jB1inYsH";
const APP_ID = 2274003;


enum MP3GetErrors {
  urlIsIrcorrect = "i",
  noMatches = "n"
}


export default class VkAudios {
  private _token?: string;
  private _login?: string;
  private _password?: string;
  private _user_id?: number;
  private _secret?: string;
  public s: string = "123";


  private async sendRequest<Type>(method:"execute.getUserInfo" | "auth.refreshToken" | "audio.get" | "audio.getAlbumById", params?:RequestParams) : Promise<Type> {
    if (!this._secret) {
      throw new Error("Secret unknow");
    }
    if (!this._token) {
      throw new Error("Unathorizaded");
    }

    let url = `/method/${method}?v=5.95&access_token=${this._token}&device_id=${this.deviceId}`;
    if (params)
      Object.keys(params).forEach((key) => {
        url += `&${key}=${params[key as keyof RequestParams]}`
      });
    
    
    
    const hash = MD5(url + this._secret);
    let response = await fetch(`https://api.vk.com${url}&sig=${hash}`, {
      headers: {
        "User-Agent": "VKAndroidApp/4.13.1-1206 (Android 4.4.3; SDK 19; armeabi; ; ru)",
        "Accept": "image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, */*"
      }
    });
    
    const text = await response.text();
    const json = JSON.parse(text);

    if (~text.substr(0, 10).indexOf("error")) {
      console.log(text);
      throw new Error(json.error.error_description);
    }
    
    return json.response as Type;
  }


  /**
   * @description Конвертирует ссылку на m3u8 в ссылку на mp3, если это возможно
   * @param url Ссылка на m3u8 файл
   * @returns Рабочая ссылка на mp3
   */
  private getMp3Path(url: string) : string {
    const offset = url.length - url.indexOf("index.m3u8");
    
    
    if (offset == 10) {
      return ""
    }
    // link example
    // https://cs1-42v4.vkuseraudio.net/p11/e2507647d37/c04a3beca11123/index.m3u8?extra=[manySymbols]&long_chunk=1
    
    // По этому паттерну будем искать ключ
    const patternReplaceKey = /\w+\/index.m3u8/;
    // Этот для замены
    const patternReplaceble = /\w+\/\w+\/index.m3u8/;

    const keyMatches = url.match(patternReplaceKey);
    if (!keyMatches) {
      return "";
    }

    const keyMatch = keyMatches[0];
    const indexm3u8Start = keyMatch.indexOf("/index.m3u8");
    const key = keyMatch.substring(0, indexm3u8Start);
    
    const urlToMp3 = url.replace(patternReplaceble, `${key}.mp3`);
    
    return urlToMp3;
  }


  /**
   * @description В случае, если авторизация проходит через логин с паролем, потребуется так же использовать метод auth
   * @param {string} token Уже существующий авторизационный токен. Опционален, если последние 2 поля обьявлены
   * @param {string} login Логин от аккаунта. Игнорируется, если token обьявлен. В случае, если token не обьявлен, так же должен быть обьявлен password
   * @param {string} password Пароль от аккаунта. Игнорируется, если token объявлен. Должен быть обьявлен если авторизация через login
   */
  constructor(public readonly deviceId:string, token?: string, login?: string, password?: string) {
    if (token) {
      this._token = token;
      return;
    }
    if (!login || !password) {
      throw new Error("Неполные авторизационные данные");
    }
    this._login = login;
    this._password = password;
  }


  /**
   * @description Выполняет авторизацию логина и пароля и проверку токена на валидность
   * @returns 1 - в случае успеха
   * @returns 0 - в случае ошибки
   */
  public async auth() {
    if (!this._token) {
      const URL = `https://oauth.vk.com/token?grant_type=password&scope=nohttps,audio&client_id=${APP_ID}&client_secret=${APP_SECRET}&username=${this._login}&password=${this._password}`
      let response = await fetch(URL);
      // if (response.status != 200) {
      //   return false;
      // }
      let json: UserAutorisaded = await response.json();
      
      if (json.error) {
        console.log(this._login);
        console.log(this._password);
        throw new Error(json.error_description);
      }
      this._secret = json.secret;
      this._token = json.access_token;
    }
    
    if (!this._secret) {
      throw new Error("Secret не дан");
    }
    
    
    this._user_id = (await this.sendRequest<User>("execute.getUserInfo", { func_v: 9 })).profile.id;
    console.log(12);
    try {
      await this.sendRequest("auth.refreshToken", {lang: "ru"});
    } catch (err) {
      const error = err as Error;
      console.log(error.message == "Already read");
      
      if (!(error.message == "Already read")) throw new Error(error.message);
    }
    return true;
  }


  /**
   * @description Получение всех треков пользователя с указанным user_id
   * @param {number} user_id Идентификатор пользователя, треки которого нужно получить
   */
  public async getTracks(user_id:number = this._user_id ? this._user_id : 0) : Promise<Track[]> {

    if (!user_id) {
      throw new Error("No autorisation");
    }
    
    return this.getAlbumById(user_id, -1);
  }

  /**
   * 
   * @param ownerId owner_id альбома
   * @param albumId id альбома
   */
  public async getAlbumById(ownerId: number, albumId: number): Promise<Track[]> {
    try {
      const resp = await this.sendRequest<ResponseTracks>("audio.get", {owner_id: ownerId, album_id: albumId});
      const items = resp.items;
    
      for (let i =0; i < items.length; i++) {
        let url = this.getMp3Path(items[i].url);
        if (!url) {
          items[i].urlReadeble = false;
          continue;
        }
        items[i].url = url;
        items[i].urlReadeble= true;
      }

      return items;
    } 
    catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * @description Получить список треков в альбоме по одному треку
   * @param {Track} track Some трек
   * @returns Сопрограмма, которая вернет список треков. В Случае, если трек не привязан к альбому, будет исключение
   */
  public getAlbumByTrack(track: Track): Promise<Track[]> {
    if (!track.album) throw new Error("This track in not included album");
    
    const ownerId = track.album.owner_id;
    const trackId = track.album.id;
    return this.getAlbumById(ownerId, trackId);
    ;
  }

  
  
  public get token() : string {
    return this._token ? this._token : "";
  }

  public get secret() : string {
    return this._secret ? this._secret : "";
  }
  
  
  public set secret(v : string) {
    this._secret = v;
  }
  
  
}