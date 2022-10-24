import {name} from '../../manifest.json'
import { array_length } from './array_length'

const find_item = (item: any, label: string, callback: any) => {
    try {
        if (!item) return undefined

        // length of item/array
        let arr_length = array_length(item)

        for (let i = 0; i < arr_length; i++) { 
            if (callback(item[i], i, callback)) {
                return item[i]
            }
        }
        return undefined;
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to find an item in ${label}: ${err}`)
    }
}
export { find_item }