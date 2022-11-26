/**
 * Imports
 * @param Storage: Allows you to store and retrieve data asynchronously.
 * @param find_item: Allows you to filter for a specific item.
 * @param try_callback: Wraps a function in a try-catch.
 * @param name: The name of the plugin.
 * @param set: Allows you to store a setting in the plugin file.
 */
import { Storage } from 'enmity/metro/common';
import { find_item } from './array_methods'
import { try_callback } from './try_callback';
import { name } from '../../manifest.json'
import { set } from 'enmity/api/settings';

/**
 * Stores an item into storage or settings depending on the type provided in the item, and then stores it in a store in settings so it can be cleared easily.
 * @param item: The item that will be used as a parameter in the function. Must have a name, content, and type.
 * @param label: Optional label, to determine what the function does. This may be undefined.
 */
async function store_item(item: { name: string; content: any; type: string; }, label?: string) {
    await try_callback(async function() {
        /**
         * Either sets the item in Storage to never show again or sets the item in Settings to true, depending on the type passed in @arg item
         * @param item.type: The type of item to store, possible options are @arg storage and @arg setting
         * @param item.name: The name of the item to store, this would be the label or whatever.
         */
        item.type==="storage"
            ?   await Storage.setItem(item.name, item.content)
            :   set(name, item.name, item.content)

        /**
         * Fetch the current store from storage. If it hasn't stored anything yet, then make the store an empty array.
         * @param state_store: The current store available for clearing later.
         */
        const state_store: any[] = await Storage.getItem("dislate_store_state") ?? []

        /**
         * Attempt to find the item in the store already, to not push it twice then clear it twice and waste resources.
         */
        !find_item(state_store, (state_item: any) => state_item.name===item.name, 'finding existing label in store state')
            ?   state_store.push(item)
            :   null

        /**
         * Finally, set the store back to the original store state.
         */
        await Storage.setItem("dislate_store_state", JSON.stringify(state_store)) 
    }, [item], name, 'storing an item in plugin file or storage at', label) 
}

export { store_item }