/** 
 * Imports 
 * @param {string} name: The name from manifest.json.
 * @param tryCallback: Function to wrap another function in a try-catch
 * @param {function} Toasts: The function to open a toast on the screen
 * @param {object} Icons: The icons exported in ./Icons
 */
import { name } from '../../manifest.json';
import tryCallback from "./try_callback";
import { Constants, Toasts } from "enmity/metro/common";
import Icons from "./icons";
import { StyleSheet } from 'enmity/metro/common';

/** 
 * Fetch a list of all external plugins that Dislate might need to account for, including itself.
 * @param {object} externalPlugins: An object of plugins with the name as the key and the "key" of their respective element as the value
 */
const externalPlugins: { [key: string]: string | undefined; } = {
    messageSpoofer: "69",
    copyEmbed: "1337",
    invisChat: "420",
    cutMessage: "512",
    dislate: "1002"
};

/**
 * @param shadow: Native shadow implementation that is used throughout the entire plugin.
 * This is a function which can take in a number for the opacity, but this @param is optional.
 */
type DefaultObject = { [key: string]: string | number | DefaultObject }
const shadow = (opacity: number = 0.10): DefaultObject => ({
    shadowColor: "#000",
    shadowOffset: {
        width: 1,
        height: 4,
    },
    shadowOpacity: opacity,
    shadowRadius: 4.65,
    elevation: 8
});

/**
 * @param PageStyles: Common styling for Card and Stack pages rendered by Dislate.
 */
const PageStyles: DefaultObject = StyleSheet.createThemedStyleSheet({
    /**
     * @param {object} container: The main styles used for the Container of the page. This is generally only used once.
     */
    container: {
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        flex: 0.5,
      },
    /**
     * @param {object} card: The color exclusively for the main Page card.
     */
    card: {
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_PRIMARY,
        color: Constants.ThemeColorMap.TEXT_NORMAL
    },
    /**
     * @param {object} header: The color used for the Header at the top of the Page View.
     */
    header: {
        backgroundColor: Constants.ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
        shadowColor: 'transparent',
        elevation: 0,
    },
    /**
     * @param {object} text: The main styling for the Close Button's Text Component.
     */
    text: {
        color: Constants.ThemeColorMap.HEADER_PRIMARY,
        fontFamily: Constants.Fonts.PRIMARY_MEDIUM,
        fontSize: 16,
    },
    /**
     * @param {title}: The main color for the left and centre headers for the stack pages.
     */
    title: {
        color: 'white',
        fontFamily: Constants.Fonts.PRIMARY_NORMAL,
    },
})

/**
 * @param PageOptions: Common/Default options passed to the @arg Stack.Navigator's screenOptions prop
 */
const PageOptions = {
    cardStyle: PageStyles.card,
    headerStyle: PageStyles.header,
    headerTitleContainerStyle: { color: Constants.ThemeColorMap.HEADER_PRIMARY },
    headerTitleAlign: 'center',
    safeAreaInsets: {
        top: 0,
    }
}


/** 
 * Open a toast with the text provided saying it has been copied to clipboard or as a tooltip
 * @param {string} source: The text provided to send inside of the toast
 * @param {'clipboard | 'tooltip'} type: The type of toast to show.
 *
 * @uses @param {number} Icons.Clipboard
 * @uses @param {number} Icons.Settings.Initial
 * @returns {void}
 */
const displayToast = (source: string, type: 'clipboard' | 'tooltip'): void => {
    Toasts.open({ 
        content: type=='clipboard' ? `Copied ${source} to clipboard.` : source, 
        source: type=='clipboard' ? Icons.Clipboard : Icons.Settings.Initial 
    });
};

/** 
 * Chooses whether the color should be Dark or Light depending on the background color of the element.
 * @param {string} color: The background color
 * @param {string} light: The light color
 * @param {string} dark: The dark color
 * @param {number?} boundary: The maximum boundary that the color can reach before choosing dark mode.
 * @param {string?} label: The label of the function when called. May be undefined.
 * @returns {string color}
 */
const filterColor = (color: string, light: string, dark: string, boundary: number = 186, label?: string): string => {
    return tryCallback(() => {
        /**
         * Gets the @arg color without the @arg {#} (@arg {#FFFFFF} -> @arg {FFFFFF})
         */
        let baseColor = color.replace("#", "")

        /**
         * Parses a color as an integer from any @arg base provided to @arg {base 10}
         * @param {string} color: The color provided as a @func string, in @func baseAny
         * @param {number[]} digits: The digits of the color which it should return as @func base10
         * @param {number} base: The base provided, can be anything but it would be @func base16 when called
         * @returns {~ string formattedColor}
         */
        const parseColorAsInt = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)

        /**
         * Gets the correct integer color for each part of the color provided
         * @param {number} red: The red value of the color, at @arg {0, 2}
         * @param {number} green: The green value of the color, at @arg {2, 4}
         * @param {number} blue: The blue value of the color, at @arg {4, 6}
         */
        const red = parseColorAsInt(baseColor, [0, 2], 16),
            green = parseColorAsInt(baseColor, [2, 4], 16),
            blue = parseColorAsInt(baseColor, [4, 6], 16);

        /**
         * Checks if the colors added up are higher than the boundary, and returns the light or dark color accordingly
         * @returns ->
                 * @if {(@arg red + @arg green + @arg blue are bigger than the boundary)} -> Return the dark color.
                 * @else {()} -> Return the light color. 
         */
        return (((red + green + blue) / (255 * 3)) > boundary)
            ?   dark 
            :   light
    }, [color, light, dark, boundary], name, 'checking if color should be light or dark at', label);
};

export default 
{
    externalPlugins,
    shadow,
    PageStyles,
    PageOptions,
    displayToast,
    filterColor
};