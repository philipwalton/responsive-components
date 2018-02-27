export const transition =
    ($el, timeout, {to, using, from, useTransitions = true} = {}) => {
  return new Promise((resolve, reject) => {
    const change = () => {
      if (to) {
        $el.classList.add(to);
      } else if (from) {
        $el.classList.remove(from);
      }
    };

    if (useTransitions) {
      $el.classList.add(using);

      // Double rAF to ensure a frame happens before the class is added.
      requestAnimationFrame(() => requestAnimationFrame(change));

      setTimeout(() => {
        $el.classList.remove(using);
        resolve();
      }, timeout);
    } else {
      change();
      resolve();
    }
  });
};
