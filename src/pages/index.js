import { useSelector } from 'react-redux'
import LoginPage from './login'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

const Homepage = () => {
  // const auth = useSelector(state => state.auth)
  // useEffect(() => {
  //   Cookies.set('accessToken', auth?.accessToken)
  // }, [auth])
  return (
    <>
      <LoginPage />
    </>
  )
}

export default Homepage
