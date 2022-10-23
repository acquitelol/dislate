import {name} from '../../manifest.json'

const find_item = (item: any, label: string, callback: any) => {
    try {
        let result: any[];
        let array_length = 0;
        for (let i of item) {
            array_length++;
        }
        for (let i = 0; i < array_length; i++) { 
            if (callback(item[i], i, callback)) {
                result.push(item[i])
                break // stop the loop if find that item
            }
        }
        return result[0];
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to find an item in ${label}: ${err}`)
    }
}
export { find_item }