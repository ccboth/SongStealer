import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import trackList from './trackList';


const Stack = createStackNavigator();

export default function Navigate() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="trackList"
					component={trackList} 
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}