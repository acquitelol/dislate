import { get, getBoolean, set } from "enmity/api/settings";
import { FormRow, View, Text } from "enmity/components";
import { React } from "enmity/metro/common";
import { Format, Icons, Miscellaneous } from "../../common";
import { styles } from "./Settings.styles";
import { LanguageRowProps } from '../../def';
import { Languages } from "../Pages";

export default function LanguageRow({ manifest, renderPage, Navigation, languages, kind }: LanguageRowProps) {
    return <FormRow
        label={`Translate ${Format.string(kind)}`}
        leading={<FormRow.Icon style={styles.icon} source={kind === "to" ? Icons.Settings.TranslateTo : Icons.Settings.TranslateFrom} />}
        trailing={() => <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text adjustsFontSizeToFit={true} style={styles.item}>
                {Format.string(get(manifest.name, `DislateLang${Format.string(kind)}`, "detect") as string) ?? "N/A"}
            </Text>
            <FormRow.Arrow />
        </View>}
        onPress={()=>{
            set(manifest.name, "DislateLangFilter", kind === "to")
            renderPage(Navigation, {
                pageName: `Translate ${getBoolean(manifest.name, "DislateLangFilter", true) ? "To" : "From"}`,
                pagePanel: (): any => <Languages languages={languages} />
            })
        }}
        onLongPress={() => Miscellaneous.displayToast('Open a new page allowing you to choose a language that you can translate from. The default is "Detect".', 'tooltip')}
    />
}