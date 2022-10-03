// main imports of elements and dependencies
import { FormDivider, FormRow, ScrollView, FormSwitch, FormSection, Text, Form } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { getIDByName } from 'enmity/api/assets';
import { React, Toasts, Constants, StyleSheet, Navigation, NavigationNative } from 'enmity/metro/common';
import {name, version, release, plugin} from '../../manifest.json';
import { bulk, filters} from 'enmity/metro';
import Page from './Page'
import Names from './Names'
import { get, set } from 'enmity/api/settings'
import { formatString, debugInfo, clipboardToast } from '../utils';

// main settingsStore interface
interface SettingsProps {
   settings: SettingsStore;
}

// main declaration of modules being altered by the plugin
const [
    Router, // used to open a url externally
    Clipboard, // used to copy the dl link to keyboard
 ] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
 );

export default ({ settings }: SettingsProps) => {
    // icon and styles
   const toastTrail = getIDByName('ic_selection_checked_24px');
   const styles = StyleSheet.createThemedStyleSheet({
        icon: {
            color: Constants.ThemeColorMap.INTERACTIVE_NORMAL
        },
        item: {
            color: Constants.ThemeColorMap.TEXT_MUTED
        }
    }); // main stylesheet


    const [touchX, setTouchX] = React.useState() // the start x position of swiping on the screen
    const [touchY, setTouchY] = React.useState() // the start y position of swiping on the screen

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
        <FormSection title="Language">
            <FormRow
                label='Translate From'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_raised_hand')} />}
                trailing={() => <Text style={styles.item}>
                    {formatString(get("Dislate", "DislateLangFrom", "detect")) ?? "N/A"}
                </Text>}
                onPress={()=>{
                    // selects which route the page will overwrite: "from" being false and "to" being true
                    set("Dislate", "DislateLangFilter", false) // selects "from" route to be overwritten
                    Navigation.push(Page, { component: Names, name: "Dislate: Language From" }) // opens custom page with languages
                }}
            />
            <FormDivider/>
            <FormRow
                label='Translate To'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_activity_24px')} />}
                trailing={() => <Text style={styles.item}>
                    {formatString(get("Dislate", "DislateLangTo", "japanese")) ?? "N/A"}
                </Text>}
                onPress={()=>{
                    // selects which route the page will overwrite: "from" being false and "to" being true
                    set("Dislate", "DislateLangFilter", true) // selects "to" route to be overwritten
                    Navigation.push(Page, { component: Names, name: "Dislate: Language To" }) // opens custom page with languages
                }}
            />
        </FormSection>
        <FormDivider />
		<FormSection title="Utility">
            <FormRow
                label='Initialisation Toasts'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('toast_image_saved')} />}
                subLabel={`Enable Toasts to display Loading State of ${name}`}
                trailing={
                    <FormSwitch
                        value={settings.getBoolean('toastEnable', false)} // main toast function function
                        onValueChange={() => {
                                settings.toggle('toastEnable', false)
                                Toasts.open({ content: `Successfully ${settings.getBoolean('toastEnable', false) ? 'enabled' : 'disabled'} Load Toasts.`, source: toastTrail }); // overwrites it with the opposite
                            }
                        }
                    />
                }
            />
            <FormDivider />
            <FormRow
                label='Copy Debug Info'
                subLabel={`Copy useful debug information of ${name} to clipboard.`}
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_rulebook_16px')} />}
                trailing={FormRow.Arrow}
                onPress={() => {
                    Clipboard.setString(debugInfo(version, release));
                    clipboardToast('debug information')
                }}
            />
        </FormSection>
        <FormDivider />
        <FormSection title="Source">
            <FormRow
                label="Download"
                subLabel={`Copy the link of ${name} to Clipboard`}
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('toast_copy_link')} />}
                trailing={FormRow.Arrow}
                onPress={() => {
                    Clipboard.setString(`${plugin[0].download}?${Math.floor(Math.random() * 1001)}.js`);
                    clipboardToast('download link')
                }}
            />
            <FormRow
                label="Source"
                subLabel={`Open the Repo of ${name} Externally`}
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_leave_stage')} />}
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