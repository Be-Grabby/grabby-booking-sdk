import { GrabbySDK } from './grabby';

export default GrabbySDK;

// Expose to global scope for UMD/IIFE build
if (typeof window !== 'undefined') {
  (window as any).Grabby = GrabbySDK;
}
