import { gridContainer } from "../appHealth.style"

const styles = theme => ({
  root: {
    ...gridContainer,
    overflow: "hidden",
  },
  
  rootWithoutSidebar: {
    display: "block"
  },
  
  panelLeft: {
    padding: 0,
  },
  
  titleHeader: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main
  },
  
  footer: {
    gridArea: "footer",
    paddingLeft: 15,
    paddingRight: 20,

  },

  footerContainer: {
    height: '100%',
    paddingRight: 20,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-end',
    postion: 'absolute',
  },
  
  footerButton: {
    margin: '0 5px',
    padding: '6px 8px',
    minWidth: '64px !important',
    height: '100%',

  },
});

export default styles;
