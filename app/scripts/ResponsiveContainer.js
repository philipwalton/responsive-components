// Default breakpoints that should apply to all observed
// elements that don't define their own custom breakpoints.
const defaultBreakpoints = {SM: 384, MD: 576, LG: 768, XL: 960};

const ro = new ResizeObserver((entries) => {
  entries.forEach((e) => e.target.updateBreakpoints(e.contentRect.width));
});

class ResponsiveContainer extends HTMLElement {
  connectedCallback() {
    const bps = this.getAttribute('breakpoints');
    this.breakpoints = bps ? JSON.parse(bps) : defaultBreakpoints;
    this.name = this.getAttribute('name') || '';

    ro.observe(this);
  }
  disconnectedCallback() {
    ro.unobserve(this);
  }
  updateBreakpoints(width) {
    for (const bp of Object.keys(this.breakpoints)) {
      const minWidth = this.breakpoints[bp];
      const cls = this.name ? `${this.name}-${bp}` : bp;
      if (width >= minWidth) {
        this.classList.add(cls);
      } else {
        this.classList.remove(cls);
      }
    }
  }
}

self.customElements.define('responsive-container', ResponsiveContainer);
