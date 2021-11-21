import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import VkAudios from '../components/vkapi';
import { Track } from '../components/static';
import AppLoading from 'expo-app-loading';
import { NavigationInjectedProps } from "react-navigation";

let token: string = "";
let audioApi: VkAudios;



export default function trackList({navigation}: NavigationInjectedProps): JSX.Element {
	const [tracks, setTracks] = useState<Track[]>([]);
	const [api, setApi] = useState(false);
	if (!api)
		return (
			<AppLoading 
				startAsync={async () => {
					const token = await AsyncStorage.getItem("token");
					const secret = await AsyncStorage.getItem("secret");
					const deviceId = await AsyncStorage.getItem("deviceId");
					audioApi = new VkAudios(deviceId as string, token as string);
					audioApi.secret = secret as string;
					console.log("token=" + token);
					console.log("secret=" + secret);
					
					audioApi.auth();
				}}
				onFinish={async () => {setApi(true);}}
				onError={async () => {console.error("Ошибка");}}
			/>
		)
	else
		return (
			<View>
				<Text>Все загружено, чекай в консоли</Text>
				<Button title={"Очистить все данные обо мне"} onPress ={async () => {
					await AsyncStorage.removeItem("token");
				}} />
			</View>
		)
}