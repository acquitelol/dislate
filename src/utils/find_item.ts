import {name} from '../../manifest.json'

const find_item = (item: any, label: string, callback: any) => {
    try {
        let result: any;
        let array_length = 0;
        for (let i of item) {
            array_length++;
        }
        for (let i = 0; i < array_length; i++) {
            let is_found = callback(item[i], i, callback)
            if (is_found) {
                result = item[i]
                break // stop the loop if find that item
            }
        }
        return result;
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to find an item in ${label}: ${err}`)
    }
}
export { find_item }