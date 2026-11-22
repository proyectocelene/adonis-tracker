// Retrocompatibilidad: Re-exportar useSyncedStore como useIndexedDB
import { useSyncedStore } from './useSyncedStore';

export { useSyncedStore as useIndexedDB };
export default useSyncedStore;
