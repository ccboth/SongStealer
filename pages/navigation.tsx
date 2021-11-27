import React, { useState } from 'react';
import VkAudios from '../components/vkapi';

import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import MyAudios from './trackList';
import { StackParams } from './StackParams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';


const Stack = createStackNavigator<StackParams>();
const MyTheme: Theme = {
	...DefaultTheme,
	colors: {
    ...DefaultTheme.colors,
    background: '#102',
		text: "#fff"
  },
	// dark: true
};

export default function Navigate(): JSX.Element {
	const [api, setApi] = useState<VkAudios>();
	const [playTrack, setPlayTrack] = useState(new Audio.Sound());

	if (!api)
		return (
			<AppLoading 
				startAsync={async () => {
					const token = await AsyncStorage.getItem("token");
					const secret = await AsyncStorage.getItem("secret");
					const deviceId = await AsyncStorage.getItem("deviceId");
					let audioApi = new VkAudios(deviceId as string, token as string);
					audioApi.secret = secret as string;
					await audioApi.auth();
					setApi(audioApi);
				}}
				onFinish={async () => {}}
				onError={async (err: Error) => {console.error(err.message);
				}}
			/>
		)
	else
	return (
		<NavigationContainer theme={MyTheme}>
			<Stack.Navigator>
				{/* Аудиозаписи пользователя */}
				<Stack.Screen
					options= {{
						title: "Мои аудиозаписи",
						headerStyle: {backgroundColor: "#203"},
						headerTitleStyle: {color: "#fff"}
					}}
					name="MyAudios"
					component={MyAudios}
					initialParams={{
						ApiObject: api,
						PlayTrack: playTrack
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}