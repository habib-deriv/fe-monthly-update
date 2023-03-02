import { db } from '@/config/firebase-config';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';
import { TRoadmap, TTasks, TStars, TCharts } from '@/types';

const createRecord = async (
    collection_name: string,
    data: TTasks | TRoadmap | TStars | TCharts
) => {
    const usersCollectionRef = collection(db, collection_name);
    await addDoc(usersCollectionRef, data);
};

const updateRecord = async (
    collection_name: string,
    id: string,
    data: TTasks | TRoadmap | TStars | TCharts
) => {
    const record = doc(db, collection_name, id);
    await updateDoc(record, data);
};

const deleteRecord = async (collection_name: string, id?: string) => {
    if (id) {
        const userDoc = doc(db, collection_name, id);
        await deleteDoc(userDoc);
    }
};

export { createRecord, deleteRecord, updateRecord };
