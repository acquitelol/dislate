/** Get a list of all external plugins that Dislate might need to account for, including itself.
 * @param {object} external_plugins: An object of plugins with the name as the key and the "key" of their respective element as the value
 */
const external_plugins: { [key: string]: string | undefined; }  = {
    message_spoofer: "69",
    copy_embed: "1337",
    invis_chat: "420",
    cut_message: "512",
    dislate: "1002"
}

export { external_plugins }