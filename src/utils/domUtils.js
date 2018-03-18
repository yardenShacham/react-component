export const addClass = (node, className) => {
    node.classList.add(className);
};
export const changeClass = (nodeOrId, from, to) => {
    if (typeof nodeOrId === "string")
        nodeOrId = document.getElementById(nodeOrId);
    removeClass(nodeOrId, from);
    addClass(nodeOrId, to);
};

export const removeClass = (node, className) => {
    node.classList.remove(className);
}

export const setProperty = (nodeOrId, propName, getValue) => {
    if (nodeOrId && propName && getValue) {
        if (typeof nodeOrId === "string")
            nodeOrId = document.getElementById(nodeOrId);

        nodeOrId.style.setProperty(`--${propName}`, getValue());
    }
};

export const getProperty = (node, propName) => node.style.getPropertyValue(`--${propName}`);