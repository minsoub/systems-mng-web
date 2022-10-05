// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
    const disabledStyle = {
        '&.Mui-disabled': {
            backgroundColor: theme.palette.grey[200]
        }
    };

    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: {
                    fontWeight: 400
                },
                contained: {
                    ...disabledStyle
                },
                outlined: {
                    ...disabledStyle,
                    backgroundColor: theme.palette.grey[0],
                    color: theme.color
                },
                outlined_d: {
                    ...disabledStyle,
                    backgroundColor: theme.palette.grey[0],
                    color: theme.palette.grey[700],
                    border: '1px solid',
                    borderColor: theme.palette.grey[400]
                },
                linked: {
                    ...disabledStyle,
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: theme.palette.grey[500],
                    padding: '4px 12px'
                }
            }
        }
    };
}
