import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PlayerProfile = ({ profilePictureURI,userName,timeInterval,start,playerId,
  activePlayerId,updatePlayersTurn,players,setPlayers}) => {
  const [time, setTime] = useState(timeInterval);

  useEffect(() => {
    let timer;
    if (start && playerId === activePlayerId) {
        timer = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    updatePlayersTurn();
                    return prevTime;
                }
                return prevTime - 1;
            });
        }, 1000);
    }

    // **Stop timer if it's no longer this player's turn**
    if (playerId !== activePlayerId) {
        setTime(timeInterval); // Reset time
        clearInterval(timer);
    }

    return () => clearInterval(timer); // Cleanup timer on unmount
}, [start, playerId, activePlayerId]);

  useEffect(() => {
    if (time !== timeInterval) {
      const updatedPlayers = players.map((player) =>
        player.player_uid === playerId ? { ...player, time } : player
      );
      setPlayers(updatedPlayers);
    }
  }, [time, timeInterval, playerId, players, setPlayers]);

  return (
    <View style={styles.playerContainer}>
      <Image source={{ uri: profilePictureURI }} style={styles.playerImage} />
      <Text style={styles. playerName}>{userName}</Text>
      <Text style={styles.playerTime}>{time}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
},
  playerImage: {
    backgroundColor: "#90CAF9",
    height: 70,
    width: 70,
    borderRadius: 50,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,
  },
  playerName: {
    color: '#1E88E5',  // Slightly brighter text for contrast
    fontSize: 18,
    fontWeight: 'bold',
},
playerTime: {
  color: '#D32F2F',  // Soft red for time indication
  fontSize: 16,
  fontWeight: 'bold',
},
});

export default PlayerProfile;
