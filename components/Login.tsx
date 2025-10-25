import React, { useEffect, useRef } from 'react';
import { User } from '../types';
import { decodeJwt } from '../utils/jwt';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

// IMPORTANT: Replace this with your own Google Cloud client ID from the Google Cloud Console.
const GOOGLE_CLIENT_ID = "895685342701-0e25r7docqrcdeh207ubme9o337ua1un.apps.googleusercontent.com";

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const signInButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Removed check for placeholder client ID as a valid one is provided, which was causing a TypeScript error.
    const handleCredentialResponse = (response: any) => {
      console.log("Encoded JWT ID token: " + response.credential);
      const decodedToken = decodeJwt(response.credential);
      if (decodedToken) {
        const user: User = {
          id: decodedToken.sub,
          name: decodedToken.name,
          email: decodedToken.email,
          picture: decodedToken.picture,
        };
        onLoginSuccess(user);
      } else {
        console.error("Failed to decode token");
      }
    };
    
    const initializeGsi = () => {
      // @ts-ignore
      if (!window.google || !signInButtonRef.current) {
        console.error("Google Identity Services script not ready or button ref is null.");
        return;
      }
      try {
        // @ts-ignore
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
        // @ts-ignore
        window.google.accounts.id.renderButton(
            signInButtonRef.current,
            { theme: "outline", size: "large", type: 'standard', text: 'signin_with' }
        );
        // @ts-ignore
        window.google.accounts.id.prompt(); // Also display the One Tap prompt
      } catch (error) {
        console.error("Error initializing Google Sign-In", error);
      }
    };

    const script = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');

    // @ts-ignore
    if (window.google?.accounts?.id) {
        initializeGsi();
    } else if (script) {
        script.onload = initializeGsi;
    } else {
        console.error("Could not find Google Identity Services script tag.");
    }

  }, [onLoginSuccess]);

  // FIX: Removed conditional rendering for placeholder client ID as a valid one is provided. This was causing a TypeScript error.
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Welcome to Daily Focus
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Sign in to organize your tasks and conquer your day.
        </p>
        <div className="mt-8 flex justify-center">
            <div ref={signInButtonRef}></div>
        </div>
         <div className="mt-8 text-xs text-gray-600 max-w-sm mx-auto">
            <p className="font-semibold text-yellow-500">Developer Note:</p>
            <p>This is a demo application. Your tasks are saved only in this browser and are not shared with Google, besides the authentication process.</p>
        </div>
      </div>
    </div>
  );
};
