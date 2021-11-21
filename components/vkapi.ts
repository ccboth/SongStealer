import { UserAutorisaded, Track, RequestParams } from "./static";
import MD5 from "./hashlib";

const APP_SECRET = "hHbZxrka2uZ6jB1inYsH";
const APP_ID = 2274003;


export default class VkAudios {
  private _token?: string;
  private _login?: string;
  private _password?: string;
  private _user_id?: number;
  private _secret?: string;


  private async sendRequest(method:"execute.getUserInfo" | "auth.refreshToken" | "audio.get", params?:RequestParams) {
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
    return await response.json();
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

    await this.sendRequest("execute.getUserInfo", {func_v: 9});
    let refresh = await this.sendRequest("auth.refreshToken", {lang: "ru"});
    let text = JSON.stringify(refresh);
    console.log(text);
    return true;
  }


  /**
   * @description Получение всех треков пользователя с указанным user_id
   * @param {number} user_id Идентификатор пользователя, треки которого нужно получить
   */
  public async getTracks(user_id:number = this._user_id ? this._user_id : 0) {
    if (!this._user_id) {
      throw new Error("No autorisation");
    }
    let resp = await fetch(`https://api.vk.com/method/audio.get?v=5.95&access_token=${this._token}&device_id=${this.deviceId}&owner_id=${user_id}}&sig=${MD5("method/audio.get?v=5.95&access_token=${token}&device_id=${this._deviceId}&owner_id=${user_id}}" + this._secret)}` + "", {
      headers: {
        "User-Agent": "VKAndroidApp/4.13.1-1206 (Android 4.4.3; SDK 19; armeabi; ; ru)",
        "Accept": "image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, */*"
      }
    });
    let text = await resp.text();
    console.log(text);
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