/**
 * Imports
 * @param ScrollView: A basic View component which allows you to scroll.
 * @param Navigation: Used to pop the top level page in the stack.
 * @param React: The main React "library" used for native functions in Enmity as used for React Native.
 */
import { View, Text } from "enmity/components"
import { Constants, React, StyleSheet } from "enmity/metro/common"
import { filter_color } from "../utils"

/**
 * Wrapper for any components which displays them in a section with a label
 * @param Component: The component to render inside of the @arg ScrollView.
 */
export default ({label, component}) => {
    /**
     * @param styles: StyleSheet of generic styles used throughout the component.
     */
     const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param text: The main styling for the text component
         * 
         * @func filter_color: Takes an @arg input color and a @arg light and @arg dark color, and calculates whether the color should be the light color or dark color based on the @arg boundary provided as a multiplier (0.8 -> 80% contrast).
                * @arg Note: The boundary value provided for this function is based on theory, and not 50%, as that will cause weird side effects.
         */
        text: {
            color: filter_color(Constants.ThemeColorMap.HEADER_PRIMARY[0], '#FFF', "#000", 0.8, 'buttons in debug info menu'),
            paddingLeft: "5.5%",
            paddingRight: 10,
            marginBottom: 10,
            letterSpacing: 0.25,
            fontFamily: Constants.Fonts.PRIMARY_BOLD,
            fontSize: 12
        },
    })

    /**
     * Render a view with a margin at the top
     * @returns {View}
     */
    return <View style={{marginTop: 10}}>
        {/**
         * Renders a Text Component inside of this view with the label
         * @param label: The label provided when the component was called
         */}
        <Text style={[styles.text, styles.optionText]}>{label.toUpperCase()}</Text>
        {/**
         * The component to render inside of this component. This can be any React Native.
         */}
        {component}
    </View>
}