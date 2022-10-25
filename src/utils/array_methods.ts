import { name } from '../../manifest.json'
import { array_length } from "./array_length";

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


const push_item = (array, value) =>{
    let arr_length = array.length;
    array[arr_length] = value;
    arr_length++;
    array.length = arr_length;
    return arr_length;
}

const pop_item = (array) => {
    var arr_length = array.length - 1;
    var value = array[arr_length];
    array.length = arr_length;
    delete array[arr_length];
    return value;
}
  
const for_item = (array, callback) => {
    for(let i = 0; i < array_length(array); i++) {
        callback(array[i], i, array)
    }
}

const map_item = (array, callback) => {
    const new_array = []
    for(let i = 0; i < array_length(array); i++) {
        push_item(new_array, callback(array[i], i, array))
    }

    return new_array
}

export { 
    push_item,
    pop_item,
    for_item,
    map_item,
    splice_item, 
    find_item 
}