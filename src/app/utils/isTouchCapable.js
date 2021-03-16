// ==============================
// Touch Capability Detector
// ==============================

function isTouchCapable() {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
}

export default isTouchCapable;