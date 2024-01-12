import React, { useContext } from 'react'
import { useFetchRecipientUser } from '../../hooks/useFetchRecipientUser'
import { Stack } from 'react-bootstrap'
import avatar from '../../assets/avatar.svg'
import { ChatContext } from '../../context/chatContext'

function UserChat({chat, user}) {
    const {recipientUser} = useFetchRecipientUser(chat, user)
    const {onlineUsers} = useContext(ChatContext)

    const isOnline =  onlineUsers?.some((user) => user?.userId === recipientUser?._id)
  return (
    <Stack direction='horizontal' gap={3} className='user-card align-items-center p-2 justify-content-between'
    role='button'>
        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} height="35px" />
            </div>
            <div className="text-name">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">Text Message</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">
                05/01/24
            </div>
            <div className="this-user-notifications">2</div>
            <span className={isOnline ? 'user-online' : ''}></span>
        </div>
    </Stack>
  )
}

export default UserChat
