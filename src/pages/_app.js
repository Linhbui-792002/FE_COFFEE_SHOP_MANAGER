import '@src/styles/globals.css'
import { store } from '@src/redux/store'
import { Provider } from 'react-redux'


import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import AdminLayout from '&common/layout/admin/adminLayout'

function adminLayout(page) {
  return <AdminLayout>{page}</AdminLayout>
}

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const getLayout = Component.getLayout || adminLayout
  const [loading, setLoading] = useState(false)

  const loadingRef = useRef(undefined)

  useEffect(() => {
    const start = () => {
      if (loadingRef.current) {
        clearTimeout(loadingRef.current)
      }
      loadingRef.current = setTimeout(() => {
        setLoading(true)
      }, 200)
    }
    const end = () => {
      if (loadingRef.current) {
        clearTimeout(loadingRef.current)
      }
      setLoading(false)
    }
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', end)
    router.events.on('routeChangeError', end)
    window.addEventListener('showLoading', start)
    window.addEventListener('hideLoading', end)
    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', end)
      router.events.off('routeChangeError', end)
      window.removeEventListener('showLoading', start)
      window.removeEventListener('hideLoading', end)
    }
  }, [])
  return (
    <Provider store={store}>
      <Spin
        spinning={loading}
        size="large"
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 40
            }}
            spin
          />
        }
      >
        {getLayout(<Component {...pageProps} />)}
      </Spin>
    </Provider>
  )
}
