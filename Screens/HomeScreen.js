import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import baseURL from './API';

import CreateGameModal from '../components/CreateGameModal';
import ActiveGamesModal from '../components/ActiveGamesModal';

export default function HomeScreen({ navigation, route }) {

    const [showCreateGame, setShowCreateGame] = useState(false);
    const [showActiveGames, setShowActiveGames] = useState(false);

    const { playerData } = route.params; // Get playerData from route.params

    return (
        <LinearGradient  colors={['#6694FF', '#72AEFE', '#90E8FE']} style={styles.gradientContainer}>
            <SafeAreaView style={styles.safeAreaContainer}>

                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        <Image
                            source={{
                                uri: `${baseURL}/Content/Uploads/Images/${playerData.player_image}`,
                            }}
                            style={styles.profilePicture}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('Score', { playerData })}
                        >
                            <Icon name="pencil" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.playerName}>{playerData.player_name}</Text>
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setShowCreateGame(true)}>
                        <Text style={styles.buttonText}>Create Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setShowActiveGames(true)}>
                        <Text style={styles.buttonText}>Join Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.logoutButton]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <CreateGameModal
                    showCreateGame={showCreateGame}
                    setShowCreateGame={setShowCreateGame}
                    navigation={navigation}
                    playerData={playerData}
                />

                <ActiveGamesModal
                    showActiveGames={showActiveGames}
                    setShowActiveGames={setShowActiveGames}
                    navigation={navigation}
                    playerData={playerData}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1, // Ensures the gradient covers the entire screen
    },
    safeAreaContainer: {
        flex: 1, // Makes sure content aligns within the SafeAreaView
        marginHorizontal: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePictureContainer: {
        backgroundColor: 'gray',
        height: 100,
        width: 100,
        borderRadius: 50,
        marginRight: 15,
        position: 'relative',
    },
    profilePicture: {
        height: '100%',
        width: '100%',
        borderRadius: 50,
    },
    editButton: {
        position: 'absolute',
        right: 8,
        bottom: 4,
        backgroundColor: '#000',
        borderRadius: 15,
        padding: 5,
    },
    playerName: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 200,
        paddingVertical: 20,
        backgroundColor: '#6694FF',
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 10,
    },
    logoutButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
