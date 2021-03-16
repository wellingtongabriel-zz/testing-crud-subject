const styles = theme => ({
  content: {
    gridArea: "content",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    position: "relative",
    overflow: "hidden",

    "& thead th": {
      textAlign: "left",

      "&:last-child": {
        textAlign: "right"
      }
    },
    "& tbody td": {
      "&:last-child": {
        textAlign: "right"
      },
      "& strong": {
        color: "#444",
        fontSize: 15,
        margin: "5px 0"
      },
      "& p": {
        marginBottom: 5
      }
    }
  },

  search: {
    gridArea: "search",
    marginBottom: 20
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
    height: "70vh",

    "@media(max-height: 760px)": {
      height: "65vh"
    }
  },

  notFoundContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",

    "& h3": {
      color: theme.palette.primary.main,
      fontWeight: "normal",
      fontSize: "1rem"
    }
  },

  footer: {
    gridArea: "footer",
    paddingLeft: 15,
    paddingRight: 160
  }
});

export default styles;
