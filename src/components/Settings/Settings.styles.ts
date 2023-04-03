import { StyleSheet, Constants } from "enmity/metro/common";
import { Miscellaneous } from "../../common";

export const styles = StyleSheet.createThemedStyleSheet({
    icon: {
        tintColor: Constants.ThemeColorMap.INTERACTIVE_NORMAL
    },
    item: {
        color: Constants.ThemeColorMap.TEXT_MUTED,
        fontFamily: Constants.Fonts.PRIMARY_MEDIUM
    },
    container: {
        width: '90%',
        marginLeft: '5%',
        borderRadius: 10,
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        ...Miscellaneous.shadow()
    },
    subheaderText: {
        color: Constants.ThemeColorMap.HEADER_SECONDARY,
        textAlign: 'center',
        margin: 10,
        marginBottom: 50,
        letterSpacing: 0.25,
        fontFamily: Constants.Fonts.PRIMARY_BOLD,
        fontSize: 14
    }
});