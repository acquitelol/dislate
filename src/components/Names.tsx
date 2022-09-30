// main imports of elements and dependencies
import { FormRow, ScrollView } from 'enmity/components';
import { React, Toasts } from 'enmity/metro/common';
import { getByName } from 'enmity/metro'
import langNames from 'translate/src/languages/names'
import { Navigation } from 'enmity/metro/common'
import { get, set } from 'enmity/api/settings'
import { getIDByName } from 'enmity/api/assets';
import { formatString } from '../utils';

// main search module
const Search = getByName('StaticSearchBarContainer');

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
                    trailing={FormRow.Arrow}
                    onPress={() => {
                        // sets language to either "from" or "to" based on filter
                        get("Dislate", "DislateLangFilter") ? set('Dislate', "DislateLangTo", language) : set('Dislate', "DislateLangFrom", language)
                        // announces success with a toast
                        Toasts.open({ content: `Set ${(langNames[language]).toUpperCase()} as Language to Translate ${get("Dislate", "DislateLangFilter") ? "to" : "from"}.`, 
                            source: get("Dislate", "DislateLangFilter") ? getIDByName('ic_activity_24px') : getIDByName('ic_raised_hand')
                        })
                        // closes the page
                        Navigation.pop()
                    }}
                />
            )}
        </ScrollView>  
    </>;
};