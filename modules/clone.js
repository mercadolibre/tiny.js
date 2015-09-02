export default function clone(obj) {
    if (obj === undefined || typeof obj !== 'object') {
        throw new Error('The "obj" parameter is required and must be an object.');
    }

    let copy = {},
        prop;

    for (prop in obj) {
        if (obj[prop] !== undefined) {
            copy[prop] = obj[prop];
        }
    }

    return copy;
}
