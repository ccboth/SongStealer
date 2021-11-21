import AsyncStorage from "@react-native-async-storage/async-storage"


interface store {
	token: string;
}

class Storage {
	/**
	 * scheme: 
	 * storage: {
	 * 	token: string
	 * }
	 */
	public get storage() : Promise<string | null> {
		return AsyncStorage.getItem("storage");
	}
	
}

const storage = new Storage();
export default storage;