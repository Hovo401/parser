
function getIndexByClassNameAndInnerHTML (className:string, innerHTMLTest: string): number{
    const elements = document.getElementsByClassName(className);
    // const filteredElements: Element[] = [];
    let index = 0;
    for(const element of Array.from(elements)){
        
        if (element.innerHTML.includes(innerHTMLTest)) {
            // filteredElements.push(element);
            index++;
        }
    }
    return index
}


export {getIndexByClassNameAndInnerHTML}