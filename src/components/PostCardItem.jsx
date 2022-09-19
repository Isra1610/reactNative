import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import { Card, Divider, TextInput } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'

const Button = ({ onPress, style, icon }) => (
    <TouchableOpacity style={style} onPress={onPress}>
        <Feather name={icon} size={24} />
    </TouchableOpacity>
)

export default function PostCardItem({ title, subTitle, content, onEdit, onDelete, myPost, addComent, commentId, comments, navigate }) {

    const [comment, setComment] = useState("")

    const renderItem = ({ item }) => (
        <Text style={styles.comment} ><Text style={styles.commentUser}>{item.username}:</Text> {item.content}</Text>
    )

    const resetInput = () => {
        setComment('')
    }

    return (
        <Card style={styles.item}>
            <View style={styles.rowView}>
                <View style={styles.navBar}>
                    <View style={styles.rowButtons}>
                        <Button onPress={navigate} icon='info' />
                        {myPost && (
                            <View style={styles.buttonsWrapper}>
                                <Button
                                    onPress={onEdit}
                                    icon="edit"
                                    style={{ marginHorizontal: 16 }} />
                                <Button onPress={onDelete} icon='trash-2' />

                            </View>
                        )
                        }
                    </View>
                </View>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <Divider />
                <View style={styles.commentWrapper}>
                    <FlatList
                        data={comments}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <View style={styles.sendComment}>
                    <TextInput
                        style={styles.entryInput}
                        placeholder='Deja un comentario'
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                    />
                    <Button
                        style={styles.senButton}
                        onPress={() => {
                            addComent(comment, commentId)
                            resetInput()
                        }}
                        icon='send'
                    />
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sendComment: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    entryInput: {
        flex: 1,
        height: 50,
        color: 'gray',
        borderBottomWidth: 2,
        backgroundColor: 'white',
        borderColor: 'gray',
        marginTop: 20
    },
    senButton: {
        marginTop: 20,
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
    inputButton: {
        alignItems: 'center',
        right: 30,
        position: 'absolute',
        bottom: 15,
        borderRadius: 5,
        borderWidth: 1,
        padding: 8,
        borderColor: 'gray'
    },
    subTitle: {
        fontSize: 18,
        textAlign: 'left',
    },
    commentWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    commentUser: {
        fontWeight: 'bold'
    },
    comment: {
        marginTop: 20
    },
    userNick: {
        fontSize: 18,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    content: {
        marginBottom: 20
    },
})