/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./apps/admin-panel/src/**/*.{html,ts}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "800": "#9f1239", "900": "#881337", "950": "#4c0519" },
                'medical-rose': {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    500: '#ec4899',
                    900: '#831843',
                },
                'medical-gold': {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#f59e0b',
                    900: '#78350f',
                }
            }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
}
