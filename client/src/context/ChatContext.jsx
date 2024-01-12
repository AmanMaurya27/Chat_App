import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"

export const ChatContext = createContext()

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUsersChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState(null)
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(null)
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notifications, setNotifications] = useState([])

    console.log("notifiactions : ", notifications)

    // initial socket
    useEffect(() => {
        const newSocket = io("http://localhost:5000")
        setSocket(newSocket)
        return () => {
            newSocket.disconnect()
        }
    }, [user])

    // add online users
    useEffect(() => {
        if(socket === null) return 
        socket.emit("addNewUser", user?._id)
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res)
        })

        return () => {
            socket.off("getOnlineUsers")
        }
    }, [socket])

    // send message
    useEffect(() => {
        if(socket === null) return 

        const recipientId = currentChat?.members.find((id) => id !== user?._id)

       socket.emit('sendMessage', {...newMessage, recipientId})

        return () => {
            socket.off("getOnlineUsers")
        }
    }, [newMessage])


    // receive message and notification
    useEffect(() => {
        if(socket === null) return 

        socket.on('getMessage', res => {
            if(currentChat?._id !== res.chatId) return 

            setMessages((prev) => [...prev, res])
        })

        socket.on('getNotification', (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.sendderId)

            if(isChatOpen) {
                setNotifications(prev => [{...res, isRead:true}, ...prev])
            }
            else {
                setNotifications(prev => [res, ...prev])
            }

        })

        return () => {
            socket.off("getMessage")
            socket.off('getNotifiactions')
        }
    }, [socket, currentChat])


    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users`)
            if(response.error){
                return console.log("Error fetching users...", response)
            }
            const pChats = response.filter((u) => {
                let isChatCreated = false

                if(user?._id === u._id) return false

                if(userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }
                return !isChatCreated
            })
            setPotentialChats(pChats)
        }
        getUsers()
    }, [userChats])

    
    useEffect(() => {
        const getUserChats = async () => {
            if(user?._id) {
                setIsUserChatsLoading(true)
                setUserChatsError(null)
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                setIsUserChatsLoading(false)
                if(response.error)
                    return setUserChatsError(true)
                setUsersChats(response)
            }
        }
        getUserChats()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true)
            setMessagesError(null)
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
            setIsMessagesLoading(false)

            if(response.error)
                return setMessagesError(true)
            setMessages(response)
        }
        getMessages()
    }, [currentChat])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("You Must Type Something....");

        const response = await postRequest(
          `${baseUrl}/messages`,
          JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
          })
        );

        if(response.error)
            return setSendTextMessageError(true)

        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage('')


    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(
            `${baseUrl}/chats`, 
            JSON.stringify({
                firstId, 
                secondId
            }))
            if(response.error)
                return console.log("Error creating chat", response)

            setUsersChats((prev) => [...prev, response])
    }, [])

    return <ChatContext.Provider
        value = {{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            currentChat,
            createChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
            onlineUsers
        }}>{children}</ChatContext.Provider>
}