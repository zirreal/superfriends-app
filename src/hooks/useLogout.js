import { useState, useEffect } from "react"
import { projectAuth, projectFirestore } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const {user, dispatch} = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // sign the user out
    try {
      // update online status
      const {uid} = user;
      await projectFirestore.collection('users').doc(uid).update({ online: false })


      await projectAuth.signOut();

      // dispatch logout action
      dispatch({type: "LOGOUT"})
      setIsPending(false)
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

  return {logout, error, isPending}
}