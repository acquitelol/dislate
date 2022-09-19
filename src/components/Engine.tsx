import { FormRow, ScrollView, Image } from 'enmity/components';
import { React, Toasts } from 'enmity/metro/common';
import { getByProps, getByName } from 'enmity/metro'
import { Navigation } from 'enmity/metro/common'
import { get, set } from 'enmity/api/settings'

const Search = getByName('StaticSearchBarContainer');

export default () => {
   const [engines, setEngines] = React.useState([])
   const [query, setQuery] = React.useState([])

   React.useEffect(() => {
      let enginesArr: string[] = ["deepl", "libre", "yandex"];
      setEngines(enginesArr)
   }, [])

   
   return <>
      <Search
         placeholder="Search Language"
         onChangeText={text => setQuery(text)}
      />
      <ScrollView>
         {engines.filter(engine => engine.includes(query)).map(engine => 
            <FormRow 
               label={engine}
               onPress={() => {
                    set('Dislate', "DislateLangEngine", engine)
                    Navigation.pop()
               }}
            />
         )}
      </ScrollView>  
   </>;
};