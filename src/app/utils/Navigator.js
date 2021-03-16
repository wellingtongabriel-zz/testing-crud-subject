export const isSafari = () => {
    return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
}
