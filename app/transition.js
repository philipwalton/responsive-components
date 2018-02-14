export const transition = (duration, run) => {
  return new Promise((resolve, reject) => {
    if (run) {
      // Double rAF to ensure a frame happens before run.
      requestAnimationFrame(() => requestAnimationFrame(run));
    }
    setTimeout(resolve, duration);
  });
};
