let string = {
    format(mask, value) {
        if (mask == null || value == null) return value;

        let formatted = '';
        let next = 0;
        let ignore = 0;
        for (let i = 0; i < mask.length; i++) {
            if (i - ignore >= value.length) break;
            if (mask[i] === '#') formatted += value[next++];
            else {
                formatted += mask[i];
                ignore++;
            }
        }
        return formatted;
    },

    cpfMask(value) {
        return value
          .replace(/\D/g, '') 
          .replace(/(\d{3})(\d)/, '$1.$2') 
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1') 
    },

    removeSpecialChars(value) {
        if (value == null || value.length < 1) return value;
        return value.replace(/[^A-Z0-9]+/ig, '');
    },
    
    currencyMaskToFloat(value) {
        if (typeof value === 'string' && value.trim().length > 0) {
            const newValue = value.replace(/[^,0-9]+/ig, '').replace(',', '.');
            
            return parseFloat(newValue);
        }
        
        return 0;
    },

    validaCPF(cpf) {
        if(this.isEmpty(cpf)) {
            return false;
        }
        
        const CPFS_INVALIDOS = [
            '00000000000', '11111111111', '22222222222', '33333333333', '44444444444',
            '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'];
        cpf = this.removeSpecialChars(cpf);
        if (CPFS_INVALIDOS.indexOf(cpf) > -1) return false;

        let soma = 0;
        for (let i = 1; i <= 9; i++)
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        let resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11)
            resto = 0;

        if (resto !== parseInt(cpf.substring(9, 10)))
            return false;

        soma = 0;
        for (let i = 1; i <= 10; i++)
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11)
            resto = 0;

        return resto === parseInt(cpf.substring(10, 11));
    },
    
    validaTelefone(tel) {
        if(this.isEmpty(tel)) {
            return false;
        }
        
        const text = this.removeSpecialChars(tel);
        const length = text.trim().length;
        
        return length >= 10 && length <= 11;
    },

    stringify(objFromJson) {

        if (Array.isArray(objFromJson)) {
            return objFromJson.map(item => this.stringify(item));

        } else if (typeof objFromJson !== "object") {
            // not an object, stringify using native function
            return JSON.stringify(objFromJson);
        }

        let props = Object
            .keys(objFromJson)
            .map(key => objFromJson[key] ? `${key}:${this.stringify(objFromJson[key])}` : '')
            .join(",");

        return `{${props}}`;
    },

    capitalize(text) {
        text = text.toLowerCase();
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    
    stringToLowerCase(string, index = 0){
        return string.charAt(index) + string.slice(1).toLowerCase();
    },

    objToGraphQL(obj) {
        const newObj = this.removeEmpty(obj);

        const objString = JSON.stringify(newObj);
        const graphQLObject = objString.replace(/"([^(")"]+)":/g, "$1:");

        return graphQLObject;
    },

    isEmpty(text) {
        if(typeof text !== 'string') {
            return true;
        }
        
        if(text.trim().length === 0) {
            return true;
        }
        
        return false;
    },

    removeEmpty(obj) {

        const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

        Object.keys(o).forEach(key => {
            if (o[key] && typeof o[key] === 'object')
                o[key] = this.removeEmpty(o[key]);  // Recurse.
            else if (o[key] === undefined || o[key] === null)
                delete o[key]; // Delete undefined and null.
        });

        return o;
    },
    
    truncate(str, length, ending) {
        if (typeof str !== 'string') {
            return str;
        }
        if (length == null) {
            length = 100;
        }
        if (ending == null) {
            ending = '...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        }
        
        return str;
    },
    
    numberMaskToFloat(value) {
        if (typeof value === 'number') {
            return value;
        }
        return this.isEmpty(value) ? 0 : parseFloat(value.replace(',', '.'));
    },

    formatData(value){
        if(value) {
            let data = this.removeSpecialChars(value);

            return data.substring(6, 8) + '/' + data.substring(4, 6) + '/' + data.substring(0, 4);
        }

        return value;
    }
};

export default string;