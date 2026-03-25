type ImageRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

let pendingTransition: ImageRect | null = null;

export const transitionStore = {
  set: (rect: ImageRect) => {
    pendingTransition = rect;
  },
  get: () => pendingTransition,
  clear: () => {
    pendingTransition = null;
  },
};