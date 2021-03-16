export default class LocalStorage {

    static get(key) {
        return localStorage.getItem(key)
    }

    static put(key, value) {

        let parsedValue = value;
        if(typeof(value) === "object") {
            parsedValue = JSON.stringify(value)
        }

        return localStorage.setItem(key, parsedValue);
    }

    static remove(key) {
        return localStorage.removeItem(key)
    }
}