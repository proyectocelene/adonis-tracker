// Retrocompatibilidad: Re-exportar useSyncedStore como useLocalStorage
import { useSyncedStore } from './useSyncedStore';

export { useSyncedStore as useLocalStorage };
export default useSyncedStore;
