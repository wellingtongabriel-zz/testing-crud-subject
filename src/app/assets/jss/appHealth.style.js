const gridContainer = {
    display: 'grid',
    gridTemplateColumns: `20% 1fr`,
    gridTemplateRows: '1fr 10vh',
    gridTemplateAreas: ` 
            "sidebar-left content" 
            "footer footer"
            `,
    flex: 1
};

const primaryColor = '#00ACA9';
const primaryColorLight = '#00B0AE';
const primaryColorDark = '#009A97';

const background = '#F9F9F9';
const fontColor = '#333333';
const yellow = '#FBBF6D';
const red = '#FB6D6D';
const purple = '#9B69FF';
const blue = '#6DC7FB';
const gray = '#666666';
const grayLight = '#969696';
const blueLight = '#52D5FC';
const sadtColor = '#2A7EAA';
const fontColorDark = '#3e3e3e';

const image = {
    height: 62,
    width: 62,
    backgroundColor: fontColor,
    borderRadius: "100%"
};


export {
    gridContainer,
    primaryColor,
    primaryColorLight,
    primaryColorDark,
    background,
    fontColor,
    yellow,
    red,
    purple,
    blue,
    image,
    blueLight,
    gray,
    grayLight,
    sadtColor,
    fontColorDark
};
