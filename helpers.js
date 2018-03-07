const increaseVersion = (currentVersion) => insertAt((parseFloat(replaceAt(currentVersion, 3, '')) + 0.01).toString(), '.', 3);


const replaceAt = (str, index, char) => str.substr(0, index) + char + str.substr(index + 1);
const insertAt = (str, insertStr, index) => str.slice(0, index) + insertStr + str.slice(index);

module.exports = {
    increaseVersion
};