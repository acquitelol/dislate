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
import { getBoolean, set } from "enmity/api/settings";
import { FormRow, Text } from "enmity/components";
import { Constants, React, StyleSheet } from "enmity/metro/common";
import { Icons, Debug } from "../../../common";
import { name } from '../../../../manifest.json';

/**
 * This is a component which is part of the Info page which is part of the Debug command.
 * @param {string} option: The current option, as a @arg string, passed from the @arg Info page
 * @param {string} channelId: The @arg {Channel ID}, This is passed as a prop to the component for the "Long Press to send a single item" functionality.
 * @param {string} channelName: The @arg {Channel Name}, This is the name of the channel where the message will be sent.
 */
export default ({ option, channelId, channelName, debugOptions, onConfirmCallback }) => {
    /**
     * Create a new state for whether the Option is currently active, by default, this is false.
     * @param {Getter, Setter}: Allows you to set and re-render the component to determine whether the option is active or inactive.
     */
    const [isActive, setIsActive] = React.useState<boolean>(getBoolean(name, option, false));

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
    });

    /**
     * Return a Discord-Native FormRow with the onPress allowing you to @arg toggle the value, and onLongPress allowing you to send @arg only that log.
     * @returns {TSX Component}
     */
    return <FormRow
        key={option}
        label={option}
        onPress={() => {
            /**
             * Sets the current value of the option to the opposite of what it is currently, effectively toggling it
             * @arg {string} name: The name of the file's settings to edit. In this case, it's Dislate.
             * @arg {string} option: The option's setting to change.
             * @arg {boolean}: The value to set @arg option to.
             */
            getBoolean(name, option, false) ? set(name, option, false) : set(name, option, true);

            /**
             * Set the current state to whatever the new value of the setting is, effectively re-rendering the component to show the new icon.
             * @func getBoolean: Gets a boolean value from a file's setting.
             */
            setIsActive(getBoolean(name, option, false));
        }}
        onLongPress={async function() {
            /**
             * Send a debug log with a single option as the list of options, hence a single log
             * @uses @param {string} option: The option which will be logged.
             */
            await onConfirmCallback(await Debug.debugInfo([option]), "single log");
        }}
        leading={<FormRow.Icon style={styles.icon} source={
            /**
             * Either set the Icon to Tick or Cross depending on whether @arg isActive is true or false
             * @param {number} Icons.Settings.Toasts: Part of the icon dependency to display icons for Toasts, can also be used in this scenario.
             */
            isActive
                ?   Icons.Settings.Toasts.Settings
                :   Icons.Settings.Toasts.Failed
            } 
        />}
        trailing={() => <Text style={[{ paddingRight: 10, paddingTop: 5, paddingBottom: 5 }, isActive ? styles.itemEnabled : styles.itemDisabled]}>
            {debugOptions[option]}
        </Text>}
    />
}