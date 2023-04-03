import { Constants, StyleSheet } from "enmity/metro/common";
import { Miscellaneous } from "../../common";

export const styles = StyleSheet.createThemedStyleSheet({
    container: {
        marginTop: 25,
        marginLeft: '5%',
        marginBottom: -15,
        flexDirection: "row"
    },
    textContainer: {
        paddingLeft: 15,
        paddingTop: 5,
        flexDirection: 'column',
        flexWrap: 'wrap',
        ...Miscellaneous.shadow()
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 10,
        ...Miscellaneous.shadow()
    },
    mainText: {
        opacity: 0.975,
        letterSpacing: 0.25
    },
    header: {
        color: Constants.ThemeColorMap.HEADER_PRIMARY,
        fontFamily: Constants.Fonts.DISPLAY_BOLD,
        fontSize: 25,
        letterSpacing: 0.25
    },
    subHeader: {
        color: Constants.ThemeColorMap.HEADER_SECONDARY,
        fontSize: 12.75,
    }
});