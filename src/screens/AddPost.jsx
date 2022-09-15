import { StatusBar, } from 'expo-status-bar'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native'
import { Surface, Title, TextInput } from 'react-native-paper'
import { useContext, useEffect, useState } from 'react'
import ModalView from '../components/ModalView'
import { Ionicons } from "@expo/vector-icons"
import PostCardItem from '../components/PostCardItem'
import axios from "axios"
import api from '../utils/api'
import { AuthContext } from '../context/AuthContext'

const AddPost = ({ navigation }) => {

    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [postId, setPostId] = useState(0)
    const [loading, setLoading] = useState(false)

    const { userInfo } = useContext(AuthContext)

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    const getPosts = async () => {
        setLoading(true)
        const response = await axios.get(`${api}/posts`)
        setData(response?.data)
        setLoading(false)
    }

    const addPost = async (title, author) => {
        const body = {
            "author": author,
            "title": title,
        }
        await axios.post(`${api}/posts`, body, { headers })
            .then(resJson => {
                updatePost()
            }).catch(e => { console.log(e) })
    }

    const editPost = (postId, title, author) => {
        const body = {
            "author": author,
            "title": title,
        }
        axios.put(`${api}/posts/${postId}`, body, { headers })
            .then(resJson => {
                updatePost()
            }).catch(e => { console.log(e) })
    }

    const deletePost = (postId) => {
        axios.delete(`${api}/posts/${postId}`, { headers })
            .then(resJson => {
                getPosts()
            }).catch(e => { console.log(e) })
    }

    const updatePost = () => {
        getPosts()
        setVisible(false)
        setAuthor('')
        setTitle('')
        setPostId(0)
    }

    const edit = (id, title, author) => {
        setVisible(true)
        setPostId(id)
        setTitle(title)
        setAuthor(author)
    }

    useEffect(() => {
        getPosts()
    }, [])

    // console.log(userInfo)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <Surface style={styles.header}>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Ionicons name="arrow-back" size={30} onPress={() => navigation.navigate('Home')}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                    <Text style={styles.buttonText}>Agregar Post</Text>
                </TouchableOpacity>
            </Surface>
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id + index.toString()}
                refreshing={loading}
                onRefresh={getPosts}
                renderItem={({ item }) => (
                    <PostCardItem
                        title={item.title}
                        author={item.author}
                        onEdit={() => edit(item.id, item.title, item.author)}
                        onDelete={() => deletePost(item.id)}
                    />
                )}
            />
            <ModalView
                visible={visible}
                title="Add Post"
                onDismiss={() => setVisible(false)}
                onSubmit={() => {
                    if (postId && title && author) {
                        editPost(postId, title, author)
                    } else {
                        addPost(title, author)
                    }
                }}
                cancelable
            >
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    mode="outlined"
                />
                <TextInput
                    label="Author"
                    value={author}
                    onChangeText={(text) => setAuthor(text)}
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