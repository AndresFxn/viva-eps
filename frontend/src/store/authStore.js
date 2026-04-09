import { create } from 'zustand'
import api from '../lib/axios'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,

  login: async (email, password) => {
    const { data } = await api.post('/login', { email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token })
    return data.user
  },

  logout: async () => {
    await api.post('/logout').catch(() => {})
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    const { data } = await api.get('/me')
    set({ user: data })
    return data
  },
}))

export default useAuthStore
