/**
 * Imports
 * @param {get}: Allows you to @arg retrieve Settings from your plugin file.
 * @param getByName: Allows you to fetch modules from in Discord by their name
 * @param React: The main React implementation to do functions such as @arg React.useState or @arg React.useEffect
 * @param name: The name of the plugin from @arg manifest.json. In this case, it's Dislate.
 * @param language_names: The full list of available full @arg {language names}, which can be mapped over and manipulated
 * @param filter_array: Replication/Custom implementation of the @arg Array.prototype.filter method
 * @param map_item: Replication/Custom implementation of the @arg Array.prototype.map method
 * @param Dialog: Custom Dialog implementation to display a floating Information pop-up at the bottom of your screen.
 * @param ExitWrapper: Used as a wrapped to place @arg components inside of a @arg ScrollView and allow closing the page by swiping to the right.
 */
import { get } from 'enmity/api/settings';
import { getByName } from 'enmity/metro';
import { React } from 'enmity/metro/common';
import { name } from '../../manifest.json';
import language_names from '../../modified/translate/src/languages/names';
import { filter_array, map_item } from '../utils/array_methods';
import Dialog from './Dialog';
import ExitWrapper from './ExitWrapper';
import LanguageItem from './LanguageItem';

/**
 * The main Search module, used to input text and store it. This is easy to make from scratch, but because Discord already made one I might aswell use it.
 * @param Search: The main Search Bar component
 */
const Search = getByName('StaticSearchBarContainer');

/**
 * Main Languages Page Component.
 */
export default () => {
    /**
     * States used throughout the Page
     * @param {Getter, Setter} languages: The list of available languages, populated by the @arg React.useEffect hook.
     * @param {Getter, Setter} query: The query that has been inputted by the user in the search box. By default this is []. and as @arg {[] == true}, which can be shown by logging @arg {!![]}, by default all options will be showing because the filter will evaluate to true on all instances.
     */
   const [languages, setLanguages] = React.useState([])
   const [query, setQuery] = React.useState([])

    /**
     * Populates the list of available @arg languages with a @arg useEffect hook to only set the state on the initial Mount of the component.
     */
    React.useEffect(() => {
        setLanguages(Object.keys(language_names))
    }, [])

    return <>
        {/**
          * The main search container. Any text that is inputted into this, will be stored into the query state, and filtered on re-render.
          */}
        <Search
            placeholder="Search Language"
            onChangeText={text => setQuery(text)}
        />
        {/**
         * The main part of the component, showing available options to toggle.
         * This is wrapped in an @arg ExitWrapper component to allow the user to close out the page by swiping to the right.
         */}
        <ExitWrapper Component={<>
            {/**
             * Renders a @arg LanguageItem component for each of the available languages. If the page opened was the language to translate to, then the "Detect" option will not be rendered at all.
             */}
            {map_item(
                filter_array(languages, (language: string) => language.toLowerCase().includes(query), 'getting searched languages'), 
                (language: string) => 
                (get(name, "DislateLangFilter") && language=='detect') 
                    ?   <></> 
                    :   <LanguageItem language={language}/>,
                "listing different possible languages"
            )}
        </>} />
         {/**
         * Renders a custom Dialog implementation to display a tip to help you navigate the page, and tells you that the current selected language has a tick next to it.
         */}
        <Dialog 
                label="Important" 
                content={`You can either tap or long-press on an item to select that item as the language to translate ${get(name, "DislateLangFilter")?'to':'from'}. Your current selected language has a ✓ next to it.\n\nTo hide this dialog, press on it.`} 
                type={'floating'}
        />
    </>;
};