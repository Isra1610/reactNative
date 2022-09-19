import { StatusBar, } from 'expo-status-bar'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native'
import { Surface, TextInput, Button, Card, Divider } from 'react-native-paper'
import { useEffect, useState } from 'react'
import ModalView from '../components/ModalView'
import { Ionicons } from "@expo/vector-icons"
import PostCardItem from '../components/PostCardItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import api from '../utils/api'
import { useRoute } from '@react-navigation/native'

const Details = ({ navigation }) => {

    const [data, setData] = useState([])
    const [dataUser, setDataUser] = useState({})
    const [loading, setLoading] = useState(false)

    const route = useRoute()
    const paramPostId = route.params.id

    const getPosts = async () => {
        setLoading(true)
        await axios.get(`${api}/posts/${paramPostId}?_embed=comments`).then(res => setData(res?.data))
        setLoading(false)
    }

    const getUserData = async () => {
        setLoading(true)
        await axios.get(`${api}/register/${data?.userId}`).then(res => setDataUser(res?.data))
        setLoading(false)
    }

    useEffect(() => {
        !data?.userId ? getPosts() : getUserData()
    }, [data])

    const renderItem = ({ item }) => (
        <Text style={styles.comment} ><Text style={styles.commentUser}>{item.username}:</Text> {item.content}</Text>
    )

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <Surface style={styles.header}>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Ionicons name="arrow-back" size={30} onPress={() => navigation.navigate('AddPost')}></Ionicons>
                </TouchableOpacity>
                <Text>Detalles</Text>
            </Surface>
            <View style={styles.view}>
                <Card style={styles.item}>
                    <View style={styles.rowView}>
                        <View style={styles.head}>
                            <Text style={styles.comment} ><Text style={styles.commentUser}>Posteado por: </Text>{dataUser.fullname}</Text>
                            <Text style={styles.commentUser}>{new Date(data.created_at).toLocaleDateString()}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>@{dataUser.username}</Text>
                        </View>
                        <View>
                            <Text style={styles.title}>{data.title}</Text>
                            <Text style={styles.subTitle}>{data.subTitle}</Text>
                            <Text style={styles.content}>{data.content}</Text>
                        </View>
                        <Divider />
                        <FlatList
                            data={data?.comments}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    header: {
        marginTop: Platform.OS === 'android' ? 24 : 0,
        padding: 16,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontWeight: 'bold',
        color: "#AEB5BC",
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    head: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 20,
    },
    view: {
        flex: 1
    },
    button: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'steelblue',
    },
    rowView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    item: {
        padding: 16,
        margin: 16,
        elevation: 4,
        borderRadius: 8,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    subTitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    content: {
        marginBottom: 20,
        marginTop: 20
    },
    comment: {
        fontSize: 18
    },
    commentUser: {
        fontSize: 18,
        fontWeight: 'bold'
    },
})

export default Details