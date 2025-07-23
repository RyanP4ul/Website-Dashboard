import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import type { AccessLevel } from '@/constants/accessLevel'

type User = {
  id: number
  name: string,
  access: number
}

type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await axios.get('http://localhost:3000/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(res.data.user)
    } catch (err) {
      setUser(null)
    }
  }

  const login = (token: string) => {
    localStorage.setItem('token', token)
    fetchUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    (async () => {
      await fetchUser()
    })()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  var auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return auth
}
