import { gridContainer } from "../appHealth.style"

const styles = theme => ({
  root: {
    ...gridContainer,
    overflow: "hidden",
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
    paddingRight: 160,
  },
  
  totais: {
    backgroundColor: '#fff',
    margin: '15px 0',
    padding: '8px 15px',
    boxSizing: 'border-box',
    borderRadius: 12,
    
    "& p": {
      fontSize: 12,
      width: '100%',
      
      "& span": {
        fontSize: 12,
        float: 'right'
      }
    }
  },
  
  totalLabel: {
    borderTop: '1px solid #707070',
    paddingTop: 3,
    marginTop: 3,
    
    "& span.positivo": {
      color: "#00C1BF"
    },
    "& span.negativo": {
      color: "#FB7676"
    }
  },
  
  totalReceitaLabel: {
    "& span": {
      color: "#00C1BF"
    }
  },
  totalDespesaLabel: {
    "& span": {
      color: "#FB7676"
    }
  }
});

export default styles;
