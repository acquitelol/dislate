import {name} from '../../manifest.json'
import { array_length } from './array_length';

const splice_item = ( original_array: any, insert: any, insert_index: any, label: any) => {
    try {
        if (!original_array) return undefined

        // length of the array
        let arr_length = array_length(original_array)

        // element to be inserted
        let element_to_insert = insert
    
        // position at which element
        // is to be inserted
        let position_to_insert = insert_index
    
        // increase the size by 1
        arr_length++
        position_to_insert++;

        // shift elements forward
        for (let i = arr_length - 1; i >= position_to_insert; i--) {
            original_array[i] = original_array[i - 1];
        }
        // insert x at pos
        original_array[position_to_insert - 1] = element_to_insert;
        return
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to use the insert method at ${label}: ${err}`)
        return
    }
};

export { splice_item }
