import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginScreen from './Screens/LoginScreen'; 
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import GameScreen from './Screens/GameScreen';
import ActiveGamesModal from './components/ActiveGamesModal';
import CreateGameModal from './components/CreateGameModal';
import WaitingScreen from './components/WaitingScreen';
import ScoreScreen from './Screens/ScoreScreen';
import SpectatorScreen from './Screens/SpectatorScreen';
import GameEnd from './Screens/GameEnd';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Score" component={ScoreScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateGameModal" component={CreateGameModal} options={{ headerShown: false }} />
        <Stack.Screen name="ActiveGames" component={ActiveGamesModal} options={{ headerShown: false }} />
        <Stack.Screen name="Spectator" component={SpectatorScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Waiting" component={WaitingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GameEnd" component={GameEnd} options={{ headerShown: false }} />
  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
