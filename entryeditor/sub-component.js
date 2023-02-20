export default {
    data() {
        return { count: 0 }
    },
    template: `
<div>sub count is {{ count }}</div>
<button @click="count++">SUB INC</button>
`
}
