import { useContext, useState } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { AuthContext } from '../context/AuthContext'
import { TextInput, Button, HelperText } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

const Login = ({ navigation }) => {

    const [passwordVisible, setPasswordVisible] = useState(true)

    const { isLoading, login } = useContext(AuthContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(formSchema)
    })

    const onSubmit = data => login(data)

    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <View style={styles.wrapper}>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.email}
                            autoCapitalize='none'
                        />
                    )}
                    name="email"
                />
                {errors.email && <HelperText type="error">El email es requerido</HelperText>}
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Contrase??a"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            style={styles.input}
                            value={value}
                            error={!!errors.password}
                            autoCapitalize='none'
                            secureTextEntry={passwordVisible}
                            right={<TextInput.Icon icon={passwordVisible ? "eye" : "eye-off"} onPress={() => setPasswordVisible(!passwordVisible)} />}
                        />
                    )}
                    name="password"
                />
                {errors.password && <HelperText type="error">La contrase??a es requerida</HelperText>}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                >
                    Iniciar Sesi??n
                </Button>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text>??No tienes una cuenta a??n? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Registrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const formSchema = yup.object().shape({
    password: yup.string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Debe contener al menos 8 caracteres, una may??scula, una min??scula, un n??mero y un caracter especial (! @ # $ % ^ & *)"
    ).required('La contrase??a es requerida'),
    email: yup.string().email('Correo no v??lido').required('El correo es requerido'),
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        width: '80%',
    },
    button: {
        marginTop: 20,
    },
    input: {
        marginTop: 10,
    },
    link: {
        color: 'blue',
    },
})

export default Login