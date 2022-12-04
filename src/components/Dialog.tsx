/**
 * Imports
 * @param TouchableOpacity: Works similar to a Pressable, except adds a touchable feedback layer to the content pressed
 * @param Text: The base text component to allow you to render text without React Native throwing
 * @param Image: The image component exported by React Native which allows you to render images from a URI or from a require()
 * @param View: Works similar to a fragment, in the way that it allows you to encapsulate content, but also allows styling etc.
 * @param StyleSheet: Allows you to create dynamic stylesheets for rendering styling for React Native components.
 * @param Constants: Module for many constant values such as Theme colors etc.
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param Dialog: The default Discord Dialog which allows you to render a pop-up on the screen. The component which is being exported is actually a custom implementation.
 * @param filter_color: Allows you to render a light or dark color depending on the color provided (generally your @arg background_color)
 * @param name: The name of the Plugin, from @arg manifest.json. In this case, it's Dislate.
 * @param get: Allows you to retrieve a Setting from your plugin file.
 */
import { TouchableOpacity, Text, Image, View } from "enmity/components"
import { StyleSheet, Constants, React, Dialog } from "enmity/metro/common"
import { filter_color, store_item, shadow } from "../utils"
import {name} from '../../manifest.json'
import { get } from "enmity/api/settings"

/** 
 * This is the main 'Animated' component of React Native, but for some reason its not exported in Enmity's dependencies so I'm importing it manually.
 * @param Animated: The main 'Animated' component of React Native.
 * @ts-ignore */
const Animated = window.enmity.modules.common.Components.General.Animated

/**
 * This is the "Easing" Module exported by React Native. It allows you to use constant Easing types such as @arg Exponential or @arg Cubic
 * @param Easing: The main easing library of React Native, which is built to be used with the @arg Animated library.
 * @ts-ignore */
const Easing = window.enmity.modules.common.Components.General.Easing

export default ({ label, content, type }) => {
    /**
     * @param styles: StyleSheet of generic styles used throughout the component.
     */
     const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param button: The main button styling, to make it look cute and pretty :D
         * The values for @arg width, @arg marginLeft, and @arg marginRight may seem quite random, but the margins are just (100 (%) - @arg width) / 2 each. This evenly splits the available space on each side of the button.
         */
        button: {
            width: '92%',
            borderRadius: 10,
            marginLeft: '4%',
            marginRight: '4%',
            ...shadow
        },
        /**
         * @param text: The main styling for the text component
         * 
         * @func filter_color: Takes an @arg input color and a @arg light and @arg dark color, and calculates whether the color should be the light color or dark color based on the @arg boundary provided as a multiplier (0.8 -> 80% contrast).
                * @arg Note: The boundary value provided for this function is based on theory, and not 50%, as that will cause weird side effects.
         */
        text: {
            color: "#f2f2f2",
            textAlign: 'left',
            letterSpacing: 0.25,
            padding: 10
        },
        /**
         * @param text_header: The styling specifically for the title text/label.
         */
        text_header: {
            fontSize: 20,
            fontFamily: Constants.Fonts.PRIMARY_BOLD
        },
        /**
         * @param text_content: THe styling for the text content/body.
         */
        text_content: {
            fontSize: 16,
            fontFamily: Constants.Fonts.PRIMARY_NORMAL
        },
        /**
         * Style for the @arg {<Image>} component. Pretty self explanatory.
         */
         image: {
            width: 25,
            height: 25,
            borderRadius: 4,
            position: 'absolute',
            right: 0,
            margin: 10
        },
    })

    /** 
     * Use React to create a new Ref with @arg Animated
     * @param animated_button_scale
     */
    const animated_button_scale = React.useRef(new Animated.Value(1)).current

    /**
     * @func onPress: Open a pop-up asking the user whether they want to just hide the Dialog or never show it again.
     */
    const onPress = (): void => {
        /**
         * Move @param animated_button_scale to @arg {0}, in @arg {250ms} with the @arg sinusoidal easing type (@arg Easing.sin).
         * @returns {void}
         */
        const animate = () => Animated.timing(animated_button_scale, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.sin
        }).start();

        /**
         * Open a Discord-Native pop-up prompting the user whether they want to hide the Dialog forever (until it is cleared in Settings) or just hide it.
         */
        Dialog.show({
            title: "Close Tip?",
            body: `You can either hide this information box forever, or just hide it until you open this page again.`,
            confirmText: "Hide",
            cancelText: "Don't show again",
            onConfirm: () => {
                /**
                 * "Confirming" means that you just want the Dialog to hide for this instance. Therefore, play the animation to scale down the Dialog, and nothing else.
                 */
                animate()
            },
            onCancel: async function() {
                /**
                 * "Cancelling" means that you want the Dialog to never show again. Therefore, set the option in Settings for this specific label to true (hidden).
                 */
                await store_item(
                    {
                        name: label,
                        content: true,
                        type: 'setting'
                    },
                    `storing dialog at ${label} in Dialog component`
                )

                /**
                 * Finally, call the @arg animate function to hide the Dialog.
                 */
                animate()
            },
        })
    }

    /**
     * Allows you to open a Dialog with a specific type
     * @param types: The hashmap of possible types that the Dialog could display as. If an invalid type is passed as a prop, @arg standard will be chosen by default.
     */
    const types = {
        /**
         * @param standard: The standard display type. Shows the dialog in a relative position to the rest of the page, and does not float above content.
         */
        standard: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            marginTop: 20
        },
        /**
         * @param floating: This type of Dialog floats above content, at the bottom of the page. The background is also slightly darker so that the text is more visible
         */
        floating: {
            position: 'absolute',
            bottom: 0,
            marginBottom: 30,
            backgroundColor: "rgba(0, 0, 0, 0.8)"
        },
    }
    /** 
     * The main animated style, which is going to be modified by the Animated property.
     * @param animated_scale_style: The main scale style applied to the element which has the scale.
     */
     const animated_scale_style = {
        transform: [
            {
                scale: animated_button_scale
            }
        ]
    }

    /**
     * Checks if this dialog has been hidden forever before, and doesn't render if it has been shown and the user clicked "Don't Show Again."
     */
    const shown_already = get(name, label, false)

    /**
     * Renders an empty fragment if the user chose "Don't show again."
     * @if {(@arg shown_already is true)} -> Render an empty fragment.
     * @else {()} -> Render the main Dialog TSX.
     */
    return !shown_already ? <>
        <Animated.View style={animated_scale_style}>
            <TouchableOpacity
                /**
                 * Has the default "button" styling (@arg styles.button) and also has the styling from whichever type of dialog was passed as a property. 
                 * If this returns undefined (it couldn't find the type in the array) then use @arg standard instead.
                 */
                style={[styles.button, types[type] ?? types["standard"]]}
                onPress={onPress}>
                <View style={{
                    width: "100%",
                    flexDirection: 'row'
                }}>
                    <Image style={styles.image} source={{
                        /**
                         * The image used for the @arg Image.
                         * @param uri: Can be either a @arg URI, which is what is provided, or it can be a @arg require.
                         */
                        uri: 'https://i.imgur.com/rl1ga06.png', 
                    }} />
                </View>
                <Text style={[styles.text, styles.text_header]}>{label}</Text>
                <Text style={[styles.text, styles.text_content]}>{content}</Text>
            </TouchableOpacity>
        </Animated.View>
    </> : <></>
}