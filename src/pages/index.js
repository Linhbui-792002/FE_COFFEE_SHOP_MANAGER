import { useSelector } from 'react-redux'
import LoginPage from './login'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import Head from 'next/head'

const Homepage = () => {
  // const auth = useSelector(state => state.auth)
  // useEffect(() => {
  //   Cookies.set('accessToken', auth?.accessToken)
  // }, [auth])
  return (
    <>
      <Head>
        <title>CMS-Coffee</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href={'../../public/images/logo.png'} type="image/x-icon" />
        {/* <link
				rel="surl"
				href={metaSlug}
			></link> */}
      </Head>
      <LoginPage />
    </>
  )
}

export default Homepage
