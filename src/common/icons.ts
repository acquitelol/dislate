import { getIDByName } from 'enmity/api/assets';

export default {
    Translate: getIDByName('img_nitro_star'),
    Revert: getIDByName('ic_highlight'),

    Debug: getIDByName('debug'),
    Retry: getIDByName('ic_message_retry'),
    Failed: getIDByName('Small'),
    Cancel: getIDByName('ic_megaphone_nsfw_16px'),
    Delete: getIDByName('ic_message_delete'),

    Copy: getIDByName('toast_copy_link'),
    Open: getIDByName('ic_leave_stage'),
    Clipboard: getIDByName('pending-alert'),
    Add: getIDByName("ic_add_perk_24px"),

    Clock: getIDByName('clock'),

    Settings: {
        Toasts: {
            Context: getIDByName('toast_image_saved'),
            Settings: getIDByName('ic_selection_checked_24px'),
            Failed: getIDByName('ic_close_circle_24px')
        },
        TranslateFrom: getIDByName('ic_raised_hand_list'),
        TranslateTo: getIDByName('ic_activity_24px'),
        Debug: getIDByName('ic_rulebook_16px'),
        Initial: getIDByName('coffee'),
        Update: getIDByName("discover"),
        Locale: getIDByName("ic_locale_24px"),
        Back: getIDByName("ios-back")
    }
};