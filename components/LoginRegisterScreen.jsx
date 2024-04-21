import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLogin = async () => {
    // Retrieve stored user details from AsyncStorage
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const { email: storedEmail, password: storedPassword, fullName: storedFullName } = JSON.parse(storedUser);
        if (email === storedEmail && password === storedPassword) {
          console.log('Login successful!');
          // Assuming successful login, navigate to the Welcome screen with fullName parameter
          navigation.navigate('Welcome', { fullName: storedFullName });
          // Clear input fields
          setEmail('');
          setPassword('');
          return;
        }
      }
      console.log('Invalid credentials!');
      setShowInvalidMessage(true);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const handleRegister = async () => {
    // Handle register logic
    console.log('Register with:', email, password, fullName);
  
    // Store user details in AsyncStorage
    try {
      await AsyncStorage.setItem('user', JSON.stringify({ email, password, fullName }));
      console.log('User registered successfully!');
      setShowSuccessMessage(true);
      // Clear input fields
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  
    // Assuming successful registration, navigate to the Welcome screen with fullName parameter
    navigation.navigate('Welcome', { fullName });
  };
  

  const clearMessages = () => {
    setShowInvalidMessage(false);
    setShowSuccessMessage(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={clearMessages} // Clear messages when input is focused
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={clearMessages} // Clear messages when input is focused
        />
        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        )}
        {showInvalidMessage && <Text style={styles.errorMessage}>Invalid Credentials</Text>}
        {showSuccessMessage && <Text style={styles.successMessage}>Registered Successfully</Text>}
        <Button title={isRegistering ? "Register" : "Login"} onPress={isRegistering ? handleRegister : handleLogin} />
        <TouchableOpacity onPress={() => {
          setIsRegistering(!isRegistering);
          clearMessages(); // Clear messages when switching between login and register
        }}>
          <Text style={styles.switchButton}>{isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '80%',
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  switchButton: {
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  successMessage: {
    color: 'green',
    marginBottom: 10,
  },
});

export default LoginRegisterScreen;
