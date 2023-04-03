import { get } from 'enmity/api/settings';
import { FormDivider, Text, TouchableOpacity, View } from 'enmity/components';
import { getByName, getByProps } from 'enmity/metro';
import { React } from 'enmity/metro/common';
import { name } from '../../../../manifest.json';
import { Miscellaneous, Debug, Format, Store, Icons } from '../../../common';
import InfoItem from './DebugItem';
import Dialog from '../../Modals/Dialog';
import SectionWrapper from '../../Wrappers/SectionWrapper';
import { ScrollView } from 'enmity/components';
import { Toasts } from 'enmity/metro/common';
import { styles } from './Debug.styles';
import { DebugProps } from '../../../def';

const Search = getByName("StaticSearchBarContainer");
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");

export default ({ onConfirm, type }: DebugProps) => {
    const [options, setOptions] = React.useState<string[]>([]);
    const [query, setQuery] = React.useState<string>("");

    React.useEffect(async function() {
        setOptions(await Debug.fetchDebugArguments());
    }, []);
    
    return <ScrollView style={styles.pageContainer}>
        <View style={[styles.searchWrapper, { ...Miscellaneous.shadow(0.05) }]}>
            <View style={styles.searchContainer}>
                <Search
                    placeholder="Search..."
                    style={styles.search}
                    inputStyle={styles.search}
                    onChangeText={(text: string) => setQuery(text)}
                    collapsable
                    value={query}
                />
            </View>
            <TouchableOpacity 
                style={styles.titleContainer}
                onPress={() => {
                    Object.keys(options).forEach((option: string) => {
                        Object.keys(options[option]).forEach((subOption: string) => {
                            Store.item(
                                {
                                    name: option,
                                    content: { ...(get(name, option) as Object), [subOption]: false },
                                    type: "setting",
                                    override: ({})
                                }
                            )
                        })
                    })

                    LazyActionSheet.hideActionSheet()
                    Toasts.open({
                        content: "Successfully cleared all debug options.",
                        source: Icons.Delete
                    })
            }}>
                <Text style={styles.title}>Clear All</Text>
            </TouchableOpacity>
            
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={async function() {
                    await onConfirm(await Debug.debugInfo(await Debug.fetchDebugArguments()), 'full debug log');
                }
            }>
                <Text style={[styles.text, styles.buttonText]}>{Format.string(type ?? "send")} All</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={async function() {
                    const debugOptions = Object.keys(options)
                        .map((option: string) => ({ [option]: (get(name, option, {}) as object ?? {}) }))
                        .reduce((acc, obj) => ({ ...acc, ...obj }), {})
            
                    await onConfirm(await Debug.debugInfo(debugOptions), 'partial debug log');
                }
            }>
                <Text style={[styles.text, styles.buttonText]}>{Format.string(type ?? "send")} Message</Text>
            </TouchableOpacity>
        </View>

        {Object.keys(options).map((option: string) => <SectionWrapper label={option}>
            <View style={styles.container}>
                {Object.keys(options[option])
                    .filter((subOption: string) => {
                        if (query) {
                            return subOption.toLowerCase().includes(query)
                        }
                        return subOption
                    })
                    .map((subOption: string, index: number, array: any[]) => <>
                        <InfoItem 
                            option={subOption}
                            parent={option}
                            debugOptions={options} 
                            onConfirm={onConfirm}
                        />
                        {/**
                         * Only adds a FormDivider if the index of the item is not the last.
                         */}
                        {index !== (array.length - 1) ? <FormDivider/> : null}
                    </>)}
            </View>
        </SectionWrapper>)}
        
        {/**
         * @param {TSX} Dialog: Renders a custom Dialog implementation to display a tip to help you navigate the page.
         * @uses @param {type} standard
         */}
        <Dialog 
            label="Information" 
            content={`You can either tap on each item to toggle it and press "${Format.string(type ?? "send")} Message", or you can long-press on an item to only send that item.\n\nTo close this dialog, press on it.`} 
            type={'standard'}
        />
    </ScrollView>;
}