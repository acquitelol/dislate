import {name} from '../../manifest.json'

const find_item = (item: any, callback: any) => {
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
    } catch {
        console.warn(`[${name}] Some error happened when attempting to find an element.`)
    }
}
export { find_item }