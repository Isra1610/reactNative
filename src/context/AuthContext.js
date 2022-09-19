import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import api from '../utils/api'

export const AuthContext = createContext();

export const AuthProvider = ({children, navigation}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  const checkEmail = (serverUsers,formData) => {
  const user = serverUsers?.find(item => item.email === formData.email)
    if (user) return user;
  };

  const checkEmailLogin = (serverUsers,formData) => {
  const user = serverUsers?.find(item => item.email === formData.email)
  const password = serverUsers?.find(item => item.password === formData.password)
    if (user && password) return user;
  };

  const register = async (data, today) => {
    setIsLoading(true);
    const user = await axios.get(`${api}/register`)
          .then((res) => checkEmail(res.data,{
            birthdate: data.birthdate,
            email: data.email,
            fullname: data.fullname,
            password: data.password,
            username: data.username,
            created_at: today
          }))
          .catch(e => {
          console.log(`register fail ${e}`);
          setIsLoading(false);
        });
        if (user) {
          setIsLoading(false)
          alert("¡El Email o Username ya existe!")
        }else{
         await axios.post(`${api}/register`, {
            birthdate: data.birthdate,
            email: data.email,
            fullname: data.fullname,
            password: data.password,
            username: data.username,
            created_at: today
          }).then((res) => {
          setIsLoading(false)
          navigation.navigate('Login')
      }).catch(e => {
        console.log(`login error ${e}`);
        setIsLoading(false);
      });
    }
  }

  const login = async (data) => {
    setIsLoading(true);
    const user = await axios.get(`${api}/register`)
          .then((res) => checkEmailLogin(res.data,data))
          .catch(e => {
          console.log(`register fail ${e}`);
          setIsLoading(false);
        })
        if(!user){
          setIsLoading(false)
          alert("¡El Email o la Contraseña son incorrectos o no existen!")
        } else {
          await axios
             .post(`${api}/login`, data)
             .then(res => {
               let userInfo = res.data;
               setUserInfo(userInfo);
               AsyncStorage.setItem('userInfo', JSON.stringify(user));
               setIsLoading(false);
             })
             .catch(e => {
               console.log(`login error ${e}`);
               setIsLoading(false);
             });
        }
  };

  const logout = async () => {
        setIsLoading(true);
        await AsyncStorage.removeItem('userInfo');
         await axios.post(`${api}/login`, {})
        setUserInfo({});
        setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
      }
      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};