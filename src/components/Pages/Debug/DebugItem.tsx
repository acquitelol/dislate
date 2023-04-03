import { get } from "enmity/api/settings";
import { FormRow, Text } from "enmity/components";
import { React } from "enmity/metro/common";
import { Icons, Debug, Store } from "../../../common";
import { name } from '../../../../manifest.json';
import { styles } from "./DebugItem.styles";
import { DebugItemProps } from "../../../def";

export default ({ option, parent, debugOptions, onConfirm }: DebugItemProps) => {
    const [active, setActive] = React.useState<boolean>((get(name, parent, {}) as object)[option]);

    React.useEffect(() => {
        const parentData = get(name, parent, {}) as object;
        if (!parentData[option]) {
            Store.item(
                {
                    name: parent,
                    content: { ...parentData, [option]: false },
                    type: "setting",
                    override: ({})
                }
            )
        }
    }, [])

    return <FormRow
        key={option}
        label={option}
        onPress={() => {
            const parentData = get(name, parent, {}) as object;
            Store.item(
                {
                    name: parent,
                    content: { ...parentData, [option]: !parentData[option] },
                    type: "setting",
                    override: ({})
                }
            )

            setActive((get(name, parent, {}) as object)[option]);
        }}
        onLongPress={async function() {
            await onConfirm(await Debug.debugInfo({ [parent]: { [option]: true }}), `${parent} ➝ ${option}`);
        }}
        leading={<FormRow.Icon 
            style={styles.icon} 
            source={
                active
                    ?   Icons.Settings.Toasts.Settings
                    :   Icons.Settings.Toasts.Failed
            } 
        />}
        trailing={() => <Text style={[
            { paddingTop: 5, paddingBottom: 5, paddingRight: 10 }, 
            active ? styles.enabled : styles.disabled
        ]}>
            {debugOptions[parent][option]}
        </Text>}
    />
}