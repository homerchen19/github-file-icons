module.exports = {
    rules: {
        "property": require("./lib/rules/property"),
        "method": require("./lib/rules/method")
    },
    configs: {
        DOM: {
            plugins: ["no-unsanitized"],
            rules: {
                "no-unsanitized/property": [
                    "error",
                    {
                    },
                    {

                        // Check unsafe assignment to innerHTML
                        innerHTML: {},

                        // Check unsafe assignment to outerHTML
                        outerHTML: {},
                    }
                ],
                "no-unsanitized/method": [
                    "error",
                    {
                    },
                    {

                        // check second parameter to .insertAdjacentHTML()
                        insertAdjacentHTML: {
                            properties: [1]
                        },

                        // check first parameter to .write(), as long as the preceeding object matches the regex "document"
                        write: {
                            objectMatches: [
                                "document"
                            ],
                            properties: [0]
                        },

                        // check first parameter to .writeLn(), as long as the preceeding object matches the regex "document"
                        writeln: {
                            objectMatches: [
                                "document"
                            ],
                            properties: [0]
                        }
                    }
                ]
            }
        }
    }
};
