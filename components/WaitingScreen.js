import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function WaitingScreen({ route, navigation }) {
   // const { playerData, selectedPlayer,game,selectedTime, gameId ,isCreator} = route.params;

   const { playerData, isCreator, no_of_player, time, status, type, gameId } = route.params;
   

    // Wait for 10 seconds before navigating to the GameScreen
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Game', { playerData, no_of_player, time,status,type,isCreator, gameId });
        }, 10000); // 10 seconds

        // Cleanup the timer when component unmounts
        return () => clearTimeout(timer);
    }, [navigation, playerData, no_of_player, time, isCreator, gameId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Waiting for the Game to Start...</Text>

            {/* Display the received data */}
            <Text style={styles.info}>Game ID: {gameId}</Text>
            <Text style={styles.info}>Player Name: {playerData.player_name}</Text>
            <Text style={styles.info}>Number of Players: {no_of_player}</Text>
            <Text style={styles.info}>Time: {time}</Text>
            <Text style={styles.info}>Is Creator: {isCreator ? 'Yes' : 'No'}</Text>
            <Text style={styles.info}>Type: {type}</Text>

            {/* Loading Indicator */}
            <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginVertical: 5,
    },
    loader: {
        marginTop: 20,
    },
});
