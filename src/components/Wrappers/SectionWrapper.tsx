/**
 * Imports
 * @param View: A basic React Native View which allows you to render grouped components.
 * @param Text: A basic React Native Text component which allows you to render customizable, styled text.
 * @param Navigation: Used to pop the top level page in the stack.
 * @param React: The main React "library" used for native functions in Enmity as used for React Native.
 */
import { View, Text } from "enmity/components"
import { Constants, React, StyleSheet } from "enmity/metro/common"

/**
 * Wrapper for any components which displays them in a section with a label
 * @param {string} label: The label for the wrapper, which will be displayed above the content inside of the component.
 * @param {TSX Fragment} component: The component to render inside of the @arg View.
 */
export default ({label, component}) => {
    /**
     * @param {StyleSheet} styles: StyleSheet of generic styles used throughout the component.
     */
     const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param {object} text: The main styling for the text component
         */
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

    /**
     * Render a view with a margin at the top
     * @returns {View}
     */
    return <View style={{marginTop: 10}}>
        {/**
         * Renders a Text Component inside of this view with the label
         * @uses @param {string} label: The label provided when the component was called
         */}
        <Text style={[styles.text, styles.optionText]}>{label.toUpperCase()}</Text>
        {/**
         * The component to render inside of this component. This can be any valid React Native code.
         */}
        {component}
    </View>
}