import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import baseURL from '../Screens/API';

export default function ActiveGamesModal({ showActiveGames, setShowActiveGames, navigation, playerData }) {

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    var isCreator = false; // Add this if needed to differentiate between creator and joiner

    // Redirect or alert if playerData is missing
    useEffect(() => {
        if (!playerData) {
            Alert.alert(
                "Player Data Missing",
                "You need to log in to join a game.",
                [{ text: "OK", onPress: () => setShowActiveGames(false) }]
            );
        }
    }, [playerData]);

    // Fetch active games from the API
    const fetchActiveGames = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Game/activegamesplayer`);
            const data = await response.json();

            if (response.ok) {
                setGames(data);
            } else {
                console.error('Failed to fetch games:', data);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch games when modal is visible
    useEffect(() => {
        if (showActiveGames && playerData) {
            fetchActiveGames();
        }
    }, [showActiveGames, playerData]);

    const handleJoinGame = async (gameId) => {
        console.log("Attempting to join game:", gameId);
        try {
            const response = await fetch(
                `${baseURL}/API/Game/JoinGame?gid=${gameId}&pid=${playerData.player_uid}`,
                {
                    method: 'POST',
                }
            );

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", data);
                // Now, fetch the game details using the GetGameDetails API
                const gameDetailsResponse = await fetch(`${baseURL}/API/Game/GetGameDetails?gid=${gameId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (gameDetailsResponse.ok) {
                    const gameDetails = await gameDetailsResponse.json();
                    console.log("Game details fetched successfully:", gameDetails);

                    // Create the gameState object from the response
                    const game = {
                        no_of_player: gameDetails.no_of_player,
                        time: gameDetails.time,
                        status: gameDetails.status,
                        type: gameDetails.type,
                    };

                    // Navigate to the waiting screen with the game details
                    isCreator = false; // Assuming you want to set isCreator as false
                    navigation.navigate("Waiting", { playerData, gameId, ...game, isCreator, });
                } else {
                    console.error("Failed to fetch game details.");
                    Alert.alert("Error", "Error fetching game details.");
                }
            } else if (response.status === 404) {
                console.log("Game not found.");
                Alert.alert("Error", "Game not found.");
            } else {
                const error = await response.text();
                console.error("Error joining game:", error);
                Alert.alert("Error", error);
            }
        } catch (error) {
            console.error("Error joining game:", error);
            Alert.alert("Error", "Failed to join the game.");
        } finally {
            setLoading(false); // End loading state
        }
    };

    // ===================================== Spectatr ===================================================
    const handleSpectate = async (gameId) => {
        console.log("Attempting to spectate game:", gameId);
        try {
            const response = await fetch(`${baseURL}/API/Game/SpectatorGame?gid=${gameId}&pid=${playerData.player_uid}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();
            console.log("speeeeeeeeeeee",data);
            if (response.ok) {
                Alert.alert("Success", `Spectating as Guest ID: ${data}`);
                // Navigate to the spectating screen if needed
                console.log("Spectator Screen data ...",{ gameId, guestId: data });
                navigation.navigate("Spectator", { gameId, guestId: data });
            } else {
                console.error("Failed to spectate game:", data);
                Alert.alert("Error", data);
            }
        } catch (error) {
            console.error("Error spectating game:", error);
            Alert.alert("Error", "Failed to spectate the game.");
        }
    };

    const renderGameRoom = ({ item }) => (
        <View style={styles.roomContainer}>
            <View style={styles.roomHeader}>
                <Text style={styles.roomTitle}>Room {item.GameId}</Text>
                <Text style={styles.roomCapacity}>
                    {item.PlayerCount} / {item.noofplayers}
                </Text>
            </View>
            <View style={styles.roomButtonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.spectateButton]}
                    onPress={() => handleSpectate(item.GameId)}
                >
                    <Text style={styles.buttonText}>Spectate</Text>
                </TouchableOpacity>

                {item.PlayerCount < item.noofplayers && (
                    <TouchableOpacity
                        style={[styles.button, styles.joinButton]}
                        onPress={() => handleJoinGame(item.GameId)}
                    >
                        <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView>
            <Modal
                transparent={true}
                visible={showActiveGames}
                animationType="slide"
                onRequestClose={() => setShowActiveGames(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerModalContainer}>
                        <Text style={styles.modalTitle}>Active Games</Text>

                        {loading ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <FlatList
                                data={games}
                                keyExtractor={(item) => item.GameId.toString()}
                                renderItem={renderGameRoom}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>
                                        No active games available.
                                    </Text>
                                }
                            />
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowActiveGames(false)}
                    >
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerModalContainer: {
        width: '85%',
        backgroundColor: '#2E3B4E',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    roomContainer: {
        width: '100%',
        backgroundColor: '#D3D3D3',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    roomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    roomTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    roomCapacity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    roomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    spectateButton: {
        backgroundColor: '#1E90FF',
    },
    joinButton: {
        backgroundColor: '#FF4500',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#000',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
});
