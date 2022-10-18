// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme) {
    return {
        MuiTab: {
            styleOverrides: {
                root: {
                    minHeight: 26,
                    color: theme.palette.text.primary
                }
            }
        }
    };
}
