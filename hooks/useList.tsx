import {
  collection,
  DocumentData,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import app from '../firebase';
import { Movie } from '../types';

export default function useList(uid: string | undefined) {
  const [list, setList] = useState<Movie[] | DocumentData[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    if (!uid) return;

    return onSnapshot(
      collection(db, 'customers', uid, 'myList'),
      (snapshot) => {
        setList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );
  }, [db, uid]);

  return list;
}
