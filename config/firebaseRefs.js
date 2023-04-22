import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

////Admin document and collection
export const adminColRef = collection(db, 'admin');
export const adminDocRef = documentId => doc(db, 'admin', documentId);

/////Subadmin document and collection
export const subAdminColRef = collection(db, 'subadmins');
export const subAdminDocRef = documentId => doc(db, 'subadmins', documentId);

////ca document and collection
export const cashAppColRef = collection(db, 'cashapps');
export const cashAppDocRef = documentId => doc(db, 'cashapps', documentId);

////ca document and collection
export const platformColRef = collection(db, 'platforms');
export const platformDocRef = documentId => doc(db, 'platforms', documentId);
export const platformTransactionColRef = platformId => {
  return collection(doc(db, 'platforms', platformId), 'transactions');
};

////transaction document
export const platformTransactionDocRef = (platformId, transactionId) => {
  return doc(db, 'platforms', platformId, 'transactions', transactionId);
};
