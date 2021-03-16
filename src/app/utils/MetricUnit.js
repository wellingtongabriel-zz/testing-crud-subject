export const cmToPx = (cm, dpi = 72) => {
    const cmPerInch = 2.54;
    
    if (typeof dpi !== 'number') {
        return 0;
    }
    
    if (typeof cm !== 'number') {
        return 0;
    }
    
    return (dpi / cmPerInch) * cm;
}
