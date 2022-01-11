import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"


export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime ate for document
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id);

    const unsub = ref.onSnapshot(snap => {
      if(snap.data()) {
        setDocument({...snap.data(), id: snap.id});
        setError(null);
      } else {
        setError('no such document exists')
      }
    }, (err) => {
      console.log(err.message);
      setError('failed to get document')
    })

    return () => unsub();

  }, [collection, id])

  return {document, error}
}