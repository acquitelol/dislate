import { Constants, StyleSheet } from "enmity/metro/common";
import { Miscellaneous } from "../../common";

export const types = {
    standard: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      marginTop: 20,
    },
    floating: {
      position: "absolute",
      bottom: 0,
      marginBottom: 30,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
};

export const styles = StyleSheet.createThemedStyleSheet({
    button: {
      width: "90%",
      borderRadius: 10,
      marginLeft: "5%",
      marginRight: "5%",
      ...Miscellaneous.shadow(),
    },
    text: {
      color: "#f2f2f2",
      textAlign: "left",
      letterSpacing: 0.25,
      padding: 10,
    },
    textHeader: {
      fontSize: 20,
      fontFamily: Constants.Fonts.PRIMARY_BOLD,
    },
    textContent: {
      fontSize: 16,
      fontFamily: Constants.Fonts.PRIMARY_NORMAL,
    },
    image: {
      width: 25,
      height: 25,
      borderRadius: 4,
      position: "absolute",
      right: 0,
      margin: 10,
    },
});