import { HtmlChildNode, HtmlDocument, HtmlElement, HtmlElementType, parseHtml } from "@svelte-compose/ast-tooling";

export type HtmlAstEditor = {
    ast: HtmlDocument;
    div: typeof div;
    htmlElement: typeof htmlElement;
    addFromRawHtml: typeof addFromRawHtml;
    insertElement: typeof insertElement;
    appendElement: typeof appendElement;
};

export function getHtmlAstEditor(document: HtmlDocument) {
    const editor: HtmlAstEditor = {
        ast: document,
        div,
        addFromRawHtml,
        htmlElement,
        insertElement,
        appendElement,
    };
    return editor;
}

function div(attributes: Record<string, string> = {}) {
    return htmlElement("div", attributes);
}

function htmlElement(tagName: string, attributes: Record<string, string> = {}) {
    const element = new HtmlElement(tagName, {}, undefined, HtmlElementType.Tag);
    element.attribs = attributes;
    return element;
}

function insertElement(childNodes: HtmlChildNode[], elementToInsert: HtmlChildNode) {
    childNodes.splice(0, 0, elementToInsert);
}

function appendElement(childNodes: HtmlChildNode[], elementToAppend: HtmlChildNode) {
    childNodes.push(elementToAppend);
}

function addFromRawHtml(childNodes: HtmlChildNode[], html: string) {
    const document = parseHtml(html);
    for (const childNode of document.childNodes) {
        childNodes.push(childNode);
    }
}
