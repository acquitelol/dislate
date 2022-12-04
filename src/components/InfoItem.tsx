/**
 * Imports
 * @param {getBoolean, set}: The main functions to retrieve and store settings in the Enmity API.
 * @param FormRow: The React-Native Element which Discord uses as a list item.
 * @param Constants: Used for color and weights etc (mostly styling)
 * @param React: This is used to run proprietary functions such as @arg React.useState or @arg React.useEffect
 * @param StyleSheet: Used to create stylesheets which can be used for styling React Native elements.
 * @param Icons: Used for rendering modules which might be used throughout multiple files, and easier to reference.
 * @param name: The name of the plugin, from @arg manifest.json
 * @param send_debug_log: Allows you to send a debug log.
 */
import { getBoolean, set } from "enmity/api/settings"
import { FormRow, Text, View, TouchableOpacity } from "enmity/components"
import { Constants, React, StyleSheet } from "enmity/metro/common"
import { Icons, send_debug_log, fetch_debug_arguments } from "../utils"
import { name } from '../../manifest.json';

/** 
 * This is the main 'Animated' component of React Native, but for some reason its not exported in Enmity's dependencies so I'm importing it manually.
 * @param Animated: The main 'Animated' component of React Native.import { TouchableOpacity } from 'enmity/components';

 * @ts-ignore */
const Animated = window.enmity.modules.common.Components.General.Animated

/**
 * This is a component which is part of the Info page which is part of the Debug command.
 * @param option: The current option, as a @arg string, passed from the @arg Info page
 * @param channel: The @arg {Channel ID}, This is passed as a prop to the component for the "Long Press to send a single item" functionality.
 */
export default ({ option, channel_id, channel_name }) => {
    /**
     * Create a new state for whether the Option is currently active, by default, this is false.
     * @param {Getter, Setter}: Allows you to set and re-render the component to determine whether the option is active or inactive.
     */
    const [isActive, setIsActive] = React.useState<boolean>(getBoolean(name, option, false))
    const [options, setOptions] = React.useState<string[]>([])

    /**
     * Create a stylesheet for the icon to force it to be @arg INTERACTIVE_NORMAL
     * @param styles: StyleSheet exclusively used for the icon.
     */
    const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        item: {
            padding: 10
        },
        item_disabled: {
            color: Constants.ThemeColorMap.TEXT_MUTED,
        },
        item_enabled: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL,
        },
        background_enabled: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 10,
        },
        background_disabled: {
            backgroundColor: 'transparent'
        },
    })

    /**
     * Use an asynchronous call to fetch the available debug arguments, on the first mount of the component to not cause any refetching on re-renders.
     */
     React.useEffect(async function() {
        setOptions(await fetch_debug_arguments())
    }, [])

    const scale_values = [1, 1.01]

    /**
     * Use React to create a new Ref with @arg Animated
     * @param animated_button_scale
     */
     const animated_button_scale = React.useRef(new Animated.Value(scale_values[getBoolean(name, option, false) ? 1 : 0])).current

     /**
      * Move @param animated_button_scale to @arg {1.1}, in @arg {250ms} with the @arg spring easing type.
      * @returns {void}
      */
     const onPressIn = (): void => Animated.spring(animated_button_scale, {
             toValue: scale_values[1],
             duration: 250,
             useNativeDriver: true,
     }).start();
 
     /**
      * Move @param animated_button_scale back to @arg {1}, in @arg {250ms} with the @arg spring easing type.
      * @returns {void}
      */
     const onPressOut = (): void => Animated.spring(animated_button_scale, {
             toValue: scale_values[0],
             duration: 250,
             useNativeDriver: true,
     }).start();

    
     /** 
      * The main animated style, which is going to be modified by the Animated property.
     * @param animated_scale_style: The main scale style applied to the element which has the scale.
     */
    const animated_scale_style = {
        transform: [
            {
                scale: `${animated_button_scale*100}%`
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
             * @arg name: The name of the file's settings to edit. In this case, it's Dislate.
             * @arg option: The option's setting to change.
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
             * @param option: The option which will be logged.
             */
            await send_debug_log(
                [option], 
                {channel_id: channel_id, channel_name: channel_name}, 
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
        <Animated.View style={[animated_scale_style]}>
            <FormRow
                key={option}
                label={option}
                leading={<FormRow.Icon style={styles.icon} source={
                    /**
                     * Either set the Icon to Tick or Cross depending on whether @arg isActive is true or false
                     * @param Icons.Settings.Toasts: Part of the icon dependency to display icons for Toasts, can also be used in this scenario.
                     */
                    isActive
                        ?   Icons.Settings.Toasts.Settings
                        :   Icons.Settings.Toasts.Failed
                    } 
                />}
                trailing={() => 
                <View style={isActive?styles.background_enabled:styles.background_disabled}>
                    <Text style={[styles.item, isActive?styles.item_enabled:styles.item_disabled]}>
                        {options[option]}
                    </Text>
                </View>}
            />
        </Animated.View>
    </TouchableOpacity>
}