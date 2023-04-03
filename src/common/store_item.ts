import { Storage } from 'enmity/metro/common';
import tryCallback from './try_callback';
import { name } from '../../manifest.json'
import { set } from 'enmity/api/settings';
import { get } from 'enmity/api/settings';

async function item(item: { 
    name: string; 
    content: any; 
    type: string; 
    override?: any;
}, label?: string) {
    await tryCallback(async function() {
        item.type==="storage"
            ?   await Storage.setItem(item.name, JSON.stringify(item.content))
            :   set(name, item.name, item.content)

        const stateStore: any[] = JSON.parse((get(name, "state_store", null) as string) ?? "[]")

        if (!stateStore.find((stateItem: any) => stateItem.name===item.name))
            stateStore.push(item)

        set(name, "state_store", JSON.stringify(stateStore))
    }, [item], name, 'storing an item in plugin file or storage at', label) 
};

export default { item };