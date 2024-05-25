import {getState, setState, stateListener} from './state.js';

export default class Content {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks
    this.onPinDemoButtonClick = this.onPinDemoButtonClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);

    stateListener.on('change', this.onStateChange);

    // Add a delegated listener for all clicks on `[data-pin-action]` elements.
    document.addEventListener('click', (event) => {
      const targetElement = event.target.closest('[data-pin-action]');
      if (targetElement) {
        this.onPinDemoButtonClick(event);
      }
    });
  }

  onStateChange(oldState, newState) {
    if (oldState.selectedPage !== newState.selectedPage) {
      const $oldSection = this.getSection(oldState.selectedPage);

      if ($oldSection) {
        $oldSection.classList.remove('Section--isSelected');
      }

      const $newSection = this.getSection(newState.selectedPage);
      if ($newSection) {
        $newSection.classList.add('Section--isSelected');
      }

      window.scrollTo(0, 0);
    }
    if (oldState.pinnedDemo !== newState.pinnedDemo) {
      const $oldPinAction = this.getSectionPinDemoBtn(oldState.pinnedDemo);
      if ($oldPinAction) {
        $oldPinAction.classList.remove('PinAction--isActive');
        $oldPinAction.querySelector('button').disabled = false;
      }

      const $newPinDemoBtn = this.getSectionPinDemoBtn(newState.pinnedDemo);
      $newPinDemoBtn.classList.add('PinAction--isActive');
      $newPinDemoBtn.querySelector('button').disabled = true;
    }
  }

  getSection(id) {
    return this.$root.querySelector(`[data-section="${id}"]`);
  }

  getSectionDemo(id) {
    return this.$root.querySelector(
      `[data-section="${id}"] responsive-container`
    );
  }

  getSectionPinDemoBtn(id) {
    return this.$root.querySelector(`[data-section="${id}"] [data-pin-action]`);
  }

  cloneSelectedDemo(id) {
    return this.getSectionDemo(id).cloneNode(true);
  }

  onPinDemoButtonClick(evt) {
    evt.preventDefault();
    setState({
      pinnedDemo: getState().selectedPage,
    });
  }
}
