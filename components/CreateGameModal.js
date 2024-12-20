import React, { useState } from 'react';
import { SafeAreaView, View, Text, Modal, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import baseURL from '../Screens/API';


export default function CreateGameModal({ showCreateGame, setShowCreateGame, navigation, playerData }) {
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    var isCreator = false; // Add this if needed to differentiate between creator and joiner

    const handlePlayerSelection = (players) => {
        setSelectedPlayer(players);
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
    };

    const handleCreateGame = async () => {
        if (!selectedPlayer || !selectedTime) {
            Alert.alert("Please select the number of players and time.");
            return;
        }

        setLoading(true);

        const gameTime = selectedTime === '60s' ? 60 : selectedTime === '75s' ? 75 : null;

        const game = {
            no_of_player: parseInt(selectedPlayer),
            time: gameTime,
            status: 1,
            type: "pub",
            
        };

        try {
            const response = await fetch(`${baseURL}/API/Game/CreateGame?pid=${playerData.player_uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });

            const result = await response.json();
           
            if (response.ok) {
                Alert.alert('Game Created Successfully!', `Game ID: ${result}`);
                setShowCreateGame(false);
                isCreator = true;
                //navigation.navigate('Waiting', { playerData,...game,selectedPlayer,selectedTime, gameId: result });
                navigation.navigate('Waiting', { playerData, isCreator,...game, gameId: result });
            } else {
                Alert.alert('Error', result.message || 'Something went wrong');
            }
        } catch (error) {
            console.error("Error creating game:", error);
            Alert.alert('Error', 'Failed to create the game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView>
            <Modal
                transparent={true}
                visible={showCreateGame}
                animationType="slide"
                onRequestClose={() => setShowCreateGame(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerModalContainer}>
                        <Text style={styles.modalTitle}>Create Game</Text>

                        {/* Number of Players */}
                        <View style={styles.optionContainer}>
                            <Text style={styles.optionTitle}>Number of Players</Text>
                            <View style={styles.optionButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, selectedPlayer === '2' && styles.selectedButton]}
                                    onPress={() => handlePlayerSelection('2')}
                                >
                                    <Text style={styles.buttonText}>2P</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, selectedPlayer === '3' && styles.selectedButton]}
                                    onPress={() => handlePlayerSelection('3')}
                                >
                                    <Text style={styles.buttonText}>3P</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, selectedPlayer === '4' && styles.selectedButton]}
                                    onPress={() => handlePlayerSelection('4')}
                                >
                                    <Text style={styles.buttonText}>4P</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Time Selection */}
                        <View style={styles.optionContainer}>
                            <Text style={styles.optionTitle}>Time</Text>
                            <View style={styles.optionButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, selectedTime === '60s' && styles.selectedButton]}
                                    onPress={() => handleTimeSelection('60s')}
                                >
                                    <Text style={styles.buttonText}>60s</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, selectedTime === '75s' && styles.selectedButton]}
                                    onPress={() => handleTimeSelection('75s')}
                                >
                                    <Text style={styles.buttonText}>75s</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Create Button */}
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateGame} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.createButtonText}>Create</Text>
                            )}
                        </TouchableOpacity>
                        
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCreateGame(false)}>
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
    optionContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    optionButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#D3D3D3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 20,
    },
    selectedButton: {
        backgroundColor: '#00FFFF',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    createButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#FF4500',
        borderRadius: 20,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
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
});
