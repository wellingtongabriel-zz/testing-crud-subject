const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  
  content: {
    minHeight: "77vh",
    overflow: "auto",
    [theme.breakpoints.down(1200)]: {
      padding: "0 1%",
    },
    [theme.breakpoints.down(1900)]: {
      padding: "0 2%",
    },
    [theme.breakpoints.up(1900)]: {
      padding: "0 10%",
    },
  },
  
  boxTotais: {
    display: "flex",
    width: "100%",
    height: "80px",
    borderRadius: "20px",
    boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.1)",
    backgroundColor: "#00c1bf",
    
    "& p": {
      color: "#fff",
    },
    "& img": {
      height: "30px",
    },
    
    "&.entradas": {
      backgroundColor: "#00c1bf",
    },
    "&.saidas": {
      backgroundColor: "#fb7676",
    },
    "&.saldo": {
      backgroundColor: "#0093bd",
    },
  },
  
  boxTotaisIconLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "45%",
    paddingLeft: "15px",
    
    "& p": {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "18px",
      width: "80px",
      marginLeft: "15px"
    }
  },
  
  boxTotaisTotalLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "55%",
    paddingRight: "15px",
    
    "&.total-label-saldo": {
      flexDirection: "column",
      position: "relative"
    },
    
    "& p": {
      fontSize: "28px",
      fontWeight: "900",
      
      "& span": {
        fontWeight: "400"
      }
    }
  },
  
  boxTotaisSaldoGrafico: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
    "& img": {
      "&.arrow": {
        position: "absolute",
        right: 10,
        bottom: 10,
        height: 25,
      }
    }
  },
  
  boxWhite: {
    width: "100%",
    height: 250,
    borderRadius: 30,
    boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: '15px 15px 0 0',
    boxSizing: "border-box",
    
    "& .recharts-cartesian-axis-tick": {
      fontSize: 10,
      
      "& text": {
        fill: theme.palette.commons.fontColor,
      }
    },
    
    "& .recharts-pie-sector .recharts-sector": {
      stroke: "none"
    },
    
    "& .recharts-pie-labels text": {
      fontSize: 12
    },
    
    "& .custom-tooltip": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: '0 10px',
      height: 30,
      borderRadius: 6,
      boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.1)",
      
      "& .label": {
        fontSize: 14,
        color: theme.palette.commons.fontColor
      }
    }
  },
  
  boxAtendimentosAtrasados: {
    padding: 0,
  },
  
  boxAgenda: {
    padding: 0,
  },
  
  agendaGrafico: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "55%",
  },
  
  agendaGraficoLegenda: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "45%",
    height: "80%",
    borderLeft: "2px solid #e5e5e3",
    paddingLeft: 15,
  },
  
  agendaGraficoLegendaItem: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  
  agendaGraficoLegendaIcone: {
    width: 25,
    height: 25,
    borderRadius: "50%",
  },
  
  agendaGraficoLegendaLabel: {
    color: theme.palette.commons.fontColor,
    fontSize: 12,
    width: "calc(100% - 50px)",
    marginLeft: 10,
  },
  
  agendaGraficoLegendaTotal: {
    color: theme.palette.commons.fontColor,
    fontSize: 12,
    textAlign: "center",
  },
  
  boxWhiteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00b0ae",
    marginTop: 15,
    marginBottom: 5,
  },
  
  footer: {
    gridArea: "footer",
    paddingLeft: 15,
    paddingRight: 45,
  },
});

export default styles;
