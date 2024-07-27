import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Input } from 'react-native-elements';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: '415535833463-46d7f9997050m9bq7j91tjad4lau5s2k.apps.googleusercontent.com', 
});

const LoginScreen = ({ route }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (route.params?.email && route.params?.password) {
      console.log(route.params.email, route.params.password);
      setEmail(route.params.email);
      setPassword(route.params.password);
    }
  }, [route.params]);

  useEffect(() => {
    const fetchRememberMe = async () => {
      try {
        const value = await AsyncStorage.getItem('rememberMe');
        if (value !== null) {
          setRememberMe(value === 'true');
          if (value === 'true') {
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');
            if (storedEmail !== null && storedPassword !== null) {
              setEmail(storedEmail);
              setPassword(storedPassword);
            }
          }
        }
      } catch (error) {
        console.error('Lỗi khi đọc trạng thái nhớ tài khoản:', error);
      }
    };

    fetchRememberMe();
  }, []);

  useEffect(() => {
    const storeRememberMe = async () => {
      try {
        await AsyncStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
        if (rememberMe) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }
      } catch (error) {
        console.error('Lỗi khi lưu trạng thái nhớ tài khoản:', error);
      }
    };

    storeRememberMe();
  }, [rememberMe, email, password]);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('HometabScreen',email);
    } catch (error) {
      console.log(error);
      Alert.alert('Đã xảy ra lỗi', 'Vui lòng thử lại sau');
    }
  };

  const handleRememberMe = async (value) => {
    setRememberMe(value);
    try {
      await AsyncStorage.setItem('rememberMe', value ? 'true' : 'false');
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái nhớ tài khoản:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log(error);
      Alert.alert('Đã xảy ra lỗi', 'Vui lòng thử lại sau');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://hoalenhandmade.com/wp-content/uploads/2023/06/cropped-logo-hoa-len-co-nem-trang.png.webp' }}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FF714B', marginBottom: 20 }}>Đăng nhập</Text>
        </View>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Input
            onChangeText={setEmail}
            placeholder='Nhập email'
            style={styles.input}
            value={email}
          />
          <Input
            onChangeText={setPassword}
            placeholder='Nhập mật khẩu'
            style={styles.input}
            secureTextEntry={!passwordVisible}
            value={password}
            rightIcon={
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image source={passwordVisible ? require('../img/eyeOpen.png') : require('../img/eyeClose.png')} 
                  style={{ width: 24, height: 24,position: 'absolute', right: 10, top: 4 }} 
                />
              </TouchableOpacity>
            }
          />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 20 }}>
          <CheckBox
            value={rememberMe}
            onValueChange={handleRememberMe}
          />
          <Text style={{ marginTop: 5 }}>Nhớ tài khoản</Text>
          <Text style={{ marginTop: 5, marginLeft: 140 }} onPress={() => navigation.navigate('ForgotPassword')}>Quên mật khẩu?</Text>
        </View>
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleGoogleSignIn} style={styles.button}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../img/google.png')} style={{ width: 30, height: 30 }} />
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Đăng nhập bằng Google</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={styles.line} />
            <Text style={styles.text}>or</Text>
            <View style={styles.line} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Text>Bạn chưa có tài khoản?</Text>
          <Text style={{ color: '#FF714B', marginLeft: 5 }} onPress={() => navigation.navigate('RegisterScreen')}>Đăng ký</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10
  },
  button: {
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    backgroundColor: '#FF714B',
    width: 350
  },
  line: {
    flex: 1,
    height: 1,
    marginTop: 15,
    backgroundColor: 'gray',
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
