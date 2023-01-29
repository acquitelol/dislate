/** 
 * Imports 
 * @param {string} name: The name from manifest.json.
 * @param tryCallback: Function to wrap another function in a try-catch
 */
import { name } from '../../manifest.json';
import tryCallback from './try_callback';

/** 
 * Finds an item in an array
 * @param array: The item to find.
 * @param callback: A function which is ran to find the item.
 * @param label: A label which is used to determine what the function does
 * @returns (@param { T | undefined }): Logs either the item found or undefined if nothing found
 */
const findItem = <T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean | undefined, label?: string): T | undefined => {
    return tryCallback(() => {
        /** 
         * Returns early if it cannot find a valid array.
         * @param { T[] | undefined } array: The array of items which is searched through
         */
        if (!array) return undefined

        /** 
         * Loops through the array of items
         * @param { T[] } array: The array to loop through
         * @param { (item: T, index: number, array: T[]) => boolean } callback: The function to run for each iteration
         * @param { number } i: The iterator
         */
        for (let i = 0; i < array.length; i++) { 
            if (callback(array[i], i, array)) {
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
 * @param {any[]} originalArray: The array provided
 * @param {any} insert: The item to insert
 * @param {number} insertIndex: The index to insert the item
 * @param {string?} label?: The label of the place where the item is being inserted. This is optional.
 * @returns {number}
 */
const insertItem = (originalArray: any[], insert: any, insertIndex: number, label?: string): number => {
    return tryCallback(() => {
        /** 
         * Returns early if it cannot find a valid array.
         * @param {any[] || undefined} originalArray: The array of items which is searched through
         */
        if (!originalArray) return undefined
    
        /**
         * Increment the length and index by 1
         */
        originalArray.length++;
        insertIndex++;

        /** 
         * Shift all of the elements forward
         * @uses @param {any[] || undefined} originalArray: The provided array
         * @uses @param {number} insertIndex: The index to insert the item
         */
        for (let i = originalArray.length - 1; i >= insertIndex; i--) {
            originalArray[i] = originalArray[i - 1];
        }

        /**
         * Insert the item into the array at the correct position
         * @uses @param {any} insert: The item to insert into the array
         */
        originalArray[insertIndex - 1] = insert;

        /**
         * Finally, return the new array's length.
         */
        return originalArray.length
    }, [originalArray, insert, insertIndex], name, "insert an item at", label)
}

/** 
 * Loops through an array and only adds the items on which the callback returns true. Returns a filtered array.
 * @param {any[]} array: The original array 
 * @param {any} callback: The callback to check if it exists for each iteration
 * @param {string?} label?: Optional label to describe what the function was used for
 * @returns {any[] newArray}
 */
const filterItem = (array: any[], callback: any, label?: string): any[] => {
    return tryCallback(() => {
        /** 
         * Start off with an empty array
         * @param {any[]} newArray: Empty array
         */
        let newArray = []

        /** 
         * Loop through the array and run the callback at each iteration, then push the return value to the new array if it returns a truthy value
         * @param {number} i: The iteration
         * @param {any[]} array: The array provided
         * @param {any} callback: The function to run
         * 
         * @uses @func insertItem: Insert an item into an array reference with the index provided
         */
        for (let i = 0; i < array.length; i++) {
            /** 
             * Returns early if value is undefined
             * @param {any} array[i]: The value to push
             */
            if (callback(array[i], i, array)) insertItem(newArray, array[i], newArray.length, 'filtering an array');
        }

        /** 
         * Finally return the new array
         * @returns {any[] newArray}
         */
        return newArray
    }, [array, callback], name, "filtering an array at", label)
}

/** 
 * Loops through an array of items and runs a callback for each iteration.
 * @param {any[]} array: The array to loop through.
 * @param {any} callback: The function to run at each iteration.
 * @param {string?} label?: Optional label to descibe what the function is doing
 * @returns {void}
 */
const forItem = (array: any[], callback: any, label?: string): void => {
    tryCallback(() => {
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
 * Loops through an array of items and runs a callback for each iteration.
 * @param {any[]} array: The array to loop through.
 * @param {any} callback: The function to run at each iteration.
 * @param {string?} label?: Optional label to descibe what the function is doing
 * @returns {void}
 */
async function forItemAsync(array: any[], callback: any, label?: string): Promise<void> {
    await tryCallback(async function() {
        /** 
         * Loop through the array and run the callback at each iteration
         * @param {number} i: The iteration
         * @param {any[]} array: The array provided
         * @param {any} callback: The function to run
         */
        for(let i = 0; i < array.length; i++) {
            await callback(array[i], i, array)
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
const mapItem = <T>(array: T[], callback: any, label?: string): any[] => {
    return tryCallback(() => {
        /** 
         * Start off with an empty array.
         * @param {any[]} newArray: The array to start with.
         */
        let newArray = []

        /** 
         * Loop through the array and run the callback at each iteration, then push the return value to the new array
         * @param {number} i: The iteration
         * @param {any[]} array: The array provided
         * @param {any} callback: The function to run
         * 
         * @uses @func insertItem: Insert an item into an array reference with the index provided
         */
        for(let i = 0; i < array.length; i++) {
            insertItem(newArray, callback(array[i], i, array), newArray.length)
        }

        /** 
         * Finally, return the array
         * @param newArray
         */
        return newArray
    }, [array, callback], name, 'map an array at', label)
};

export default {
    filterItem,
    findItem,
    forItem,
    forItemAsync,
    mapItem,
    insertItem
};