import React,{useState} from 'react';
import { View , Text , Image , TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import baseURL from '../Screens/API';
import { TabRouter } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { BaseRouter } from '@react-navigation/native';
import { StackRouter } from '@react-navigation/native';
import { NavigationRouteContext } from '@react-navigation/native';

export default function GameEnd({ navigation, route }){
    const { playerData } = route.params; // Get playerData from route.params
    return(
        <LinearGradient  colors={['#6694FF', '#72AEFE', '#90E8FE']} style={styles.gradientContainer}>
        <View>
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
                    <Text style={styles.playerName}>{playerData.player_name}</Text>
                </View>

                <Text style={styles.playerName}>{playerData.player_name}</Text>
                <Text style={styles.playerName}>{playerData.player_name}</Text>
                <Text style={styles.playerName}>{playerData.player_name}</Text>

        </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
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
    playerName: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
})