import React, { createRef, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TextInput, Button, Alert, _Text } from 'react-native';
import AppLoading from 'expo-app-loading';
import Sound from 'react-native-sound';
// import storage from './components/storage';
import AsyncStorage from "@react-native-async-storage/async-storage"
import Login from './pages/login';
import Navigate from './pages/navigation';

enum statusAuth {
	authProcessed,
	authSuccess,
	needAuth
}


export default function App(): JSX.Element {
	// testReq();
	const [tokenLoad, setTokenLoad] = useState(false);

	const [token, setToken] = useState("");

	async function getToken() {
		let requestStorage = await AsyncStorage.getItem("token");
		if (requestStorage) {
			setToken(requestStorage);
		}
	}

	if (!tokenLoad) return (
		// Подгружаем токен
		<AppLoading 
			startAsync={getToken}
			onFinish={() => {setTokenLoad(true)}}
			onError={() => {}}
		/>
	)
	if (!token) {
		// Авторизация...
		return (
			<Login setToken={setToken} />
		)
	}
	else {
		return (
			<Navigate />
		)
	}
	
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#102',
		alignItems: 'center',

		justifyContent: 'center',
  },

	inputtext: {
		borderBottomWidth:1,
		height:50,
		width:100
	},

	text: {
		color: "#fff"
	}
});
