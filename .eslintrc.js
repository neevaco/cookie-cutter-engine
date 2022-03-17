// This is the root eslint module for all JS modules at Neeva.
// TODO(toddw): Convert all JS modules to extend this as the base.
module.exports = {
    plugins: [],
    extends: ['./.eslintrc.base.json'],
    rules: {
        'no-restricted-properties': [
            2,
            {
                object: 'window',
                property: 'open',
                message: 'Please use openWindow().',
            },
        ],
    },
    globals: {
        location: 'off',
    },
    overrides: [
        {
            files: ['*'],
            excludedFiles: [
                'scripts/*',
                'src/test/*',
                '*.test.ts',
                '*.test.tsx',
                '*.fixture.ts',
                '*.fixture.tsx',
            ],
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        paths: ['he', 'lodash', 'moment', 'moment-timezone'],
                        patterns: [
                            'he/*',
                            'lodash/*',
                            'moment/*',
                            'moment-timezone/*',
                        ],
                    },
                ],
            },
        },
    ],
};
