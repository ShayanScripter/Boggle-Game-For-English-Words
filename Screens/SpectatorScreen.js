import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import baseURL from './API';
import { useRoute } from '@react-navigation/native';
import PlayerProfile from './PlayerProfile';

export default function SpectatorScreen  ({route,navigation  }){
    // Extract gameId and guestId from route.params
    // const { gameId, guestId } = route.params;
    gameId=1;
    guestId=1;


    const [board, setBoard] = useState(Array(16).fill(''));
    const [selectedLetters, setSelectedLetters] = useState([]);

    const [activePlayerId, setActivePlayerId] = useState(null);
    const [players, setPlayers] = useState([]);

    const [spectatorCount, setSpectatorCount] = useState(0);

    const [comments, setComments] = useState([]); // State to store comments
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState(""); // State for new comment input

    useEffect(() => {
        if (gameId) {

            fetchPlayers();
            fetchComments();
            fetchBoardDetails();

            // Set up an interval to call fetchComments every 2 seconds
            const intervalId = setInterval(() => {
                fetchComments();
            }, 2000);

            return () => clearInterval(intervalId);
        }
    }, [gameId]);


    // ============================================= fetchBoardDetails ===========================================

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

    const selectLetter = (letter, index) => {
        setSelectedLetters(prev => {
            if (prev.some(item => item.index === index)) {
                return prev.filter(item => item.index !== index);
            } else {
                return [...prev, { letter, index }];
            }
        });
    };

    const postComment = async (comment) => {
        try {

            console.log("Comment to post:", comment);
            console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,", game_id, guestId, comment);

            const response = await fetch(`${baseURL}API/Game/addComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment1: comment,

                    guest_id: guestId,
                    // setguestId: guest_id,
                }), //assuming comment is just text
            });

            if (response.ok) {
                const result = response.status !== 204 ? await response.json() : null;
                if (result) {
                    console.log("Comment added successfully:", result);
                }
                setNewComment(""); // Clear the input
                fetchComments(); // Refresh comments to show the latest one
            } else if (response.status === 204) {
                console.error("Spectator  does not exist!"); // Handles HttpStatusCode.NoContent
            } else {
                console.error("Failed to post comment.");
            }
        } catch (error) {
            console.error("Error posting comment:", error); // Handles network or other errors
        }
    };

    const fetchComments = async () => {
        try {
            console.log("COMMENTS");
            const response = await fetch(
                `${baseURL}api/Game/GetCommentsWithPlayerInfoByGameId?gameId=${gameId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                if (response.status === 204) {
                    console.warn("No comments found for the given game.");
                    setComments([]); // Clear comments if no content
                    return;
                }
                console.log("+++++++");
                const data = await response.json();
                console.log("Fetched comments:", data);
                setComments(data); // Assuming `data` contains the list of comments with player info
            } else {
                console.error(`Failed to fetch comments. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };


    // ====================================       fetchSpectatorCount   =======================================
    // =========================================================================================================
    useEffect(() => {
        const fetchSpectatorCount = async () => {
            try {
                const response = await fetch(`${baseURL}/API/Game/SpectatorCount?gid=${gameId}`);
                const result = await response.json();
                if (response.ok) {
                    console.log("Spectator count response :", result);
                    if (result && typeof result.count === "number") {
                        setSpectatorCount(data.count);
                    }
                } else {
                    Alert.alert("Failed to fetch spectator count !");
                }
            }
            catch (error) { console.log(error); }
        }
    }, [gameId]);

    // =========================================================================================================
    // =========================================================================================================
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
            <TouchableOpacity>
                <Text>👁</Text>
            </TouchableOpacity>
            <View style={styles.gridContainer}>
                <FlatList
                    data={board}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={4}
                    scrollEnabled={false}
                />
            </View>
            <View style={styles.otherPlayerView}>
                {players.length > 0 ? (
                    players.map((player, index) => (
                        <PlayerProfile
                            key={index}
                            playerId={player?.player_uid}
                            profilePictureURI={`${baseURL}Content/Uploads/Images/${player?.player_image}`}
                            userName={player?.player_name}
                            timeInterval={player?.time}
                            activePlayerId={activePlayerId}
                            start={activePlayerId === player?.player_uid}
                            //updatePlayersTurn={updatePlayersTurn}
                        />
                    ))
                ) : (
                    <Text>No players found.</Text>
                )}

                {/* Chat Icon */}
      <TouchableOpacity
        style={styles.chatIconContainer}
        onPress={() => setShowComments(!showComments)}
      >
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>

      {/* Comment Section */}
      {showComments && (
        <View style={styles.commentSection}>
          {/* Comment List */}
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text>
                  <Text style={styles.commentAuthor}>{item.playerName}:</Text> {item.text}
                </Text>
              </View>
            )}
          />

          {/* Input for New Comment */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Type your comment..."
            />
            <Button title="Send" onPress={postComment} />
          </View>
        </View>
      )}
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
    otherPlayerView: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow wrapping for multiple players
        justifyContent: 'space-around', // Distribute players evenly
        margin: 10,
    },
    chatIconContainer: {
        alignSelf: "flex-end",
        marginBottom: 10,
      },
      chatIcon: {
        fontSize: 30,
      },
      commentSection: {
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      comment: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 5,
      },
      commentAuthor: {
        fontWeight: "bold",
      },
      commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
      },
      commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
      },
    
});
