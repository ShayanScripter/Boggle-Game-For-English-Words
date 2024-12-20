import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import baseURL from './API';

export default function SignupScreen({ navigation }) {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    const handleSignup = async () => {
        if (!userId || !name || !password || !repassword) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        if (password !== repassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            const playerData = {
                player_uid: userId,
                player_name: name,
                password: password,
            };

            // Load the default image from the assets folder
            const defaultImageUri = Image.resolveAssetSource(require('../assets/default.png')).uri;

            const formData = new FormData();
            formData.append('player', JSON.stringify(playerData));

            // Append the default image
            const photo = {
                uri: defaultImageUri,
                type: 'image/png',
                name: 'default.png',
            };
            formData.append('photo', photo);

            const response = await fetch(`${baseURL}/api/account/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.status === 201) {
                Alert.alert("Success", "Account created successfully!");
                navigation.navigate('Login');
            } else if (response.status === 302) {
                const message = await response.text();
                Alert.alert("Error 302", message);
            } else {
                const message = await response.text();
                Alert.alert("Error elseeee", message);
                console.log("Error elseeeee", message);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            Alert.alert("Error", "An error occurred while signing up.");
        }
    };

    return (
        <LinearGradient colors={['#99BBFF', '#A6CCFF', '#C0F0FF']} style={styles.gradientContainer}>
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={['#C0F0FF','#A6CCFF', '#99BBFF']} style={styles.innerContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Sign Up</Text>

                        <TextInput
                            placeholder="User ID"
                            value={userId}
                            onChangeText={setUserId}
                            style={styles.textInput}
                        />

                        <TextInput
                            placeholder="User Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.textInput}
                        />

                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.textInput}
                        />

                        <TextInput
                            placeholder="Re-enter Password"
                            value={repassword}
                            onChangeText={setRepassword}
                            secureTextEntry
                            style={styles.textInput}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <Text style={styles.loginText}>
                            Already have an account?
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>    Login</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '90%',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    textInput: {
        width: '130%',
        backgroundColor: '#EEE',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    button: {
        width: '80%',
        backgroundColor: '#90E8FE',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    loginText: {
        width:'120%',
        fontSize: 16,
        color: '#000',
        marginTop: 25,
        alignSelf: 'center',
    },
    loginLink: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
