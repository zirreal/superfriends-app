import { useState, useEffect } from "react"
import {projectStorage, projectFirestore} from '../firebase/config';
import {useAuthContext} from './useAuthContext';


export const useStorage = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const {user} = useAuthContext();

  const uploadImage = async (file, url) => {
    setError(null);
    setIsPending(false);

    const filePath = `bio/${user.uid}/${file.name}`;
    const storageRef = projectStorage.ref(filePath);

    try {
      setIsPending(true)
      const res = await storageRef.put(file);
      const url = await res.ref.getDownloadURL();

      const additionalPhoto = [
        {coverUrl: url},
        {filePath}
      ]

      // adding pic values to bio array
      await projectFirestore.collection('users').doc(user.uid).update({additionalPhoto})


      if(!isCancelled) {
        setIsPending(false)
        setError(null)
      }

    } catch(err) {
      if(!isCancelled) {
        console.error(err.message)
        setError(err.message)
        setIsPending(false)
      }
    }


  };

  const deleteImage =  async (path) => {
    const storageRef = projectStorage.ref(path);

    try {
      await storageRef.delete();

      if(!isCancelled) {
        setIsPending(false)
        setError(null)
      }

    } catch(err) {
      if(!isCancelled) {
        console.error(err.message)
        setError(err.message)
        setIsPending(false)
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return {uploadImage, deleteImage, error, isPending}
}