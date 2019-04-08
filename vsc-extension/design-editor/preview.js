var parentBodyAfter;
if (parent) {
    parentBodyAfter = parent.getComputedStyle(parent.document.body, 'after');
    top.globalData = JSON.parse(parentBodyAfter.content.substr(1, parentBodyAfter.content.length - 2).replace(/\\/g, '') || '{}');
}
