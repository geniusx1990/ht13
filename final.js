class Json {
    static parse(str) {
        const result = {};
        const parseQueue = [[result, str, 'object']];
        while (parseQueue.length) {
            const [currentObject, unparsedValue, type] = parseQueue[0];
            const keyValuePairs = unparsedValue.slice(1).matchAll(type === 'object'
                ? Json.OBJECT_VALUES
                : Json.ARRAY_ITEMS);
            let pair = keyValuePairs.next();
            while (pair.done === false) {
                console.log(pair.value.groups, 'TESTE!!!!!!!!!')

                const { key, string, number, boolean, none, array, object, emptyArray } = pair.value.groups;
                if (type === 'object') {

                    if (emptyArray !== undefined) {
                        currentObject[key] = [];
                        parseQueue.push([currentObject[key], emptyArray, 'array']);
                    }
                    if (string !== undefined) {
                        currentObject[key] = string.toString();
                    }
                    if (number !== undefined) {
                        currentObject[key] = +number;
                    }
                    if (none !== undefined) {
                        currentObject[key] = null;
                    }
                    if (boolean !== undefined) {
                        currentObject[key] = boolean === 'true';
                    }
                    if (object !== undefined) {
                        currentObject[key] = {};
                        parseQueue.push([currentObject[key], object, 'object']);
                    }

                    if (array !== undefined) {
                        currentObject[key] = [];
                        parseQueue.push([currentObject[key], array, 'array']);
                    }
                }
                else if (type === 'array') {
                    if (emptyArray !== undefined) {
                        currentObject.push([]);
                        parseQueue.push([currentObject[currentObject.length - 1], emptyArray, 'array']);
                    }
                    if (string !== undefined) {
                        currentObject.push(string.toString());
                    }
                    if (number !== undefined) {
                        currentObject.push(+number);
                    }
                    if (none !== undefined) {
                        currentObject.push(null);
                    }
                    if (boolean !== undefined) {
                        currentObject.push(boolean === 'true');
                    }
                    if (object !== undefined) {
                        currentObject.push({});
                        parseQueue.push([currentObject[currentObject.length - 1], object, 'object']);
                    }

                    if (array !== undefined) {
                        currentObject.push([]);
                        parseQueue.push([currentObject[currentObject.length - 1], array, 'array']);
                    }
                }
                pair = keyValuePairs.next();
            }
            parseQueue.shift();
        }
        return result;
    }
}

Json.OBJECT_VALUES = /"(?<key>[^"]+)":\s*(?:"(?<string>[^"]+)|(?<number>\-?\d+)|(?<boolean>true|false)|(?<none>null)|(?<emptyArray>\[\])|(?<array>[\[].+?[\]])|(?<object>[{].+?[}]))/gm;
Json.ARRAY_ITEMS = /"(?<string>.+?)"|(?<number>-?[0-9]+)|(?<boolean>true|false)|(?<none>null)|(?<emptyArray>\[\])|(?<object>[{].+?[}])|(?<array>\[.+?\])/gm;

function test(name, testCase) {
    const passed = testCase === JSON.stringify(Json.parse(testCase));
    const color = passed ? 32 : 31;
    console.log(`\x1b[${color}m=======================================\x1b[0m`);
    console.log(`\x1b[${color}mTest ${name}: ${passed ? 'PASSED' : 'FAILED'} \x1b[0m`);
    console.log(`\x1b[${color}mExpected: \x1b[0m`, JSON.parse(testCase));
    console.log(`\x1b[${color}mActual: \x1b[0m`, Json.parse(testCase));
    console.log(`\x1b[${color}m=======================================\x1b[0m`);
}


const test1 = JSON.stringify({ "name": "John", "age": 30, "city": "New York", "lol": null, "married": true, "graduated": false, "father": { "name": "Oleg", "age": 80 } });
const test2 = JSON.stringify({});
const test3 = JSON.stringify({
    name: "John",
    age: 30,
    city: "New York",
    father2: {
        name: "Oleg",
        age: 80
    },
    married: true,
    graduated: false,
    nest1: {
        nest1_key1: "Oleg",
        nest1_key2: 80,
        nest2: {
            nest2_key1: "Oleg",
            nest2_key2: 80,
            nest3: {
                nest3_key1: "Oleg",
                nest3_key2: 80,
            }
        }
    }
});
const test4 = JSON.stringify({ "name": "John", "age": 30, "city": "New York", "lol": null, "married": true, "graduated": false, "childrens": ["Mike", 15, "Ivan", 22], "father": { "name": "Oleg", "age": 80 } });
const test5 = JSON.stringify({ "childrens": ["Mike", 15, "Ivan", 22, ["asdf", 4525423, { "asdf": 'asdf' }]], "father": { "name": "Oleg", "age": 80 } });
const test6 = JSON.stringify({
    "id": "647ceaf3657eade56f8224eb",
    "index": 10,
    "negativeIndex": -10,
    "anEmptyArray": [],
    "notEmptyArray": [1, 2, 3, "string", true, null],
    "boolean": true,
    "nullValue": null,
    "nestedObject": {
        "nestedString": "Hello World",
        "nestedNumber": 42,
        "nestedArray": [true, false]
    },
    /* "complexArray": [
        {
            "name": "Alice Alice",
            "age": 28,
            "hobbies": ["Reading", "Painting"]
        },
        {
            "name": "Bob Bob",
            "age": 32,
            "hobbies": ["Gaming", "Cooking"]
        }
    ] */
})
test('#1', test1);
test('Is None Working', test2);
test('A lot of nesting', test3);
test('Array implementation', test4);
test('Nested arrays and objects', test5);


test('Alexandrina task', test6);
