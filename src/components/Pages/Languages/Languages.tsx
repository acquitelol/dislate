import { get } from 'enmity/api/settings';
import { FlatList, RefreshControl, ScrollView, View } from 'enmity/components';
import { getByName } from 'enmity/metro';
import { React } from 'enmity/metro/common';
import { name } from '../../../../manifest.json';
import Dialog from '../../Modals/Dialog';
import LanguageItem from './LanguageItem';
import LanguageNamesArray from "../../../translate/languages/names"
import ISO from "../../../translate/languages/iso"
import { LanguagesProps } from '../../../def';

const Search = getByName('StaticSearchBarContainer');
export default ({ languages }: LanguagesProps) => {
    const [query, setQuery] = React.useState([]);
    const [languageList, setLanguageList] = React.useState(languages);
    const [refreshing, setRefreshing] = React.useState(false);
    const [selected, setSelected] = React.useState(get(name, `DislateLang${get(name, "DislateLangFilter") ? "To" : "From"}`));

    return <View style={{ marginBottom: 50 }}>
        <Search
            placeholder="Search Language"
            onChangeText={(text: string) => setQuery(text)}
        />
        <ScrollView
            /**
             * @param RefreshControl: Refreshes the list of languages and gets the new list from the JSON files. In general, this will not change anything.
             */
            refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={async function() {
                    setRefreshing(true);
                    setLanguageList(Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] }))));
                    setRefreshing(false);
                }}
            />}
        >
            <View style={{ paddingBottom: 30 }}>
                <FlatList
                    data={Object.keys(languageList).filter((language: string) => language.toLowerCase().includes(query))}
                    renderItem={({ item }) => (get(name, "DislateLangFilter") && item=='detect') 
                        ? <></> 
                        : <LanguageItem 
                            language={item} 
                            languages={languageList}
                            selected={selected} 
                            setSelected={setSelected}
                        />}
                    keyExtractor={language => language}
                />
            </View>
        </ScrollView>
        <Dialog 
            label="Important" 
            content={`You can either press or long-press on an item to select it as the language to translate ${get(name, "DislateLangFilter")?'to':'from'}. Your current selected language has a ✓ next to it.\n\nTo hide this dialog, press on it.`} 
            type={'floating'}
        />
    </View>;
};