/**
 * Imports
 * @param { get }: Allows you to @arg retrieve Settings from your plugin file.
 * @param getByName: Allows you to fetch modules from in Discord by their name
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param name: The name of the plugin from @arg manifest.json. In this case, it's Dislate.
 * @param LanguageNames: The full list of available full @arg {language names}, which can be mapped over and manipulated
 * @param ArrayOps.filterItem: Replication/Custom implementation of the @arg Array.prototype.filter method
 * @param ArrayOps.mapItem: Replication/Custom implementation of the @arg Array.prototype.map method
 * @param Dialog: Custom Dialog implementation to display a floating Information pop-up at the bottom of your screen.
 */
import { get } from 'enmity/api/settings';
import { FlatList, RefreshControl, ScrollView, View } from 'enmity/components';
import { getByName } from 'enmity/metro';
import { React } from 'enmity/metro/common';
import { name } from '../../../../manifest.json';
import { ArrayImplementations as ArrayOps } from '../../../common';
import Dialog from '../../Modals/Dialog';
import LanguageItem from './LanguageItem';
import LanguageNamesArray from "../../../translate/languages/names"
import ISO from "../../../translate/languages/iso"

/**
 * The main Search module, used to input text and store it. This is easy to make from scratch, but because Discord already made one I might aswell use it.
 * @param Search: The main Search Bar component
 */
const Search = getByName('StaticSearchBarContainer');

/**
 * Main Languages Page Component.
 */
export default ({ languages, Navigator }) => {
    /**
     * States used throughout the Page
     * @param {Getter, Setter} languages: The list of available languages, populated by the @arg React.useEffect hook.
     * @param {Getter, Setter} query: The query that has been inputted by the user in the search box. By default this is []. and as @arg {[] == true}, which can be shown by logging @arg {!![]}, by default all options will be showing because the filter will evaluate to true on all instances.
     * @param {Getter, Setter} refreshing: Whether the language list is refreshing or not.
     */
    const [query, setQuery] = React.useState([]);
    const [languageList, setLanguageList] = React.useState(languages);
    const [refreshing, setRefreshing] = React.useState(false);
    const Navigation = Navigator.useNavigation();

    return <View style={{ marginBottom: 50 }}>
        {/**
          * The main search container. Any text that is inputted into this, will be stored into the query state, and filtered on re-render.
          */}
        <Search
            placeholder="Search Language"
            onChangeText={(text: string) => setQuery(text)}
        />
        {/**
         * The main part of the component, showing available options to toggle.
         */}
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
        />}>
            <View style={{ paddingBottom: 30 }}>
                {/**
                 * Renders an @arg LanguageItem component for each of the available languages. If the page opened was the language to translate to, then the "Detect" option will not be rendered at all.
                 */}
                <FlatList
                    data={ArrayOps.filterItem(Object.keys(languageList), (language: string) => language.toLowerCase().includes(query), 'getting searched languages')}
                    renderItem={({ item }) => (get(name, "DislateLangFilter") && item=='detect') 
                        ? <></> 
                        : <LanguageItem language={item} languages={languageList} Navigation={Navigation} />}
                    keyExtractor={language => language}
                />
            </View>
        </ScrollView>
         {/**
         * Renders a custom Dialog implementation to display a tip to help you navigate the page, and informs you that the current selected language has a tick next to it.
         */}
        <Dialog 
            label="Important" 
            content={`You can either press or long-press on an item to select it as the language to translate ${get(name, "DislateLangFilter")?'to':'from'}. Your current selected language has a ✓ next to it.\n\nTo hide this dialog, press on it.`} 
            type={'floating'}
        />
    </View>;
};