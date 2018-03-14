export const generateArray = (length, getCellContent, startFromOne) => {
    let arr = [];
    if (length) {
        for (let i = 1; i <= length; i++) {
            arr.push(getCellContent ? getCellContent(startFromOne ? i : (i - 1)) : undefined);
        }
    }
    return arr;
};