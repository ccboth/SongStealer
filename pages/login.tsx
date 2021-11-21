import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import VkAudios from '../components/vkapi';


interface args {
	setToken: any
}

function genDeviceId() : string {
	const mainString = "qwertyuiopasdfghjklzxcvbnm1234567890"
	let deviceId = "";
	while (deviceId.length < 16) {
		deviceId += mainString[Math.floor(Math.random() * mainString.length)]
	}
	return deviceId;
}


export default function Login({setToken}:args) {

	const refLogin = useRef<TextInput>(null);
	const refPassword = useRef<TextInput>(null);

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const [failInput, setFailInput] = useState(false)

	return (
		<View style={styles.html}>
			{/* Типа поле ввода логина */}
			<View style={{display: "flex", margin: "1%"}}>
				<Text style={failInput ? styles.errorText : styles.loginText}>Номер телефона</Text>
				<TextInput 
					style={failInput ? styles.errorInput : styles.loginField} 
					placeholder={"Введите номер телефона или em@il..."}
					placeholderTextColor={"#777"}
					onChangeText={input => {setLogin(input)}}
					ref={refLogin}
					onFocus={() => {setFailInput(false)}}
				/>
			</View>

			{/* Типа поле ввода пароля */}
			<View style={{display: "flex"}}>
				<Text style={failInput ? styles.errorText : styles.loginText}>Пароль</Text>
				<TextInput 
					style={failInput ? styles.errorInput : styles.loginField} 
					placeholder={"Введите пароль..."}
					placeholderTextColor={"#777"}
					onChangeText={input => {setPassword(input)}}
					ref={refPassword}
					onFocus={() => {setFailInput(false)}}
					secureTextEntry={true}
				/>
			</View>

			{/* Типа кнопка для авторизации */}
			<View style={{margin: 10}}></View>
				<Button title={"Войти"}
					onPress = {async () => {
					if (!login || !password) {
						setFailInput(true);
						return;
					}
					const deviceId = genDeviceId();
					const api = new VkAudios(deviceId, undefined, login, password);
					try {	
						let auth = await api.auth();
						if (!auth) {
							Alert.alert("Ошибка", "Повторите позже")
							refLogin.current?.clear();
							refPassword.current?.clear();
							setLogin("");
							setPassword("");
							// Alert.alert("Введенный логин", login);
						}
						else {
							AsyncStorage.setItem("token", api.token);
							AsyncStorage.setItem("secret", api.secret);
							AsyncStorage.setItem("deviceId", api.deviceId)
							setToken(api.token);
						}
					}
					catch (error) {
						Alert.alert("Ошибка", (error as Error).message);
					}
				}}
				/>
		</View>
	)
}


const styles = StyleSheet.create({
	html: {backgroundColor: "#102", justifyContent: "center", alignItems: "center", flex: 1},
	loginField: {color:"#fff", fontSize:16, backgroundColor: "#100", width: 300, borderWidth: 1, padding: 4},
	errorInput: {
		color:"#fff", 
		fontSize:16, 
		backgroundColor: "#100", 
		width: 300,
		borderWidth: 1,
		borderColor: "red",
		borderRadius: 4,
		padding: 6,
	},

	loginText: {color: "#fff", fontSize: 16},
	errorText: {color: "red", fontSize: 16}
})