import { useContext, useState } from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { AuthContext } from '../context/AuthContext'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { HelperText, Button, TextInput } from 'react-native-paper'
import { MaskedTextInput } from "react-native-mask-text"

const Register = ({ navigation }) => {
    const [passwordVisible, setPasswordVisible] = useState(true)

    const { isLoading, register } = useContext(AuthContext)

    const today = new Date().toLocaleString('es-VE')

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            fullname: '',
            birthdate: '',
            username: '',
            password: '',
            re_password: ''
        },
        resolver: yupResolver(formSchema)
    })

    const onSubmit = data => register(data, today)

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
                {errors.email && <HelperText type="error">{errors.email.message}</HelperText>}
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Nombre Completo"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                            error={!!errors.fullname}
                            autoCapitalize='none'
                        />
                    )}
                    name="fullname"
                />
                {errors.fullname && <HelperText type="error">{errors.fullname.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Fecha de nacimiento"
                            onBlur={onBlur}
                            value={value}
                            style={styles.input}
                            error={!!errors.birthdate}
                            autoCapitalize='none'
                            render={props =>
                                <MaskedTextInput
                                    {...props}
                                    mask="99/99/9999"
                                    keyboardType="numeric"
                                    onChangeText={onChange}
                                />
                            }
                        />
                    )}
                    name="birthdate"
                />
                {errors.birthdate && <HelperText type="error">{errors.birthdate.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Nombre de usuario"
                            onBlur={onBlur}
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.username}
                            autoCapitalize='none'
                        />
                    )}
                    name="username"
                />
                {errors.username && <HelperText type="error">{errors.username.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Contraseña"
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
                {errors.password && <HelperText type="error">{errors.password.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode={'outlined'}
                            label="Repita su contraseña"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            style={styles.input}
                            value={value}
                            error={!!errors.re_password}
                            autoCapitalize='none'
                            secureTextEntry={passwordVisible}
                            right={<TextInput.Icon icon={passwordVisible ? "eye" : "eye-off"} onPress={() => setPasswordVisible(!passwordVisible)} />}
                        />
                    )}
                    name="re_password"
                />
                {errors.re_password && <HelperText type="error">{errors.re_password.message}</HelperText>}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                >
                    Regístrate
                </Button>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text>¿Ya tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Inicia Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const formSchema = yup.object().shape({
    email: yup.string().email('Correo no válido').required('El correo es requerido'),
    fullname: yup.string().required('El campo es requerido'),
    birthdate: yup.string().required('El campo es requerido'),
    username: yup.string().required('El campo es requerido'),
    password: yup.string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial (! @ # $ % ^ & *)"
    ).required('La contraseña es requerida'),
    re_password: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Por favor escriba de nuevo la contraseña')
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
    input: {
        marginTop: 10,
    },
    link: {
        color: 'blue',
    },
    button: {
        marginTop: 20,
    },
})

export default Register