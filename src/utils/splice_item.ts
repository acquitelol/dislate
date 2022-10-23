import {name} from '../../manifest.json'

const slice_item = (array: [], start: number, end: number, label: string) => {
    try {
        let tempArray: [] = [];
        let array_length = 0;
        for (let i of array) {
            array_length++;
        }

        if(end===undefined || end > array.length) {
            end = array_length
        }

        for (let i = start; i < end; i++) {
            tempArray.push(array[i]);
        }
        return tempArray;
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to use the slice method at ${label}: ${err}`)
    }
}
  
  
const splice_item = ( obj: any, insert: any, insert_index: any, label: string) => {
    try {
        let array_length = 0;
        for (let i of obj) {
            array_length++;
        }

        insert_index = insert_index%array_length

        let duplicate_object: any = obj
        let removed_item = duplicate_object[insert_index]
        duplicate_object[insert_index] = insert

        let array_with_everything_except = slice_item(duplicate_object, 0, insert_index+1, label)    
        let array_with_nothing_except = slice_item(duplicate_object, insert_index+1, array_length, label)
        
        return [
            array_with_everything_except,
            removed_item,
            array_with_nothing_except
        ]
    } catch(err) {
        console.warn(`[${name}] The following error happened when trying to use the insert method at ${label}: ${err}`)
    }
};

export { slice_item, splice_item }
