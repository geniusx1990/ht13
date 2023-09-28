const json = '{"name": "John", "age": 30, "city": "New York", "colors": ["red", 22, "blue"], "contacts": {"email": "john@gmail.com", "phone": "1231231233"}}';

function myJSONParse(string) {
    let reg = /"([^"]+)":\s*("[^"]*"|true|false|null|\d+(\.\d+)?|\{[^{}]*\}|\[[^\[\]]*\])/g;
    let result = {};
    let section = result;
    let match;

    while ((match = reg.exec(string)) !== null) {
        let key = match[1];
        let value = match[2];

        if (value === 'true') {
            value = true;
        } else if (value === 'false') {
            value = false;
        } else if (value === 'null') {
            value = null;
        } else if (!isNaN(value)) {
            value = parseFloat(value);
        } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        } else if (value.startsWith('{') && value.endsWith('}')) {
            value = myJSONParse(value);
        } else if (value.startsWith('[') && value.endsWith(']')) {
            const arrayContent = value.slice(1, -1);
            value = arrayContent.split(',').map(item => {
                item = item.trim();
                if (!isNaN(item)) {
                    return parseFloat(item);
                } else {
                    return item.replace(/"/g, '');
                }
            });
        } else {
            value = value.replace(/"/g, '');
        }

        section[key] = value;
    }

    return result;
}

console.log(myJSONParse(json));
