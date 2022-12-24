/** 
 * Imports 
 * @param {string} name: The name from manifest.json.
 * @param try_callback: Function to wrap another function in a try-catch
 */
import { name } from '../../manifest.json';
import { try_callback } from './try_callback';

/** 
 * Finds an item in an array
 * @param array: The item to find.
 * @param callback: A function which is ran to find the item.
 * @param label: A label which is used to determine what the function does
 * @returns (@param { any || undefined }): Logs either the item found or undefined if nothing found
 */
const find_item = (array: any[], callback: any, label?: string): any | undefined => {
    return try_callback(() => {
        /** 
         * Returns early if it cannot find a valid array.
         * @param {any || undefined} array: The array of items which is searched through
         */
         if (!array) return undefined

         /** 
          * Loops through the array of items
          * @param {any[]} array: The array to loop through
          * @param {any} callback: The function to run for each iteration
          * @param {number} i: The iterator
          */
         for (let i = 0; i < array.length; i++) { 
            if (callback(array[i], i, callback)) {
                return array[i]
            }
         }
 
         /**
          * Return @arg undefined if it finishes the iterations and cannot find a valid item to return.
          */
         return undefined;
    }, [array, callback], name, "find an item at", label)
}

/** 
 * Inserts an item into a given array
 * @param {any[]} original_array: The array provided
 * @param {any} insert: The item to insert
 * @param {number} insert_index: The index to insert the item
 * @param {string?} label?: The label of the place where the item is being inserted. This is optional.
 * @returns {number}
 */
const insert_item = (original_array: any[], insert: any, insert_index: number, label?: string): number => {
    return try_callback(() => {
        /** 
         * Returns early if it cannot find a valid array.
         * @param {any[] || undefined} original_array: The array of items which is searched through
         */
         if (!original_array) return undefined
    
         /**
          * Increment the length and index by 1
          */
         original_array.length++;
         insert_index++;
 
         /** 
          * Shift all of the elements forward
          * @uses @param {any[] || undefined} original_array: The provided array
          * @uses @param {number} insert_index: The index to insert the item
          */
        for (let i = original_array.length - 1; i >= insert_index; i--) {
            original_array[i] = original_array[i - 1];
        }

        /**
         * Insert the item into the array at the correct position
         * @uses @param {any} insert: The item to insert into the array
         */
        original_array[insert_index - 1] = insert;

        /**
         * Finally, return the new array's length.
         */
        return original_array.length
    }, [original_array, insert, insert_index], name, "insert an item at", label)
};

/** 
 * Loops through an array and only adds the items on which the callback returns true. Returns a filtered array.
 * @param {any[]} array: The original array 
 * @param {any} callback: The callback to check if it exists for each iteration
 * @param {string?} label?: Optional label to describe what the function was used for
 * @returns {any[] new_array}
 */
const filter_item = (array: any[], callback: any, label?: string): any[] => {
    return try_callback(() => {
        /** 
         * Start off with an empty array
         * @param {any[]} new_array: Empty array
         */
        let new_array = []

        /** 
         * Loop through the array and run the callback at each iteration, then push the return value to the new array if it returns a truthy value
          * @param {number} i: The iteration
          * @param {any[]} array: The array provided
          * @param {any} callback: The function to run
          * 
          * @uses @func insert_item: Insert an item into an array reference with the index provided
          */
        for (let i = 0; i < array.length; i++) {
            /** 
             * Returns early if value is undefined
             * @param {any} array[i]: The value to push
             */
            if (callback(array[i], i, array)) insert_item(new_array, array[i], new_array.length, 'filtering an array');
        }

        /** 
         * Finally return the new array
         * @returns {any[] new_array}
         */
        return new_array
    }, [array, callback], name, "filtering an array at", label)
}


/** 
 * Loops through an array of items and runs a callback for each iteration.
 * @param {any[]} array: The array to loop through.
 * @param {any} callback: The function to run at each iteration.
 * @param {string?} label?: Optional label to descibe what the function is doing
 * @returns {void}
 */
const for_item = (array: any[], callback: any, label?: string): void => {
    try_callback(() => {
        /** 
         * Loop through the array and run the callback at each iteration
         * @param {number} i: The iteration
         * @param {any[]} array: The array provided
         * @param {any} callback: The function to run
         */
         for(let i = 0; i < array.length; i++) {
            callback(array[i], i, array)
        }
    }, [array, callback], name, 'loop through an array at', label)
}

/** 
 * Loops through an array, runs a callback for each iteration, and pushes the result of that callback to a new array
 * @param {any[]} array: The starting array
 * @param {any} callback: The function to run
 * @param {string} label: Optional label to descibe what the function is doing
 * @returns {<array>}
 */
const map_item = (array: any[], callback: any, label?: string): any[] => {
    return try_callback(() => {
        /** 
         * Start off with an empty array.
         * @param {any[]} new_array: The array to start with.
         */
        let new_array = []

        /** 
         * Loop through the array and run the callback at each iteration, then push the return value to the new array
         * @param {number} i: The iteration
         * @param {any[]} array: The array provided
         * @param {any} callback: The function to run
         * 
         * @uses @func insert_item: Insert an item into an array reference with the index provided
         */
        for(let i = 0; i < array.length; i++) {
            insert_item(new_array, callback(array[i], i, array), new_array.length)
        }
 
        /** 
         * Finally, return the array
         * @param new_array
         */
        return new_array
    }, [array, callback], name, 'map an array at', label)
}

export { 
    filter_item,
    for_item,
    map_item,
    insert_item, 
    find_item
}