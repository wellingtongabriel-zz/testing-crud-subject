const styles = theme => ({
    root: {
        padding: '0.7%',
    },

    tableRow: {
        '&:last-child td, &:last-child th': {
            border: 0,
        },
        cursor:'pointer'
    },

    tableRowCursorDefault: {
        '&:last-child td, &:last-child th': {
            border: 0,
        },
        cursor:'default'
    },

    tableCell: {
        padding: '0 0 4px',
        borderColor: theme.palette.commons.gray3,
        color: theme.palette.commons.fontColor,
        fontSize: '1rem'
    },

    tableCenter: {
        textAlign: 'center'
    },

    tabela: {
        width: '100%'
    },
});

export default styles;