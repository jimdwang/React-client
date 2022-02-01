export default function formatDate (time) {
    if(!time) return ''
    const d = new Date(time)
    return `${d.getFullYear()}-${(d.getMonth()+1)}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}