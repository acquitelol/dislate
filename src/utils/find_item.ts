import {name} from '../../manifest.json'

const find_item = (item: any, label: string, callback: any) => {
    try {
        let result: any;
        for (let i = 0; i < item.length; i++) {
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