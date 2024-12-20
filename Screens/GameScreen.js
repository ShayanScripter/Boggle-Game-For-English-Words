import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import baseURL from './API';

import PlayerProfile from "./PlayerProfile";

export default function GameScreen({ route, navigation }) {

    const [boardId, setBoardId] = useState("");
    const [board, setBoard] = useState(Array(16).fill(''));
    const [selectedLetters, setSelectedLetters] = useState([]);
//    const [score, setScore] = useState(playerData.score);
    const [word, setWord] = useState("");
    const [showWord, setShowword] = useState("");

    const [players, setPlayers] = useState([]); // State for players list    
    const [playerTime, setPlayerTime] = useState(); // State for player's time  
    const [activePlayerId, setActivePlayerId] = useState(null);

    const { playerData = {}, no_of_player, time, status, type, isCreator, gameId } = route.params;
    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================

    useEffect(() => {
        fetchPlayers(); // Fetch players when the component loads        
    }, [gameId]
    );
    useEffect(() => {
        const interval = setInterval(() => {
            fetchBoardDetails(); // Fetch updated board details
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    useEffect(() => {
        getBoardID();
        GetTime();
        SetTime();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            checkPlayersTurn();
        }, 3000000000000); // Poll every 3 seconds

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================

    // ============================= Fetch Players for Game ==============================================
    const fetchPlayers = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Game/gameplayers?gid=${gameId}`);
            const result = await response.json();

            if (response.ok) {
                console.log('Players Fetch Successfully :', result.lsit); // Use `lsit` here
                let tempPlayer = result?.lsit?.map((item) => ({
                    ...item,
                    time: result?.time,
                }));
                console.log("tempPlayer", tempPlayer);
                setPlayers([...tempPlayer]); // Assuming 'lsit' contains the player list
                if (result?.lsit?.length > 0) {
                    setActivePlayerId(result?.lsit[0]?.player_uid || null); // Set the active player ID from players
                }
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.log("Falied to Fetch players");
        }
    };
    //------------------------------------------- Get time  -----------------------------------------------
    const GetTime = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Moves/gettime?gid=${gameId}&pid=${playerData.player_uid}`);
            const time = await response.json();

            if (response.ok) {
                console.log("Time", time) // Set the player's time
                return time;
            } else {
                Alert.alert('Error', result.Message || 'Failed to fetch player time.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch player time');
        }
    };
    const getSelfTime = (playerarr, targetPlayerUid) => {
        var player = playerarr.find((p) => p.player_uid === targetPlayerUid);
        if (!players || players.length === 0) {
        }
        console.log("----");
        console.log(player);
        return player || null;
    };
    //------------------------------------------- Set time  -----------------------------------------------
    const SetTime = async () => {
        try {
            var tempPlayer = getSelfTime(players, playerData.player_uid);
            var remainingTime = tempPlayer.time;

            const response = await fetch(`${baseURL}/API/Moves/settime?time=${remainingTime}&gid=${gameId}&pid=${playerData.player_uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Success', 'Player time updated successfully!');
            } else {
                const result = await response.json();
                Alert.alert('Error', result.Message || 'Failed to update player time.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while setting player time.');
        }
    };
    // =======================================================================================
    const updatePlayersTurn = async () => {
        try {
            const response = await fetch(`${baseURL}api/Game/SetTurnPlayer?gid=${gameId}&currentTurn=${playerData.player_uid}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                console.log("Turn updated successfully");
                setSelectedLetters([]);
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.error("error Update turn:", error);
            return false;
        }
    };

    const checkPlayersTurn = async (gameId) => {
        try {
            const response = await fetch(`${baseURL}api/Moves/getTurnplayer?gid=${gameId}`);
            const PlayerId = await response.json(); // Get the player ID directly as text

            if (response.ok) {
                if (PlayerId !== activePlayerId) {
                    setActivePlayerId(PlayerId);
                }
            } else if (response.status === 404) {
                console.error("No turn entry found for the specified game.");
            } else {
                console.error(Error, `${response.statusText}`);
            }
        } catch (error) {
            console.error("Error Fetching player turn error:", error);
        }
    };

    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================

    //============================================== Update Game ==========================================

    const updateGame = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Game/updategame?gid=${gameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Game updated successfully!');
                // Optionally, you can trigger re-fetch of player data or handle the UI accordingly
            } else {
                Alert.alert('Error', result.Message || 'Failed to update game.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while updating the game.');
        }
    };
    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================


    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================

    // =================================== Create Board API Call ======================================== //
    const fetchBoardDetails = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Board/GetBoardDetailsForGame?gameId=${gameId}`);
            const result = await response.json();

            if (response.ok) {
                const letters = result.board_Details.map(item => item.current_letter || '');
                setBoard(letters);

            } else {
                Alert.alert('Error', result.Message || 'Failed to fetch board details.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch board details');
        }
    };
    // ================================ Shuffle Board API Call ========================================== /
    const handleShuffle = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Board/shuffle?pid=${playerData.player_uid}&gid=${gameId}`,
                {
                    method: 'POST',
                });
            const result = await response.json();
            if (response.ok) {
                // Alert.alert('Success', result);
                fetchBoardDetails(); // Refresh the board after shuffling
            } else {
                Alert.alert('Error', result);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to shuffle the board');
        }
    };
    // --------------------------------------------------------------------------------------------------
    const selectLetter = (letter, index) => {
        setSelectedLetters(prev => {
            if (prev.some(item => item.index === index)) {
                return prev.filter(item => item.index !== index);
            } else {
                return [...prev, { letter, index }];
            }
        });
    };
    // ================================ Validate word submit API Call ========================================== /
    const validateWord = async (word) => {
        try {
            const response = await fetch(`${baseURL}/API/Moves/validateWord?word=${word}`);
            if (response.ok) {
                const isValid = await response.json();
                console.log('Word "${word}" is valid:, isValid');
                return isValid; // true or false
            } else {
                console.log("Error validating word:", response.statusText);
                return false;
            }
        } catch (error) {
            console.error("Error validating word:", error);
            return false;
        }
    };
    // ================================ Already word check API Call ========================================== /
    const alreadyWord = async (word, gameId) => {
        try {
            const response = await fetch(`${baseURL}/API/Moves/alreadyWord?word=${word}&gameId=${gameId}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.log("Error checking word existence:", response.statusText);
                return true;
            }
        } catch (error) {
            console.error("Error checking word existence:", error);
            return true;
        }
    };
    //=================================== Get Board ID ====================================================== /
    const getBoardID = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Board/GetLatestBoardForGame?gameId=${gameId}`);
            const result = await response.json();
            if (response.ok) {
                setBoardId(result);
                console.log("get ID board ", result);
            } else {
                Alert.alert('Error', result.Message || 'Failed to fetch board details.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch board details');
        }
    };
    // ================================ Submit Word API Call ========================================== /
    const submitWord = async () => {
        const word = selectedLetters.map(item => item.letter).join('');

        if (word) {
            try {

                // Check if word is valid
                const isValidWord = await validateWord(word);
                if (!isValidWord) {
                    Alert.alert('Invalid Word', `"${word}" is not in the dictionary.`);
                    setSelectedLetters([]); // Clear selected letters
                    return;
                }

                // Check if word has already been used
                const isAlreadyUsed = await alreadyWord(word, gameId);
                if (isAlreadyUsed) {
                    Alert.alert('Word Already Used', `"${word}" has already been used in this game.`);
                    setSelectedLetters([]); // Clear selected letters
                    return;
                }

                // Make the API request
                const response = await fetch(`${baseURL}/API/Moves/createmoves`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Move: {
                            player_id: playerData.player_uid,
                            game_id: gameId,
                            board_id: boardId, // Ensure this is dynamic
                        },
                        Word: word,
                        IsValid: isValidWord, // Reflect actual word validity
                        MoveDetails: selectedLetters.map(item => ({
                            letter: item.letter,
                            pos_x: Math.floor(item.index / 4),
                            pos_y: item.index % 4,
                        }))
                    })
                });

                console.log('Response Status:', response.status);
                const result = await response.json();

                if (response.ok) {
                    Alert.alert('Success', `Word "${word}" submitted successfully!`);
                    setSelectedLetters([]); // Clear selected letters
                    fetchBoardDetails(); // Fetch the updated board details
                    SetTime();
                    await updatePlayersTurn(); // Update the turn after a successful move
                } else {
                    Alert.alert('Error', result.Message || 'Failed to submit word.');
                }
            } catch (error) {
                console.error('Error in submitWord:', error);
                Alert.alert('Error', 'Failed to submit word due to an error.');
            }
        } else {
            Alert.alert('Error', 'No letters selected to form a word.');
        }
    };
    // ================================ Get Moves Method   ========================================== /
    const GetMoves = async () => {
        try {
            const response =
                await fetch(`${baseURL}/api/Moves/GetMoves?pid=${playerData.player_uid}&gid=${gameId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

            if (response.ok) {
                const data = await response.json(); // Parse JSON response
                console.log("Moves fetched successfully:", data);
                return data; // Return data for further use
            } else {
                const errorData = await response.text(); // Optional: Read error details
                console.error("Error fetching moves:", errorData || response.statusText);
            }
        } catch (error) {
            console.error("An error occurred while fetching moves:", error);
        }
    };
    // ================================ Render each letter cell  ========================================== /
    const renderItem = ({ item, index }) => {
        const isSelected = selectedLetters.some(selected => selected.index === index);
        return (
            <TouchableOpacity
                style={[styles.cell, isSelected && styles.selectedCell]}
                onPress={() => selectLetter(item, index)}
            >
                <Text style={styles.letter}>{item}</Text>
            </TouchableOpacity>
        );
    };
    //=====================================================================================================
    //=====================================================================================================
    //=====================================================================================================

    // CurrentPlayerProfile Component to display the current player's information
    // const CurrentPlayerProfile = ({ name, time, image }) => (
    //     <View style={styles.currentPlayerContainer}>
    //         <Image source={{ uri: `${baseURL}/Content/Uploads/Images/${image}` }} style={styles.playerImage} />
    //         <Text style={styles.playerName}>{name}</Text>
    //         <Text style={styles.playerTime}>{time}</Text>
    //     </View>
    // );

    // =======================================================================================
    // =======================================================================================

    // =======================================================================================
    // =======================================================================================
    // =======================================================================================
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                {<MaterialIcons name="arrow-back" size={30} color="#000" style={styles.icon} />}
            </TouchableOpacity>
            <View style={styles.otherPlayerView}>
                {players.length > 0 ? (
                    players.map((player, index) => (

                        <PlayerProfile
                            key={index}
                            profilePictureURI={`${baseURL}/Content/Uploads/Images/${player.player_image}`}
                            userName={player.player_name}
                            timeInterval={player.time}
                            start={activePlayerId === player.player_uid} // Start only for the active player
                            playerId={player.player_uid}
                            activePlayerId={activePlayerId}
                            updatePlayersTurn={updatePlayersTurn} // Call the correct turn update function
                            setPlayers={setPlayers}
                            players={players}
                        />
                    ))
                ) : (
                    <Text>No players found.</Text>
                )}
            </View>


            <View style={styles.gridContainer}>
                <FlatList
                    data={board}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={4}
                    scrollEnabled={false}
                />
            </View>
            <TouchableOpacity style={styles.submit} onPress={submitWord} >
                <Text>submit</Text>
            </TouchableOpacity>

            <View>
                {/* Corrected component name and passing props */}
                {/* <CurrentPlayerProfile name={playerData.player_name}
                    time={selectedTime} // Use selected time or player's time
                    image={playerData.player_image} /> */}
            </View>

            <View style={styles.commentShuffle}>

                <View style={styles.comment}>
                    <ScrollView>
                        <Text>.............</Text>
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.shuffle} onPress={handleShuffle}>
                    <MaterialIcons name="shuffle" size={50} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#E3F2FD',
    },
    gridContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BBDEFB',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 15
    },
    cell: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        margin: 7,
        borderRadius: 10,
    },
    selectedCell: {
        backgroundColor: '#FFD54F',
    },
    letter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#37474F',
    },
    submit: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
    },
    submitText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    otherPlayerView: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow wrapping for multiple players
        justifyContent: 'space-around', // Distribute players evenly
        margin: 10,
    },
    currentPlayerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        margin: 5
    },
    commentShuffle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
    },
    comment: {
        height: 85,
        width: 240,
        backgroundColor: '#FFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 1, height: 1 },
        elevation: 3,
    },
    shuffle: {
        height: 70,
        width: 70,
        backgroundColor: '#FF5722',  // Bright orange-red for attention
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 6,
    },

});
