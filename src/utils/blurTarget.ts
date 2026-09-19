import { createContext, useContext, RefObject } from 'react';
import type { View } from 'react-native';

/**
 * expo-blur requires, on Android (SDK 55+), that every <BlurView> be told
 * which <BlurTargetView> it should sample pixels from via a `blurTarget`
 * ref — without it, Android silently falls back to blurMethod "none" (a
 * flat semi-transparent view, no actual blur). A single BlurTargetView
 * wrapping the whole app (see App.tsx) can back every BlurView in the
 * tree, so this context just hands that one ref down to wherever a
 * BlurView is rendered (Card, tab bar, headers) without prop-drilling it
 * through every intermediate component.
 */
export const BlurTargetContext = createContext<RefObject<View | null> | null>(null);

/** Returns the shared blur target ref, or null before the app root has mounted it. */
export function useBlurTarget(): RefObject<View | null> | null {
  return useContext(BlurTargetContext);
}
