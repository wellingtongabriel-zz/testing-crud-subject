const styles = theme => ({
  content: {
    gridArea: "content",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    position: "relative",
    overflow: "hidden",

    "& thead th": {
      textAlign: "left",

      "&:first-child": {
        paddingLeft: 0,
        paddingRight: 0,
        width: '50px'
      },
      
      "&:last-child": {
        textAlign: "right"
      }
    },
    "& tbody td": {
      "&:first-child": {
        textAlign: "center",
        paddingLeft: 0,
        paddingRight: 0,
        width: '50px'
      },
      
      "& .tipo": {
        width: 28,
        height: 7,
        borderRadius: 5,
        display: 'inline-block'
      },
      "& .receita": {
        backgroundColor: "#00C1BF",
      },
      "& .despesa": {
        backgroundColor: "#FB7676",
      },
      "&:last-child": {
        textAlign: "right"
      }
    }
  },

  search: {
    gridArea: "search",
    marginBottom: 20,
    marginLeft: 20,
  },

  lista: {
    gridArea: "lista",
    marginBottom: 20,
    overflow: "hidden"
  },

  headerTitleRoot: {
    maxWidth: theme.commons.menuLeft.width
  },

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexGrow: 1
  },

  titleHeader: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: theme.palette.primary.main
  },

  tableContainer: {},

  scrollContainer: {
    height: '70vh',
    
    '@media(max-height: 760px)': {
      height: '65vh',
    }
  },
  
  notFoundContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    
    '& h3': {
      color: theme.palette.primary.main,
      fontWeight: 'normal',
      fontSize: '1rem'
    }
  },
  
  footer: {
    gridArea: "footer",
    paddingLeft: 15,
    paddingRight: 45
  },
  
  buttonAddDespesa: {
    backgroundColor: "#FB7676 !important",
    color: "#fff"
  },
  
  buttonAddReceita: {
    backgroundColor: "#00C1BF !important",
    color: "#fff"
  },

  selectSearch: {
    width: '100%'
  }
});

export default styles;
