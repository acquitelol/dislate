import { array_length } from "./array_length";

const format_object = (text: string) => {
    let final: any = text.split('\n').map((e: any) => {
        if (e=='') return;
        return `"${e.replaceAll(':', `":"`).replace(' ', '')}",`
    })
    final[0]=`{${final[0]}`
    final[array_length(final)]=`${final[array_length(final)]}}`
    final = final.join('')
    final = final.replaceAll("undefined", "")
    final = final.split('').reverse().join('').replace(',', '').split('').reverse().join('');
    return final
}

export {format_object}