import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import baseURL from './API';

export default function ScoreScreen({ navigation, route }) {
    const { playerData } = route.params; // Access playerData from route params

    // console.log("Player data in score screen: ", playerData);

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profilePictureContainer}>
                    <Image
                        source={{
                            uri: `${baseURL}/Content/Uploads/Images/${playerData.player_image}`,
                        }}
                        style={styles.profilePicture}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.playerName}>{playerData.player_name}</Text>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('Profile', { playerData })} // Pass playerData to Profile screen
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.label}>Score:</Text>
                <Text style={styles.value}>{playerData.score}</Text>

                <Text style={styles.label}>Games Played:</Text>
                <Text style={styles.value}>{playerData.game_played}</Text>

                <Text style={styles.label}>Games Won:</Text>
                <Text style={styles.value}>{playerData.game_won}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    profilePictureContainer: {
        backgroundColor: '#ddd',
        height: 120,
        width: 120,
        borderRadius: 60,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    profilePicture: {
        height: '100%',
        width: '100%',
    },
    playerName: {
        marginTop: 15,
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
    },
    editButton: {
        marginTop: 10,
        backgroundColor: '#007BFF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    editButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreContainer: {
        marginTop: 40,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 24,
        fontWeight: '500',
        color: '#555',
        marginBottom: 5,
    },
    value: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 15,
    },
});
