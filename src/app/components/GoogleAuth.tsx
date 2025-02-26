'use client';

import { useSelector } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup, signOut, browserPopupRedirectResolver } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setUser, clearUser } from '../store/slices/userSlice';
import { useState, useEffect } from 'react';
import { RootState } from '../store';

import styles from '../styles/GoogleAuth.module.css'

export default function GoogleAuth() {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only render content after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getProvider = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      login_hint: 'Sign in to Iesha Inc',
      brand_name: 'Iesha Inc',
    });
    return provider;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = getProvider();
    
    try {
      // Ensure clean auth state before login
      await signOut(auth);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Sign in with popup
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      
      if (!result.user) throw new Error('No user data returned from Google sign in');

      console.log('User signed in successfully with Google:', result.user);
      
      // Dispatch user info to Redux
      dispatch(setUser({ uid: result.user.uid, email: result.user.email || '', displayName: result.user.displayName || '' }));
      
    } catch (error) {
      console.error('Error signing in with Google:', error);

      if (error instanceof Error) {
        if (error.message.includes('popup_blocked')) alert('Popup was blocked. Please allow popups and try again.');
        if (error.message.includes('popup_closed')) alert('Sign in popup was closed. Please try again.');
        if (error.message.includes('network')) alert('Network error. Please check your connection and try again.');
      }

      alert('Failed to sign in with Google. Please try again.');
    }
    finally {
        setLoading(false);
      }
  };

  const signOutWithGoogle = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
      
      // Clear user from Redux
      dispatch(clearUser());
      
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
    finally {
        setLoading(false);
      }
  };

  // Don't render anything during server-side rendering to prevent hydration mismatch
  if (!isClient) {
    return <div className={styles.authContainer}></div>;  // Empty placeholder
  }

  return (
    <div className={styles.authContainer}>
      {!user?.uid ? (
        <button className={styles['gsi-material-button']} onClick={signInWithGoogle} disabled={loading}>
          <div className={styles['gsi-material-button-content-wrapper']}>
            <div className={styles['gsi-material-button-icon']}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block'}}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span className={styles['gsi-material-button-contents']}>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </div>
        </button>
      ) : (
        <button className={styles['sign-out-button']} onClick={signOutWithGoogle} disabled={loading}>
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      )}
    </div>
  );
}