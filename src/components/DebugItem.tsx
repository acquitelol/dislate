import { getBoolean, set } from "enmity/api/settings"
import { FormRow } from "enmity/components"
import { Constants, Messages, Navigation, React, StyleSheet, Toasts } from "enmity/metro/common"
import { debug_info, Icons } from "../utils"
import { name } from '../../manifest.json';

// option is a property passed from the main info page
export default ({ option, channel }) => {
    // set state on whether its active or not to display the icons accordingly
    const [isActive, setIsActive] = React.useState<boolean>(getBoolean(name, option, false))
    const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
    })

    return <FormRow
        key={option}
        label={option}
        trailing={<FormRow.Icon style={styles.icon} source={isActive?Icons.Settings.Toasts.Settings:Icons.Settings.Toasts.Failed} />}
        onPress={() => {
            // toggles the value of the option and changes the state
            getBoolean(name, option, false) ? set(name, option, false) : set(name, option, true)
            setIsActive(getBoolean(name, option, false))
        }}
        onLongPress={async function() {
            // close the page
            Navigation.pop()

            // send the message with all the options as argument
            Messages.sendMessage(channel, {
                content: await debug_info([option])
            }); // send a message with string interpolation

            // opens a toast to declare that message has been sent
            Toasts.open({ 
                // formats the string and shows language that it has changed it to
                content: `Sent debug info in current channel.`, 
                source: Icons.Settings.Toasts.Settings
            })
        }}
    />
}