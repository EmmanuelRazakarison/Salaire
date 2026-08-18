import { useEffect } from "react";

/**
 * Hook to handle Android hardware back button and browser history for modals.
 * Pushes a state when modal opens, and closes modal if back button / popstate is triggered.
 */
export function useMobileHardwareBack(isOpen: boolean, onClose: () => void, modalId: string) {
  useEffect(() => {
    if (!isOpen) return;

    // Push a dummy history state
    const stateKey = `modal_${modalId}`;
    window.history.pushState({ modal: stateKey }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Clean up history state if closed programmatically
      if (window.history.state?.modal === stateKey) {
        window.history.back();
      }
    };
  }, [isOpen, onClose, modalId]);
}
