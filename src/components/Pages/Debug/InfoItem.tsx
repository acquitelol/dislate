/**
 * Imports
 * @param { getBoolean, set }: The main functions to retrieve and store settings in the Enmity API.
 * @param FormRow: The React-Native Element which Discord uses as a list item.
 * @param Constants: Used for color and weights etc (mostly styling)
 * @param React: This is used to run proprietary functions such as @arg React.useState or @arg React.useEffect
 * @param StyleSheet: Used to create stylesheets which can be used for styling React Native elements.
 * @param Icons: Used for rendering modules which might be used throughout multiple files, and easier to reference.
 * @param name: The name of the plugin, from @arg manifest.json
 * @param Debug: Main class to create Debug Arguments and send Debug Logs.
 */
import { getBoolean, set } from "enmity/api/settings"
import { FormRow, Text, View, TouchableOpacity } from "enmity/components"
import { Constants, React, StyleSheet } from "enmity/metro/common"
import { Icons, Debug } from "../../../utils"
import { name } from '../../../../manifest.json';

/** 
 * This is the main 'Animated' component of React Native, but for some reason its not exported in Enmity's dependencies so I'm importing it manually.
 * @param Animated: The main 'Animated' component of React Native.import { TouchableOpacity } from 'enmity/components';

 * @ts-ignore */
const Animated = window.enmity.modules.common.Components.General.Animated

/**
 * This is a component which is part of the Info page which is part of the Debug command.
 * @param {string} option: The current option, as a @arg string, passed from the @arg Info page
 * @param {string} channelId: The @arg {Channel ID}, This is passed as a prop to the component for the "Long Press to send a single item" functionality.
 * @param {string} channelName: The @arg {Channel Name}, This is the name of the channel where the message will be sent.
 */
export default ({ option, channelId, channelName, debugOptions }) => {
    /**
     * Create a new state for whether the Option is currently active, by default, this is false.
     * @param {Getter, Setter}: Allows you to set and re-render the component to determine whether the option is active or inactive.
     */
    const [isActive, setIsActive] = React.useState<boolean>(getBoolean(name, option, false))

    /**
     * Create a stylesheet for the icon to force it to be @arg INTERACTIVE_NORMAL
     * @param {StyleSheet} styles: StyleSheet exclusively used for the icon.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        /**
         * @param {object} icon: The main styling for the Icons to make them all generalized.
         */
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        /**
         * @param itemDisabled: The main coloring for an item which has been disabled by the user.
         */
        itemDisabled: {
            color: Constants.ThemeColorMap.TEXT_MUTED,
        },
        /**
         * @param itemEnabled: The main coloring for an item which has been enabled by the user.
         */
        itemEnabled: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL,
        },
    })

    const scaleValues = [1, 1.01]

    /**
     * Use React to create a new Ref with @arg Animated
     * @param {React.useRef} animatedButtonScale
     */
     const animatedButtonScale = React.useRef(new Animated.Value(scaleValues[getBoolean(name, option, false) ? 1 : 0])).current

    /**
      * Move @param animatedButtonScale to @arg {1.1}, in @arg {250ms} with the @arg spring easing type.
      * @returns {void}
      */
    const onPressIn = (): void => Animated.spring(animatedButtonScale, {
        toValue: scaleValues[1],
        duration: 250,
        useNativeDriver: true,
    }).start();
 
    /**
      * Move @param animatedButtonScale back to @arg {1}, in @arg {250ms} with the @arg spring easing type.
      * @returns {void}
      */
    const onPressOut = (): void => Animated.spring(animatedButtonScale, {
        toValue: scaleValues[0],
        duration: 250,
        useNativeDriver: true,
    }).start();

    
    /** 
     * The main animated style, which is going to be modified by the Animated property.
     * @param {object{transform[]}} animatedScaleStyle: The main scale style applied to the element which has the scale.
     */
    const animatedScaleStyle = {
        transform: [
            {
                scale: animatedButtonScale
            }
        ]
    }

    /**
     * Return a Discord-Native FormRow with the onPress allowing you to @arg toggle the value, and onLongPress allowing you to send @arg only that log.
     * @returns {TSX Component}
     */
    return <TouchableOpacity
        /** 
         * Main events which can be fired from the image.
         * @param {onPress} onPress: Opens the repo of @arg Dislate externally
         * @param {onPressIn} onPressIn: Triggers when the @arg Image is held down, and scales in the image to @arg {1.1} times its normal scale.
         * @param {onPressOut} onPressOut: Triggers when the @arg Image is has stopped being pressed, and scales out the image back to its normal scale (@arg {1}).
         */
         onPress={() => {
            /**
             * Sets the current value of the option to the opposite of what it is currently, effectively toggling it
             * @arg {string} name: The name of the file's settings to edit. In this case, it's Dislate.
             * @arg {string} option: The option's setting to change.
             * @arg {boolean}: The value to set @arg option to.
             */
            getBoolean(name, option, false) ? set(name, option, false) : set(name, option, true)
            getBoolean(name, option, false) ? onPressIn() : onPressOut()

            /**
             * Set the current state to whatever the new value of the setting is, effectively re-rendering the component to show the new icon.
             * @func getBoolean: Gets a boolean value from a file's setting.
             */
            setIsActive(getBoolean(name, option, false))
            
        }}
        onLongPress={async function() {
            /**
             * Send a debug log with a single option as the list of options, hence a single log
             * @uses @param {string} option: The option which will be logged.
             */
            await Debug.sendDebugLog(
                [option], 
                { channelId, channelName }, 
                'single', 
                'single log in DebugItem Component.'
            )
        }}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
    >
        {/**
         * The main animated view, which will be affected by the Animation variable.
         */}
        <Animated.View style={[animatedScaleStyle]}>
            <FormRow
                key={option}
                label={option}
                leading={<FormRow.Icon style={styles.icon} source={
                    /**
                     * Either set the Icon to Tick or Cross depending on whether @arg isActive is true or false
                     * @param {stringId} Icons.Settings.Toasts: Part of the icon dependency to display icons for Toasts, can also be used in this scenario.
                     */
                    isActive
                        ?   Icons.Settings.Toasts.Settings
                        :   Icons.Settings.Toasts.Failed
                    } 
                />}
                trailing={() => 
                <View>
                    <Text style={[{padding: 10}, isActive ? styles.itemEnabled : styles.itemDisabled]}>
                        {debugOptions[option]}
                    </Text>
                </View>}
            />
        </Animated.View>
    </TouchableOpacity>
}