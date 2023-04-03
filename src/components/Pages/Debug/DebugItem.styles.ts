import { Constants, StyleSheet } from "enmity/metro/common";

export const styles = StyleSheet.createThemedStyleSheet({
    icon: {
        color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    },
    disabled: {
        color: Constants.ThemeColorMap.TEXT_MUTED,
    },
    enabled: {
        color: Constants.ThemeColorMap.INTERACTIVE_NORMAL,
    },
});