import { Constants, StyleSheet } from "enmity/metro/common";
import { Miscellaneous } from "../../../common";

export const styles = StyleSheet.createThemedStyleSheet({
    button: {
        width: '42.5%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.ThemeColorMap.HEADER_PRIMARY,
        borderRadius: 10,
        marginLeft: '5%',
        marginTop: 20,
        marginBottom: 5
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    text: {
        color: Miscellaneous.filterColor(
            Constants.ThemeColorMap.HEADER_PRIMARY, 
            '#f2f2f2', "#121212", 0.8, 
            'buttons in debug info menu'
        ),
        textAlign: 'center',
        paddingLeft : 10,
        paddingRight : 10,
        letterSpacing: 0.25,
        fontFamily: Constants.Fonts.PRIMARY_BOLD
    },
    buttonText: {
        fontSize: 16,
    },
    container: {
        width: '90%',
        marginLeft: '5%',
        borderRadius: 10,
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        ...Miscellaneous.shadow()
    },
    pageContainer: {
        paddingTop: 200,
        top: -200,
        paddingBottom: 300,
        marginBottom: -450,
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
    },
    searchWrapper: {
        flexDirection: "row",
    },
    searchContainer: {
        borderRadius: 11,
        width: "65%",
        overflow: "hidden",
        marginTop: 15,
        marginLeft: "5%",
        marginRight: "5%"
    },
    search: {
        margin: 0,
        padding: 0,
        borderBottomWidth: 0,
        background: "none",
        backgroundColor: "none",
    },
    title: {
        color: Constants.ThemeColorMap.HEADER_SECONDARY,
        fontFamily: Constants.Fonts.DISPLAY_BOLD,
        letterSpacing: 0.25,
        textAlign: "center"
    },
    titleContainer: {
        width: "20%",
        marginTop: 15,
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    },
});