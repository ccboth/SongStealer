import VkAudios from "../components/vkapi";
import { Audio } from "expo-av";


export type StackParams = {
	MyAudios: { 
		ApiObject: VkAudios; 
		PlayTrack: Audio.Sound
	};
};
