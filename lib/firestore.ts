import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
  CollectionReference,
  DocumentReference,
  Query,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD operations for Firestore
export class FirestoreService {
  // Create a new document
  static async create<T>(collectionName: string, data: T): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Read a single document
  static async read<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error reading document:', error);
      throw error;
    }
  }

  // Read all documents in a collection
  static async readAll<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('Error reading documents:', error);
      throw error;
    }
  }

  // Update a document
  static async update<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Query documents with conditions
  static async query<T>(
    collectionName: string, 
    conditions: Array<{ field: string; operator: any; value: any }>,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      let q: Query = collection(db, collectionName);

      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });

      // Add order by
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection || 'asc'));
      }

      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Real-time listener for a single document
  static subscribeToDocument<T>(
    collectionName: string, 
    docId: string, 
    callback: (data: T | null) => void
  ): Unsubscribe {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as T);
      } else {
        callback(null);
      }
    });
  }

  // Real-time listener for a collection
  static subscribeToCollection<T>(
    collectionName: string, 
    callback: (data: T[]) => void,
    conditions?: Array<{ field: string; operator: any; value: any }>,
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number
  ): Unsubscribe {
    let q: Query = collection(db, collectionName);

    // Add where conditions
    if (conditions) {
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }

    // Add order by
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }

    // Add limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(data);
    });
  }
}

// Export commonly used functions for convenience
export const {
  create,
  read,
  readAll,
  update,
  delete: deleteDocument,
  query: queryDocuments,
  subscribeToDocument,
  subscribeToCollection
} = FirestoreService;
