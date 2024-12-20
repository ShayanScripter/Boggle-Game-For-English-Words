/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import GameScreen from './Screens/GameScreen';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import BoardScreen from './Screens/Board';
import SpectatorScreen from './Screens/SpectatorScreen';
import GameEnd from './Screens/GameEnd';

AppRegistry.registerComponent(appName, () => App);
