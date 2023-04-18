import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

////Admin document
export const adminColRef = collection(db, 'admin');
export const adminDocRef = documentId => doc(db, 'admin', documentId);

/////Subadmin document
export const subAdminColRef = collection(db, 'subadmins');
export const subAdminDocRef = documentId => doc(db, 'subadmins', documentId);
