import { StatusBar, } from 'expo-status-bar'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native'
import { Surface, TextInput, Button } from 'react-native-paper'
import { useEffect, useState } from 'react'
import ModalView from '../components/ModalView'
import { Ionicons } from "@expo/vector-icons"
import PostCardItem from '../components/PostCardItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import api from '../utils/api'

const AddPost = ({ navigation }) => {

    const [data, setData] = useState([])
    const [auxData, setAuxData] = useState([])
    const [dataUser, setDataUser] = useState({})
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [content, setContent] = useState('')
    const [postId, setPostId] = useState(0)
    const [loading, setLoading] = useState(false)

    const today = new Date().toLocaleString('es-VE')

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    const getPosts = async () => {
        setLoading(true)
        let userInfo = await AsyncStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        const response = await axios.get(`${api}/posts?_embed=comments`)
        setDataUser(userInfo)
        setData(response?.data)
        setAuxData(response?.data)
        setLoading(false)
    }

    const addPost = async (title, subTitle, content) => {
        const body = {
            "title": title,
            "subTitle": subTitle,
            "content": content,
            "userId": dataUser.id,
            "created_at": today,
        }
        await axios.post(`${api}/posts`, body, { headers })
            .then(resJson => {
                updatePost()
            }).catch(e => { console.log(e) })
    }

    const editPost = (title, subTitle, content, postId) => {
        const body = {
            "title": title,
            "subTitle": subTitle,
            "content": content,
            "userId": dataUser.id,
            "created_At": today,
        }
        axios.put(`${api}/posts/${postId}`, body, { headers })
            .then(resJson => {
                updatePost()
            }).catch(e => { console.log(e) })
    }

    const deletePost = async (postId) => {
        await axios.delete(`${api}/posts/${postId}`, { headers })
            .then(resJson => {
                getPosts()
            }).catch(e => { console.log(e) })
    }

    const addComent = async (comment, postId) => {
        const body = {
            "username": dataUser.username,
            "postId": postId,
            "content": comment,
            "created_at": today,
        }
        await axios.post(`${api}/comments`, body, { headers })
            .then(resJson => {
                updatePost()
            }).catch(e => { console.log(e) })
    }

    const updatePost = () => {
        getPosts()
        setVisible(false)
        setTitle('')
        setPostId(0)
        setContent('')
        setSubTitle('')
    }

    const addNewPost = () => {
        setVisible(true)
        setTitle('')
        setPostId(0)
        setContent('')
        setSubTitle('')
    }

    const edit = (postId, title, subTitle, content) => {
        setVisible(true)
        setTitle(title)
        setPostId(postId)
        setSubTitle(subTitle)
        setContent(content)
    }

    useEffect(() => {
        getPosts()
    }, [])

    const filterData = (filtername) => {
        if (filtername === 'myposts') {
            setData(data.filter(item => item.userId === dataUser.id))
        } else {
            setData(auxData)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <Surface style={styles.header}>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Ionicons name="arrow-back" size={30} onPress={() => navigation.navigate('Home')}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => addNewPost()}>
                    <Text style={styles.buttonText}>Agregar Post</Text>
                </TouchableOpacity>
            </Surface>
            <View style={styles.buttonsWrapper}>
                <Button onPress={() => filterData('myposts')}>Mis Posts</Button>
                <Text> / </Text>
                <Button onPress={() => filterData('allposts')}>Todos los Posts</Button>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id + index.toString()}
                refreshing={loading}
                onRefresh={getPosts}
                renderItem={({ item }) => (
                    <PostCardItem
                        title={item.title}
                        subTitle={item.subTitle}
                        content={item.content}
                        commentId={item.id}
                        addComent={addComent}
                        comments={item.comments}
                        navigate={() => navigation.navigate('Details', { id: item.id })}
                        myPost={dataUser.id === item.userId ? true : false}
                        onEdit={() => edit(item.id, item.title, item.subTitle, item.content)}
                        onDelete={() => deletePost(item.id)}
                    />
                )}
            />
            <ModalView
                visible={visible}
                title="Agrega un Post"
                onDismiss={() => setVisible(false)}
                onSubmit={() => {
                    if (postId && title && subTitle && content) {
                        editPost(postId, title, subTitle, content)
                    } else {
                        addPost(title, subTitle, content)
                    }
                }}
                cancelable
            >
                <TextInput
                    label="Titulo"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Subtitulo"
                    value={subTitle}
                    onChangeText={(text) => setSubTitle(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Comentario"
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    mode="outlined"
                />
            </ModalView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    buttonsWrapper: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        marginTop: Platform.OS === 'android' ? 24 : 0,
        padding: 16,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'steelblue',
    },
    button2: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white'
    },
    link: {
        color: 'blue',
    },
})

export default AddPost