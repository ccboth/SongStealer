import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Button, Alert, FlatList, Image, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
// import VkAudios from '../components/vkapi';
import { Track } from '../components/static';
import AppLoading from 'expo-app-loading';
import { NavigationInjectedProps } from "react-navigation";
// import { useTheme, RouteProp, useRoute, CompositeNavigationProp } from "@react-navigation/native";
import { SimpleLineIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import {StackParams} from './StackParams';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import SoundPlayer from "react-native-sound-player"


type Props = NativeStackScreenProps<StackParams, "MyAudios">


const toMinutesSecond = (totalDuration: number) => {
	const seconds = totalDuration % 60;
	const minutes = (totalDuration - seconds) / 60;
	return `${minutes}:${seconds ? seconds : "00"}`;
}


function TrackRender({track, sound}: {track: Track, sound: Audio.Sound}) {
	return (
		<View style={style.track} >
			<TouchableOpacity style={style.trackInfo} onPress={async () => {
				if (!track.urlReadeble) {
					Alert.alert("Ошибка", "Сейчас невозможно воспроизвести эту аудиозапись");
					return;
				}
				
				await sound.loadAsync({uri: track.url});
				await sound.playAsync();
			}} >
				<Image 
					source={{uri:track.album ? track.album.thumb.photo_68: "https://i.pinimg.com/236x/11/fd/5c/11fd5ce70f45a794e02c1a8dc94d742d.jpg?nii=t"}}
					style={style.trackInfoImage}
				/>
				<View style={{width: "73%"}}>
					<Text style={style.trackInfoTitle} >{track.title}</Text>
					<Text style={style.trackInfoArtist}>{track.artist}</Text>
				</View>
				<Text style={style.trackInfoDur}>{toMinutesSecond(track.duration)}</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {Alert.alert("Ошибка", "Да поди ты нахуй! Я еще с треками не разобрался, а ему еще инфа какая то нужна!")}}>
				<SimpleLineIcons name="options-vertical" size={24} color="purple" style={style.trackOptions} />
			</TouchableOpacity>
		</View>
	)
}


export default function MyAudios({navigation, route}: Props): JSX.Element {
	const {ApiObject: api, PlayTrack: sound} = route.params;
	const [tracks, setTracks] = useState<Track[]>([]);
	
	
	if (!tracks.length) {
		return <AppLoading 
			startAsync={async () => {
				const getTracks = await api.getTracks();
				setTracks(getTracks);
			}}
			onFinish={() => {
				
			}}
			onError={(error: Error) => {Alert.alert("Ошибка", error.message)}}
		/>
	}
	else return (
		<View style={{flex:1}}>
			<Button title="Выключить" onPress={async () => {
				sound.unloadAsync();
			}} />
			<Text> </Text>
			<Button title="Снести токен" onPress={async () => {
				AsyncStorage.removeItem("token");
			}}
			/>
			<Text style={{color: "#fff"}}>Найдено аудио: {tracks.length}</Text>
			<View style={{flex:1}}>
				<FlatList
					initialNumToRender={tracks.length}
					style={{flex: 0}}
					data={tracks}
					
					renderItem={({item}) => (
						<TrackRender 
							track={item}
							sound={sound}
						/>
					)}
				/>
			</View>
		</View>
	)
}

const style = StyleSheet.create({
	track: {
		flexDirection: "row",
		backgroundColor: "#101",
		margin: 5,
		// flex:1
	},
	trackInfo: {
		// flex: 9,
		flexDirection: "row",
		width: "97%"
	},
	trackInfoImage: {
		width: 45, 
		height: 45,
		borderRadius: 5
	},
	trackInfoTitle: {
		color: "#fcf",
		margin: 3
	},
	trackInfoArtist: {
		color: "gray",
		margin: 3,
		marginVertical: 2,
	},
	trackInfoDur: {
		color: "#f0f",
		marginVertical: 12,
		marginLeft: 15
	},
	trackOptions: {
		marginVertical: 9,
	}
	
})