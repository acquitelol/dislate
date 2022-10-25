import { name } from '../../manifest.json'
import { array_length } from "./array_length";

const find_item = (item: any, label: string, callback: any) => {
    try {
        // returns early if it cant find a valid item passed
        if (!item) return undefined

        // length of item/array
        let arr_length = array_length(item)

        // loops through and returns the first item that it finds which matches the callback criteria
        for (let i = 0; i < arr_length; i++) { 
            if (callback(item[i], i, callback)) {
                return item[i]
            }
        }
        // if it never returns then return undefined
        return undefined;
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to find an item in ${label}: ${err}`)
    }
}

const insert_item = ( original_array: any, insert: any, insert_index: any, label: any) => {
    try {
        // if it cant find an array then return undefined.
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
        return // return nothing
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to use the insert method at ${label}: ${err}`)
        return // return nothing to make sure it returns something on all code paths.
    }
};


const push_item = (array, value) =>{ 
    // get current array length
    let arr_length = array.length;

    // add another item to the array at the last position
    array[arr_length] = value;

    // iterate the length by 1
    arr_length++;

    // set the array length to the new length
    array.length = arr_length;

    // return it
    return arr_length;
}

const pop_item = (array) => {
    // get the length of the array -1
    var arr_length = array.length - 1;

    // get the last value of the array
    var value = array[arr_length];

    // set the array length to itself -1
    array.length = arr_length;

    // delete the value at that index
    delete array[arr_length];

    // return the value which was deleted
    return value;
}
  
const for_item = (array, callback) => {
    // loop through the array and run the callback for each iteration
    for(let i = 0; i < array_length(array); i++) {
        callback(array[i], i, array)
    }
}

const map_item = (array, callback) => {
    // start off with an empty array
    const new_array = []

    // loop through the array and push the return value of the callback to the new array
    for(let i = 0; i < array_length(array); i++) {
        push_item(new_array, callback(array[i], i, array))
    }

    // finally return the array
    return new_array
}

export { 
    push_item,
    pop_item,
    for_item,
    map_item,
    insert_item, 
    find_item 
}