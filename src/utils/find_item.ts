import {name} from '../../manifest.json'

const find_item = (item: any, label: string, callback: any) => {
    try {
        let array_length = 0;
        for (let i of item) {
            array_length++;
        }

        for (let i = 0; i < array_length; i++) { 
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