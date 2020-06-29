// ast语法树 -> 用对象描述原生html语法
// 虚拟dom -> 用对象描述dom节点
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

export function compileToFunction(template) {
    console.log(template)
    let root = parseHTML(template)
    return function render() {

    }
}

function parseHTML(html) {
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            let startTagMatch = parseStartTag()
        }
        break
    }
    function advance(n) {
        html = html.substring(n)
    }
    function parseStartTag() {
       const start = html.match(startTagOpen)
       if (start) {
           console.log(start)
           advance(start[0].length)
       }
    }
}

// <div id="app">
//    <p>hello</p>
// </div>

// let root = {
//     tag: 'div',
//     attrs: [{name: 'id', value: 'app'}],
//     parent: null,
//     type: 1,
//     children: [{
//         tag: 'p',
//         attrs: [],
//         parent: root,
//         type: 1,
//         children: [{
//             text: 'hello',
//             type: 3,
//         }]
//     }]
// }