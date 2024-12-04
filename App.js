import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log('Registered Username:', username);
    console.log('Registered Password:', password);
    setIsRegistered(true);
    setShowRegister(false);
  };

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsRegistered(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : showRegister ? (
        <Register
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onRegister={handleRegister}
        />
      ) : (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
          onShowRegister={() => setShowRegister(true)}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const Register = ({ username, setUsername, password, setPassword, onRegister }) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={onRegister} />
    </View>
  );
};

const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  onLogin,
  onShowRegister,
}) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={onLogin} />
      <TouchableOpacity onPress={onShowRegister} style={styles.signUpButton}>
        <Text style={styles.signUpText}>or Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const Dashboard = ({ onLogout }) => {
  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.welcomeText}>Selamat Datang</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  signUpButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  signUpText: {
    color: 'white',
    textAlign: 'center',
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});
















