export const generateArray = (length, getCellContent) => {
    let arr = [];
    if (length) {
        for (let i = 1; i <= length; i++) {
            arr.push(getCellContent ? getCellContent(i) : undefined);
        }
    }
    return arr;
};