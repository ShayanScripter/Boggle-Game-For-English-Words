import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import baseURL from './API';

export default function LoginScreen({ navigation }) {
    // States
    const [uid, setUid] = useState("");
    const [password, setPassword] = useState("");

    // method to handleLogin
    const handleLogin = async () => {
        try {
            if (!uid || !password) { 
                Alert.alert("Please enter User ID and Password");
                return;  
            }
            const response = await fetch(`${baseURL}/api/account/login?uid=${uid}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                console.warn("Player not found.");
                return;
            }
            if (response.status === 200) {
                const playerData = await response.json();
                console.log("Login successful:", playerData);
                navigation.navigate('Home', { playerData });
            }
            else {
                const errorMessage = await response.text();
                console.warn(errorMessage);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <LinearGradient colors={['#99BBFF', '#A6CCFF', '#C0F0FF']} style={styles.container}>
            <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#C0F0FF', '#72AEFE', '#99BBFF']} style={styles.innerContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Login</Text>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="person" size={24} color="#6b6b6b" style={styles.icon} />
                        <TextInput
                            placeholder="User ID"
                            value={uid}
                            onChangeText={setUid}
                            placeholderTextColor="#aaa"
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} color="#6b6b6b" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            style={styles.textInput}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <Text style={styles.loginText}>
                        Don't have an account?
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.loginLink}> Signup</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
                </LinearGradient>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        height: 500,
        width: '90%',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#e6f0ff',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    button: {
        height:50,
        width: '100%',
        backgroundColor: '#90E8FE',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 14,
        color: '#666',
        marginTop: 25,
        alignSelf: 'center',
    },
    loginLink: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
