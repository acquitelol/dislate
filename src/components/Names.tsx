import { FormRow, ScrollView, Image } from 'enmity/components';
import { React, Toasts } from 'enmity/metro/common';
import { getByProps, getByName } from 'enmity/metro'
import langNames from 'translate/src/languages/names'
import { Navigation } from 'enmity/metro/common'
import { get, set } from 'enmity/api/settings'

const Search = getByName('StaticSearchBarContainer');

export default () => {
   const [languages, setLanguages] = React.useState([])
   const [query, setQuery] = React.useState([])

   React.useEffect(() => {
      let names: string[] = Object.keys(langNames)
      setLanguages(names)
   }, [])

    const getCapitalised = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return <>
        <Search
            placeholder="Search Language"
            onChangeText={text => setQuery(text)}
        />
        <ScrollView>
            {languages.filter(language => language.includes(query)).map(language => 
                <FormRow 
                    label={getCapitalised(language)}
                    onPress={() => {
                        set('Dislate', "DislateLangTo", language)
                        Navigation.pop()
                    }}
                />
            )}
        </ScrollView>  
    </>;
};