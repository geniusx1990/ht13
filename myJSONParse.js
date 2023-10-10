// Utility functions to check for specific values
const isBooleanTrue = function (value) {
    return value === "true";
};

const isBooleanFalse = function (value) {
    return value === "false";
};

const isNull = function (value) {
    return value === "null";
};

const isNumber = function (value) {
    return !isNaN(Number(value));
};

// Tokenizer function to convert a JSON string into an array of tokens
function tokenizer(input) {
    let current = 0;
    const tokens = [];


    // Tokenization loop
    while (current < input.length) {
        let char = input[current];
        if (char === "{") {
            tokens.push({ type: "BraceOpen", value: char });
            current++;
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "BraceClose", value: char });
            current++;
            continue;
        }
        if (char === "[") {
            tokens.push({ type: "BracketOpen", value: char });
            current++;
            continue;
        }
        if (char === "]") {
            tokens.push({ type: "BracketClose", value: char });
            current++;
            continue;
        }
        if (char === ":") {
            tokens.push({ type: "Colon", value: char });
            current++;
            continue;
        }
        if (char === ",") {
            tokens.push({ type: "Comma", value: char });
            current++;
            continue;
        }
        if (char === '"') {
            let value = "";
            char = input[++current];
            while (char !== '"') {
                value += char;
                char = input[++current];
            }
            current++;
            tokens.push({ type: "String", value: value });
            continue;
        }
        // For number, boolean, and null values
        if (/[-\d\w]/.test(char)) {
            // If it's a number or a word character
            let value = "";
            while (/[-\d\w]/.test(char)) {
                value += char;
                char = input[++current];
            }
            if (isNumber(value))
                tokens.push({ type: "Number", value: value });
            else if (isBooleanTrue(value))
                tokens.push({ type: "True", value: value });
            else if (isBooleanFalse(value))
                tokens.push({ type: "False", value: value });
            else if (isNull(value))
                tokens.push({ type: "Null", value: value });
            else
                throw new Error("Unexpected value: " + value);
            continue;
        }
        // Skip whitespace
        if (/\s/.test(char)) {
            current++;
            continue;
        }
        throw new Error("Unexpected character: " + char);
    }

    return tokens;
}

// JSON parsing function
function myJSONParse(input) {
    let current = 0;
    const tokens = tokenizer(input);

    // Parsing logic
    if (!tokens.length) {
        throw new Error("Nothing to parse. Exiting!");
    }

    function advance() {
        return tokens[++current];
    }

    function parseValue() {
        const token = tokens[current];
        switch (token.type) {
            case "String":
                return token.value;
            case "Number":
                return Number(token.value);
            case "True":
                return true;
            case "False":
                return false;
            case "Null":
                return null;
            case "BraceOpen":
                return parseObject();
            case "BracketOpen":
                return parseArray();
            default:
                throw new Error("Unexpected token type: " + token.type);
        }
    }

    function parseObject() {
        const result = {};
        let token = advance(); 
        while (token.type !== "BraceClose") {
            if (token.type === "String") {
                let key = token.value;
                token = advance(); 
                if (token.type !== "Colon")
                    throw new Error("Expected : in key-value pair");
                token = advance(); 
                let value = parseValue();
                result[key] = value;
            } else {
                throw new Error("Expected String key in object. Token type: " + token.type);
            }
            token = advance(); 
            if (token.type === "Comma")
                token = advance(); 
        }
        return result;
    }

    function parseArray() {
        const result = [];
        let token = advance(); 
        while (token.type !== "BracketClose") {
            let value = parseValue();
            result.push(value);
            token = advance(); 
            if (token.type === "Comma")
                token = advance(); 
        }
        return result;
    }

    const AST = parseValue();
    return AST;
}

// Tests


function test(name, testCase) {
    const passed = testCase === JSON.stringify(myJSONParse(testCase));
    const color = passed ? 32 : 31;
    console.log(`\x1b[${color}m=======================================\x1b[0m`);
    console.log(`\x1b[${color}mTest ${name}: ${passed ? 'PASSED' : 'FAILED'} \x1b[0m`);
    console.log(`\x1b[${color}mExpected: \x1b[0m`, JSON.parse(testCase));
    console.log(`\x1b[${color}mActual: \x1b[0m`, myJSONParse(testCase));
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
    "complexArray": [
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
    ]
})
test('#1', test1);
test('Is None Working', test2);
test('A lot of nesting', test3);
test('Array implementation', test4);
test('Nested arrays and objects', test5);


test('Alexandrina task', test6);