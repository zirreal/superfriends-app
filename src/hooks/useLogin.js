import { useState, useEffect } from "react"
import { projectAuth, projectFirestore } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const {dispatch} = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    // sign the user out
    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      // update online status
      const {uid} = res.user;
      await projectFirestore.collection('users').doc(uid).update({ online: true });
      
      // dispatch logout action
      dispatch({type: "LOGIN", payload: res.user})

      // update state
      if(!isCancelled) {
        setError(null);
        setIsPending(false);
      } 

    } catch(e) {
      if(!isCancelled) {
        console.error(e.message)
        setError(e.message);
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return {login, error, isPending}
}