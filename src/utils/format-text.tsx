
const formatString = text => {
    return text.split("_").map(e => e[0].toUpperCase() + e.slice(1)).join(' ')
}

export { formatString };