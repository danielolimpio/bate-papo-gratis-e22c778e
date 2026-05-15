import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  bumpBackoff,
  requestResync,
  resetBackoff,
} from "@/lib/syncBus";

/**
 * Mounts global listeners that force a re-sync of all data hooks when:
 *  - the tab becomes visible again (e.g. switching from desktop to mobile)
 *  - the device regains network
 *  - the window regains focus
 *  - the Realtime websocket disconnects (with exponential backoff)
 */
export function useAutoResync() {
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        resetBackoff();
        requestResync("visibility");
      }
    };
    const onOnline = () => {
      resetBackoff();
      requestResync("online");
    };
    const onFocus = () => {
      resetBackoff();
      requestResync("focus");
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);

    // Watch a heartbeat channel so we notice Realtime drops.
    const heartbeat = supabase
      .channel("sync-heartbeat")
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          resetBackoff();
          requestResync("realtime-up");
        } else if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          bumpBackoff();
          requestResync("realtime-down");
        }
      });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
      supabase.removeChannel(heartbeat);
    };
  }, []);
}
