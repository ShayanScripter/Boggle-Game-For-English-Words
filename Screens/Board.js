import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import baseURL from './API';

export default function BoardScreen() {
    const [board, setBoard] = useState(Array(16).fill(''));
    const [selectedLetters, setSelectedLetters] = useState([]);
    const pid = 'p1';
    const gid = 3;

    useEffect(() => {
        fetchBoardDetails();
    }, []);

    const fetchBoardDetails = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Board/GetBoardDetailsForGame?gameId=${gid}`);
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

    const handleShuffle = async () => {
        try {
            const response = await fetch(`${baseURL}/API/Board/shuffle?pid=${pid}&gid=${gid}`, {
                method: 'POST',
            });

            const result = await response.text();
            if (response.ok) {
                Alert.alert('Success', result);
                fetchBoardDetails();
            } else {
                Alert.alert('Error', result);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to shuffle the board');
        }
    };
// ------------------------------------------------------------------------------------------------------------
    const selectLetter = (letter, index) => {
        setSelectedLetters(prev => {
            if (prev.some(item => item.index === index)) {
                return prev.filter(item => item.index !== index);
            } else {
                return [...prev, { letter, index }];
            }
        });
    };

    // Validate word function
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

    // Check if word is already used in game
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

    // Submit word after validation
    const submitWord = async () => {
        const word = selectedLetters.map(item => item.letter).join('');

        if (word) {
            try {
                const isValidWord = await validateWord(word);
                if (!isValidWord) {
                    Alert.alert('Invalid Word', `"${word}" is not in the dictionary.`);
                    return;
                }

                const isAlreadyUsed = await alreadyWord(word, gid);
                if (isAlreadyUsed) {
                    Alert.alert('Word Already Used', `"${word}" has already been used in this game.`);
                    return;
                }

                const response = await fetch(`${baseURL}/API/Moves/createmoves`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Move: {
                            player_id: pid,
                            game_id: gid,
                            board_id: 30,
                        },
                        Word: word,
                        IsValid: true,
                        MoveDetails: selectedLetters.map(item => ({
                            letter: item.letter,
                            pos_x: Math.floor(item.index / 4),
                            pos_y: item.index % 4,
                        }))
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    Alert.alert('Success', `Word "${word}" submitted successfully!`);
                    setSelectedLetters([]);
                    fetchBoardDetails();
                } else {
                    Alert.alert('Error', result.Message || 'Failed to submit word.');
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to submit word');
            }
        } else {
            Alert.alert('Error', 'No letters selected to form a word.');
        }
    };

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.gridContainer}>
                <FlatList
                    data={board}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={4}
                    scrollEnabled={false}
                />
            </View>

            <TouchableOpacity style={styles.shuffle} onPress={handleShuffle}>
                <MaterialIcons name="shuffle" size={50} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.submit} onPress={submitWord}>
                <Text style={styles.submitText}>Submit Word</Text>
            </TouchableOpacity>
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
        margin: 10,
        borderRadius: 15,
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
    shuffle: {
        height: 70,
        width: 70,
        backgroundColor: '#FF5722',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 6,
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
});
