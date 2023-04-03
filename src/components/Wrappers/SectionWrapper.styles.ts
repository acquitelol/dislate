import { StyleSheet, Constants } from "enmity/metro/common";

export const styles = StyleSheet.createThemedStyleSheet({
    text: {
        color: Constants.ThemeColorMap.HEADER_SECONDARY,
        paddingLeft: "5.5%",
        paddingRight: 10,
        marginBottom: 10,
        letterSpacing: 0.25,
        fontFamily: Constants.Fonts.PRIMARY_BOLD,
        fontSize: 12
    },
});