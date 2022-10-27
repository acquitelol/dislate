// main imports of elements and dependencies
import { FormDivider, FormRow, ScrollView, FormSwitch, FormSection, Text } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { React, Toasts, Constants, StyleSheet, Navigation, Storage } from 'enmity/metro/common';
import {name, version, release, plugin} from '../../manifest.json';
import { bulk, filters} from 'enmity/metro';
import Page from './Page'
import Names from './Names'
import Credits from './Credits'
import { get, set } from 'enmity/api/settings'
import { format_string, debug_info, clipboard_toast, Icons } from '../utils';

// main settingsStore interface
interface SettingsProps {
   settings: SettingsStore;
}

// main declaration of modules being altered by the plugin
const [
    Router, // used to open a url externally
    Clipboard // used to copy the dl link to keyboard
] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString')
);

export default ({ settings }: SettingsProps) => {
    // icon and styles

    const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        item: {
            color: Constants.ThemeColorMap.TEXT_MUTED
        }
    }); // main stylesheet

    const [touchX, setTouchX] = React.useState() // the start x position of swiping on the screen
    const [touchY, setTouchY] = React.useState() // the start y position of swiping on the screen;

    return <>
        <ScrollView
            onTouchStart={e=> {
                    // set them to new position
                    setTouchX(e.nativeEvent.pageX)
                    setTouchY(e.nativeEvent.pageY)
                }
            }
            onTouchEnd={e => {
                // only triggers if x is negative over 100 (moved right) and y is more than -40 but less than 40 (not much movement)
                if (
                    touchX - e.nativeEvent.pageX < -100 
                    && touchY - e.nativeEvent.pageY < 40
                    && touchY - e.nativeEvent.pageY > -40
                ) {
                    Navigation.pop() // removes the page from the stack
                }
            }}
        >
            <Credits /* main credits gui, created from scratch exclusively for dislate *//> 
            <FormSection title="Language">
                <FormRow
                    label='Translate From'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Translate_From} />}
                    trailing={() => <Text style={styles.item}>
                        {format_string(get(name, "DislateLangFrom", "detect")) ?? "N/A"}
                    </Text>}
                    onPress={()=>{
                        // selects which route the page will overwrite: "from" being false and "to" being true
                        set(name, "DislateLangFilter", false) // selects "from" route to be overwritten
                        Navigation.push(Page, { component: Names, name: "Dislate: Language From" }) // opens custom page with languages
                    }}
                />
                <FormDivider/>
                <FormRow
                    label='Translate To'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Translate_To} />}
                    trailing={() => <Text style={styles.item}>
                        {format_string(get(name, "DislateLangTo", "english")) ?? "N/A"}
                    </Text>}
                    onPress={()=>{
                        // selects which route the page will overwrite: "from" being false and "to" being true
                        set(name, "DislateLangFilter", true) // selects "to" route to be overwritten
                        Navigation.push(Page, { component: Names, name: "Dislate: Language To" }) // opens custom page with languages
                    }}
                />
            </FormSection>
            <FormSection title="Utility">
                <FormRow
                    label='Initialisation Toasts'
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Toasts.Context} />}
                    subLabel={`Enable Toasts to display Loading State of ${name}`}
                    trailing={
                        <FormSwitch
                            value={settings.getBoolean('toastEnable', false)} // main toast function function
                            onValueChange={() => {
                                    settings.toggle('toastEnable', false)
                                    Toasts.open({ 
                                        content: `Successfully ${settings.getBoolean('toastEnable', false) ? 'enabled' : 'disabled'} Load Toasts.`, 
                                        source: Icons.Settings.Toasts.Settings 
                                    }); // overwrites it with the opposite
                                }
                            }
                        />
                    }
                />
                <FormDivider />
                <FormRow
                    label='Copy Debug Info'
                    subLabel={`Copy useful debug information of ${name} to clipboard.`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Settings.Debug} />}
                    trailing={FormRow.Arrow}
                    onPress={async function() {
                        Clipboard.setString(await debug_info(version, release));
                        clipboard_toast('debug information')
                    }}
                />
                <FormDivider />
                <FormRow
                    label='Clear Device Cache'
                    subLabel={`Void the fetched device list storage.`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Delete} />}
                    trailing={FormRow.Arrow}
                    onPress={async function() {
                        await Storage.removeItem('device_list') // removes the item and waits for promise resolve
                        Toasts.open({ 
                            content: `Cleared device list storage.`, 
                            source: Icons.Settings.Toasts.Settings 
                        }); // declares success
                    }}
                />
            </FormSection>
            <FormSection title="Source">
                <FormRow
                    label="Download"
                    subLabel={`Copy the link of ${name} to Clipboard`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Copy} />}
                    trailing={FormRow.Arrow}
                    onPress={() => {
                        Clipboard.setString(`${plugin[0].download}?${Math.floor(Math.random() * 1001)}.js`);
                        clipboard_toast('download link')
                    }}
                />
                <FormDivider />
                <FormRow
                    label="Source"
                    subLabel={`Open the Repo of ${name} Externally`}
                    leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
                    trailing={FormRow.Arrow}
                    onPress={() => {
                        Router.openURL(plugin[0].repo)
                    }}
                />
            </FormSection>
            <FormRow label={`Plugin Version: ${version}
Release Channel: ${release}`} /> 
        </ScrollView>
   </>
};