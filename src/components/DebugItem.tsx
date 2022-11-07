import { getBoolean, set } from "enmity/api/settings"
import { FormRow } from "enmity/components"
import { Constants, React, StyleSheet } from "enmity/metro/common"
import { Icons } from "../utils"
import { name } from '../../manifest.json';

// option is a property passed from the main info page
export default ({ option }) => {
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
    />
}