import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

// Friendly copy for Firebase auth error codes — never show raw Firebase errors to users.
function friendlyAuthError(err) {
  const code = err?.code || ''
  const map = {
    'auth/email-already-in-use': 'That email already has an account. Try logging in instead.',
    'auth/invalid-email': 'That email address doesn\u2019t look right.',
    'auth/weak-password': 'Password needs to be at least 6 characters.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/network-request-failed': 'Network error \u2014 check your connection and try again.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null) // Firebase auth user
  const [profile, setProfile] = useState(null) // Firestore users/{uid} doc: { name, role, city, phone }
  const [loading, setLoading] = useState(true) // true while resolving auth state on load
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setProfileError(null)
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid))
          setProfile(snap.exists() ? snap.data() : null)
        } catch (err) {
          console.error('Failed to load profile', err)
          setProfileError('Couldn\u2019t load your account details. Some features may be limited.')
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signup({ email, password, name, role, city, phone }) {
    let created
    try {
      created = await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      throw new Error(friendlyAuthError(err))
    }
    try {
      await updateProfile(created.user, { displayName: name })
      const userDoc = {
        uid: created.user.uid,
        name,
        email,
        role, // 'worker' | 'employer' — 'admin' is never self-assigned, see README
        city: city || '',
        phone: phone || '',
        createdAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'users', created.user.uid), userDoc)
      setProfile(userDoc)
    } catch (err) {
      console.error('Failed to create profile doc', err)
      // Auth account exists but profile write failed — surface this clearly rather
      // than leaving the user in a half-created state silently.
      throw new Error(
        'Your account was created but we couldn\u2019t save your profile. Please try logging in, or contact support.'
      )
    }
    return created.user
  }

  async function login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return user
    } catch (err) {
      throw new Error(friendlyAuthError(err))
    }
  }

  async function logout() {
    await signOut(auth)
  }

  const value = {
    currentUser,
    profile,
    role: profile?.role || null,
    loading,
    profileError,
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
