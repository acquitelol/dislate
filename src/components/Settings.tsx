import { FormDivider, FormRow, ScrollView, FormSwitch, FormSection, FormSelect } from 'enmity/components';
import { SettingsStore, getBoolean } from 'enmity/api/settings';
import { getIDByName } from 'enmity/api/assets';
import { React, Toasts, Constants, StyleSheet } from 'enmity/metro/common';
import {name, version, release} from '../../manifest.json';
import { bulk, filters} from 'enmity/metro';
import names from 'translate/src/languages/names'

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
        }
    });
    var apiOptions = ["deepl", "libre", "yandex"];
    var engineLangTo = Object.keys(names)
    var engines =<FormSection title={"Engine: " + settings?.get("DislateLangEngine", apiOptions[0]) ?? "N/A"}>
        <FormSelect 
            options={apiOptions} 
            onChange={(value: string) => { settings?.set("DislateTo", null); 
                                           settings?.set("DislateEngine", value)}} 
            value={settings?.get("DislateLangEngine", apiOptions[0])} />
    </FormSection>

    var transTo = <FormSection title={"Translate To: " + settings?.get("DislateLangTo", engineLangTo[0]) ?? "N/A"}>
        <FormSelect 
            options={engineLangTo} 
            onChange={(value: string) => settings?.set("DislateLangTo", value)} 
            value={settings?.get("DislateLangTo", engineLangTo[0])} 
        />
    </FormSection>

   return <>
    <ScrollView>
        {engines}
        <FormDivider />
        {transTo}
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