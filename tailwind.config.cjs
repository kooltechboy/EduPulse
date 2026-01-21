/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
            colors: {
                brand: {
                    blue: '#2563eb',
                    indigo: '#4f46e5',
                },
            },
        },
    },
    plugins: [],
}
