// Tiny global toast bus. Call toast("Saved") from anywhere (components, hooks,
// non-React modules). The <Toaster /> mounted in the layout renders them.
export type ToastKind = "default" | "success" | "error";

export type ToastEvent = {
  id: number;
  message: string;
  kind: ToastKind;
};

export const TOAST_EVENT = "staynest:toast";

export function toast(message: string, kind: ToastKind = "default") {
  if (typeof window === "undefined") return;
  const detail: ToastEvent = {
    id: Date.now() + Math.random(),
    message,
    kind,
  };
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}
