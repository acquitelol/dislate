import { translate_string } from "./translate";
import { format_string } from './format_text'
import { debug_info } from './debug'
import { clipboard_toast } from "./clipboard";
import { external_plugins } from './external'
import { 
    splice_item, 
    find_item,
    push_item,
    pop_item,
    for_item,
    map_item
} from './array_methods' 
import { array_length } from './array_length'
import {init_device_list } from "./devices";
import { check_if_compatible_device } from "./incompatible_device";

import { Icons } from "./icons";

export { 
    translate_string, 
    format_string, 
    debug_info, 
    clipboard_toast, 
    external_plugins, 
    find_item, 
    splice_item,
    push_item,
    pop_item,
    for_item,
    map_item,
    array_length,
    init_device_list,
    check_if_compatible_device,
    Icons 
};