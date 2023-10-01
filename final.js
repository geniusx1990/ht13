const json = '{"name": "John", "age": 30, "city": "New York", "married": true, "graduated": false, "childrens": ["Mike", 15, "Ivan", 22], "father": {"name": "Oleg", "age": 80}}';

function myJSONParse(string) {
    const reg = /"(?<key>[^"]+)":\s*(?:"(?<value>[^"]+)|(?<number>\d+)|(?<boolean>true|false)|(?<null>null)|\[(?<array>[^\]]*)\]|\{(?<objectNested>[^}]+)\})/g;

    const result = {};

    let section = result;

    let match;

    while ((match = reg.exec(string)) !== null) {
        let key = match.groups.key;
        let value = match.groups.value;

        if (match.groups.number !== undefined) {
            value = parseFloat(match.groups.number);
        } else if (match.groups.boolean !== undefined) {
            value = match.groups.boolean === 'true';
        } else if (match.groups.null !== undefined) {
            value = null;
        } else if (match.groups.array !== undefined) {
            value = match.groups.array.split(',').map(item => {
                item = item.trim();
                if (!isNaN(item)) {
                    return parseFloat(item);
                }
                return item.replace(/"/g, '');
            });
        } else if (match.groups.objectNested !== undefined) {
            const nestedObjectString = match.groups.objectNested;
            const jsonObject = {};
            const regObj = /"(?<key>[^"]+)":\s*(?:"(?<value>[^"]+)"|(?<number>\d+))/g;
            let test;

            while ((test = regObj.exec(nestedObjectString)) !== null) {
                const key = test.groups.key;
                const value = test.groups.value;

                if (test.groups.number !== undefined) {
                    jsonObject[key] = parseFloat(test.groups.number);
                } else {
                    jsonObject[key] = value;
                }
            }

            value = jsonObject;
        }

        section[key] = value;
    }

    return result;
}

console.log(myJSONParse(json))