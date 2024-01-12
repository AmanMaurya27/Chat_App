import React, { useContext } from 'react'
import { ChatContext } from '../context/chatContext'
import { Container, Stack } from 'react-bootstrap'
import UserChat from '../components/chat/UserChat'
import { AuthContext } from '../context/AuthContext'
import PotentialChats from '../components/chat/PotentialChats'
import Chatbox from '../components/chat/Chatbox'

function Chat() {
  const {user} = useContext(AuthContext)
  const {userChats, isUserChatsLoading, updateCurrentChat} = useContext(ChatContext)
  return (
    <Container>
      <PotentialChats/>
        {userChats?.length < 1 ? null : (
        <Stack direction='horizontal' gap={5} className='align-item-start'>
          <Stack className='flex-grow-0 pe-4'>
            {isUserChatsLoading && <p>Loading Chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div key={index} onClick = {() => updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user}/>
                </div>
              )
            })}
          </Stack>
          <Chatbox />
        </Stack>)}
    </Container>
  )
}

export default Chat
