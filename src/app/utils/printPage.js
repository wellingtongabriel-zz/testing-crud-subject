import { isIOS } from "./OS";

function setPrint() {
  this.contentWindow.__container__ = this;
  this.contentWindow.focus(); // Required for IE
  this.contentWindow.print();
}

function printPage(sURL) {
  if (isIOS) {
    const w = window.open(sURL, 'printreceita');
    if (w) {
      const timeoutId = setTimeout(() => {
        w.print();
        clearTimeout(timeoutId);
      }, 1000);
    }
    return;
  }
  
  var oHiddFrame = document.createElement("iframe");
  oHiddFrame.onload = setPrint;
  oHiddFrame.style.position = "fixed";
  oHiddFrame.style.right = "0";
  oHiddFrame.style.bottom = "0";
  oHiddFrame.style.width = "0";
  oHiddFrame.style.height = "0";
  oHiddFrame.style.border = "0";
  oHiddFrame.src = sURL;
  document.body.appendChild(oHiddFrame);
}

export default printPage;
