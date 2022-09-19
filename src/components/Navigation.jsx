import { useContext } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/ProfileScreen'
import LoginScreen from '../screens/Login'
import RegisterScreen from '../screens/Register'
import Details from '../screens/Details'
import { AuthContext } from '../context/AuthContext'
import SplashScreen from '../screens/SplashScreen'
import AddPost from '../screens/AddPost'

const Stack = createNativeStackNavigator()

const Navigation = () => {
    const { userInfo, splashLoading } = useContext(AuthContext)

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {splashLoading ? (
                    <Stack.Screen
                        name="Splash Screen"
                        component={SplashScreen}
                        options={{ headerShown: false }}
                    />
                ) : userInfo.email ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddPost" component={AddPost} options={{ headerShown: false }} />
                        <Stack.Screen name="Details" component={Details} options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation