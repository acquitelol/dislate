// main imports of elements and dependencies
import { FormDivider, FormRow, ScrollView, FormSwitch, FormSection, Text } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { getIDByName } from 'enmity/api/assets';
import { React, Toasts, Constants, StyleSheet } from 'enmity/metro/common';
import {name, version, release} from '../../manifest.json';
import { bulk, filters} from 'enmity/metro';
import { Navigation } from 'enmity/metro/common'
import Page from './Page'
import Names from './Names'
import { get, set } from 'enmity/api/settings'

// main settingsStore interface
interface SettingsProps {
   settings: SettingsStore;
}

// main declaration of modules being altered by the plugin
const [
    Router,
    Clipboard,
 ] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
 );

 // adds capital letter to first character of a string
 const getCapitalised = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

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
    });

   return <>
    <ScrollView>
        <FormSection title="Language Settings">
            <FormRow
                label='Translate From'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_raised_hand')} />}
                trailing={() => <Text style={styles.item}>
                    {getCapitalised(get("Dislate", "DislateLangFrom", "english")) ?? "N/A"}
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
                    {getCapitalised(get("Dislate", "DislateLangTo", "japanese")) ?? "N/A"}
                </Text>}
                onPress={()=>{
                    // selects which route the page will overwrite: "from" being false and "to" being true
                    set("Dislate", "DislateLangFilter", true) // selects "to" route to be overwritten
                    Navigation.push(Page, { component: Names, name: "Dislate: Language To" }) // opens custom page with languages
                }}
            />
        </FormSection>
        <FormDivider />
		<FormSection title="Disable Entire Plugin">
            <FormRow
                label='Disable Plugin'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_rulebook_16px')} />}
                trailing={
                    <FormSwitch
                        value={settings.getBoolean('masterDisable', false)} // main masterDisable function
                        onValueChange={() => {
                                settings.toggle('masterDisable', false)
                                Toasts.open({ content: `Successfully ${settings.getBoolean('masterDisable', false) ? 'disabled' : 'enabled'} ${name}.`, source: toastTrail }); // overwrites it with the opposite
                            }
                        }
                    />
                }
            />
        </FormSection>
        <FormDivider />
        <FormSection title="Source Code">
            <FormRow
                label="Download"
                subLabel={`Copy the link of ${name} to Clipboard`}
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('toast_copy_link')} />}
                trailing={FormRow.Arrow}
                onPress={() => {
                    Clipboard.setString("https://raw.githubusercontent.com/acquitelol/dislate/main/dist/Dislate.js");
                    Toasts.open({ content: 'Copied to clipboard', source: getIDByName('pending-alert') });
                }}
            />
            <FormRow
                label="Source"
                subLabel={`Open the Repo of ${name} Externally`}
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('ic_leave_stage')} />}
                trailing={FormRow.Arrow}
                onPress={() => {
                    Router.openURL("https://github.com/acquitelol/dislate")
                }}
            />
        </FormSection>
		<FormRow label={`Plugin Version: ${version}
Release Channel: ${release}`} />
    </ScrollView>
   </>
};