import { FormDivider, FormRow, ScrollView, FormSwitch, FormSection, FormSelect, Text, Form } from 'enmity/components';
import { SettingsStore, getBoolean } from 'enmity/api/settings';
import { getIDByName } from 'enmity/api/assets';
import { React, Toasts, Constants, StyleSheet } from 'enmity/metro/common';
import {name, version, release} from '../../manifest.json';
import { bulk, filters} from 'enmity/metro';
import { Navigation } from 'enmity/metro/common'
import Page from './Page'
import Names from './Names'
import Engine from './Engine'
import { get, set } from 'enmity/api/settings'

interface SettingsProps {
   settings: SettingsStore;
}

const [
    Router,
    Clipboard,
 ] = bulk(
    filters.byProps('transitionToGuild'),
    filters.byProps('setString'),
 );

export default ({ settings }: SettingsProps) => {
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
                label='Current Language'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('Check')} />}
                trailing={() => <Text style={styles.item}>
                    {get("Dislate", "DislateLangTo", "japanese") ?? "N/A"}
                </Text>}
                onPress={()=>{
                    Navigation.push(Page, { component: Names, name: "Dislate: Language" })
                }}
            />
            <FormDivider/>
            <FormRow
                label='Current Engine'
                leading={<FormRow.Icon style={styles.icon} source={getIDByName('Check')} />}
                trailing={() => <Text style={styles.item}>
                    {get("Dislate", "DislateLangEngine", "deepl") ?? "N/A"}
                </Text>}
                onPress={()=>{
                    Navigation.push(Page, { component: Engine, name: "Dislate: Engines" })
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
                        value={settings.getBoolean('masterDisable', false)}
                        onValueChange={() => {
                                settings.toggle('masterDisable', false)
                                Toasts.open({ content: `Successfully ${settings.getBoolean('masterDisable', false) ? 'disabled' : 'enabled'} ${name}.`, source: toastTrail });
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