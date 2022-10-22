// main imports of elements and dependencies
import { FormRow, ScrollView, View } from 'enmity/components';
import { React, Toasts } from 'enmity/metro/common';
import { getByName } from 'enmity/metro'
import langNames from 'translate/src/languages/names'
import { Navigation } from 'enmity/metro/common'
import { get, set } from 'enmity/api/settings'
import { formatString, Icons } from '../utils';
import {name} from '../../manifest.json';

// main search module
const Search = getByName('StaticSearchBarContainer');
const dislateArrow = FormRow.Arrow

export default () => {
    // main languages and keyword search state
   const [languages, setLanguages] = React.useState([])
   const [query, setQuery] = React.useState([])

   // only sets it once
   React.useEffect(() => {
      let names: string[] = Object.keys(langNames)
      setLanguages(names)
   }, [])

    return <>
        <Search
            placeholder="Search Language"
            onChangeText={text => setQuery(text)}
        />
        <ScrollView>
            {languages.filter(language => language.includes(query)).map(language => 
            (get("Dislate", "DislateLangFilter") && language=='detect') ? <></> :
                <FormRow
                    label={formatString(language)}
                    trailing={dislateArrow}
                    onPress={() => {
                        // sets language to either "from" or "to" based on filter
                        get(name, "DislateLangFilter") ? set('Dislate', "DislateLangTo", language) : set('Dislate', "DislateLangFrom", language)
                        // announces success with a toast
                        Toasts.open({ content: `Set ${(langNames[language]).toUpperCase()} as Language to Translate ${get("Dislate", "DislateLangFilter") ? "to" : "from"}.`, 
                            source: get("Dislate", "DislateLangFilter") ? Icons.Settings.Translate_To : Icons.Settings.Translate_From
                        })
                        // closes the page
                        Navigation.pop()
                    }}
                />
            )}
        </ScrollView>  
    </>;
};