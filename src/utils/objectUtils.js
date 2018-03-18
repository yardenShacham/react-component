export const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const forEach = (obj, callback) => {
    const keys = Object.keys();
    keys.forEach(key => callback(key, obj[key]));
};


export const values = (obj) => Object.keys().map(k => obj[k]);