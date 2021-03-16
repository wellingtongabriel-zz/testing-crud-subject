import React from "react";

const ButtonTransparent = ({ children, forwardedRef, ...others }) => (
  <button
    ref={forwardedRef}
    {...others}
    style={{ background: "transparent", cursor: "pointer", border: 0 }}
  >
    {children}
  </button>
);

export default React.forwardRef((props, ref) => {
  return <ButtonTransparent {...props} forwardedRef={ref} />;
});
