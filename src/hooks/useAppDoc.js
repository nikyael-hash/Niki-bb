import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "../firebase.js";

// Lazy-import Firestore functions only when db is available
let _doc, _getDoc, _setDoc, _onSnapshot;
async function loadFirestore() {
  if (_doc) return true;
  if (!db) return false;
  const m = await import("firebase/firestore");
  _doc = m.doc; _getDoc = m.getDoc; _setDoc = m.setDoc; _onSnapshot = m.onSnapshot;
  return true;
}

/**
 * Drop-in replacement for useState that syncs to Firestore.
 * Falls back to local-only state if Firebase is not configured.
 * API: const [data, setData] = useAppDoc("docname", initialData)
 * setData(newValue) or setData(prev => newValue) — same as useState
 */
export function useAppDoc(docName, initialData) {
  const [data, setLocalData] = useState(initialData);
  const dataRef = useRef(initialData);
  const seeded  = useRef(false);

  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    let unsub = () => {};
    loadFirestore().then(ok => {
      if (!ok) return;
      const docRef = _doc(db, "app_data", docName);

      // Seed initial data if doc doesn't exist yet
      if (!seeded.current) {
        seeded.current = true;
        _getDoc(docRef).then(snap => {
          if (!snap.exists()) _setDoc(docRef, { data: initialData });
        }).catch(() => {});
      }

      unsub = _onSnapshot(docRef,
        snap => { if (snap.exists()) setLocalData(snap.data().data); },
        () => {} // ignore permission errors while not configured
      );
    });
    return () => unsub();
  }, [docName]); // eslint-disable-line react-hooks/exhaustive-deps

  const setData = useCallback((updater) => {
    const next = typeof updater === "function" ? updater(dataRef.current) : updater;
    dataRef.current = next;
    setLocalData(next);
    if (!db) return;
    loadFirestore().then(ok => {
      if (!ok) return;
      const docRef = _doc(db, "app_data", docName);
      _setDoc(docRef, { data: next }).catch(() => {});
    });
  }, [docName]);

  return [data, setData];
}
