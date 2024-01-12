import React from 'react'
import { Container, Nav, Navbar, Stack } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import chaticon from '../assets/chaticon.svg'

function NavBar() {
  const {user, logoutUser} = useContext(AuthContext)
  return (
    <Navbar bg='dark' className='mb-4' style={{ height: "3.75rem"}}>
        <Container>
            <h2>
                <Link to='/' className='text-light text-decoration-none'>
                    <img src={chaticon}  />
                </Link>
            </h2>

            {user && (<span className='text-warning'>Logged in as {user?.name}</span>)}

            <Nav>
                <Stack direction='horizontal' gap={3}>
                    {
                        user && (<>
                        <Link onClick={() => logoutUser()} 
                        to='/login' className='text-light text-decoration-none'>Logout</Link>
                        </>)
                    }

                    {
                        !user && (<>
                        <Link to='/login' className='text-light text-decoration-none'>Login</Link>
                        <Link to='/register' className='text-light text-decoration-none'>Register</Link>
                        </>)
                    }
                </Stack>
            </Nav>
        </Container>
    </Navbar>
  )
}

export default NavBar
