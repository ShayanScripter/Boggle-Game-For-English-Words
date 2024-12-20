import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import baseURL from './API';


export default function ProfileScreen({ navigation, route }) {
  const { playerData } = route.params; // Access playerData from route
  console.log("Player data in Profile screen: " + JSON.stringify(playerData, null, 2));

  const [name, setName] = useState(playerData.player_name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(
    `${baseURL}/Content/Uploads/Images/${playerData.player_image}`
  );

  const [imageFile, setImageFile] = useState(''); // Store selected image

  // Function to handle selecting an image
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: () => launchCamera(options, handleImageSelection) },
      { text: 'Gallery', onPress: () => launchImageLibrary(options, handleImageSelection) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Handle image selection from camera or gallery
  const handleImageSelection = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      console.log('Selected image:', selectedImage);

      setProfileImageUri(selectedImage.uri);
      setImageFile({
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/png', // Defaulting to prevent errors
        name: selectedImage.fileName || 'profile.png', // Default filename fallback
      });
    } else {
      console.error('Unexpected response structure:', response);
    }
  };

  const handleSave = async () => {
    console.log('Save button clicked');

    // Input validation
    if (!name || !oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    const formData = new FormData();

    // Append player data
    formData.append('player', JSON.stringify({
      player_uid: playerData.player_uid,
      player_name: name,
      password: newPassword,
      photo: imageFile
    }));
    console.log(formData);
    // Append selected image if available
      

    try {
      console.log('Sending API request...');
      const response = await fetch(`${baseURL}/API/player/EditPlayer`, {
        method: 'PUT',
        body: formData,
      });

      const statusCode = response.status;
      const result = await response.json();

      console.log(`API response status: ${statusCode}`);
      console.log('API response body:', result);

      if (response.ok) {
        Alert.alert('Success', 'Player updated successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message || `Failed to update player. Status Code: ${statusCode}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <LinearGradient colors={['#99BBFF', '#A6CCFF', '#C0F0FF']} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.playerContainer}>
          <TouchableOpacity style={styles.playerImage} onPress={selectImage}>
            <Image
              source={profileImageUri ? { uri: profileImageUri } : { uri: 'https://via.placeholder.com/120' }}
              style={styles.profileImage}
            />
            <View style={styles.addImageIconContainer}>
              <MaterialIcons name="photo-camera" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <Text style={styles.playerName}>{playerData.player_name}</Text>
        </View>

        <TextInput
          placeholder='Name'
          value={name}
          onChangeText={setName}
          style={styles.textInput}
        />

        <TextInput
          placeholder='Old Password'
          value={oldPassword}
          onChangeText={setOldPassword}
          style={styles.textInput}
          secureTextEntry
        />

        <TextInput
          placeholder='New Password'
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.textInput}
          secureTextEntry
        />

        <TextInput
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.textInput}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.save}
          onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
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
  playerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 2,
    marginBottom: 20,
  },
  playerImage: {
    backgroundColor: '#A6CCFF',
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  addImageIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 7,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,
  },
  playerName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000'
  },
  textInput: {
    height: 50,
    width: '80%',
    backgroundColor: '#DDD',
    borderRadius: 30,
    margin: 15,
    padding: 15,
  },
  save: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    height: 50,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjusted for better spacing
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for better visibility
    borderRadius: 20,
    padding: 10, // Add padding for better touch area
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5, // Elevation for Android
  },
});
