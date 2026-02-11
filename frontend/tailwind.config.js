/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                academic: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                sage: {
                    50: '#f4f7f5',
                    100: '#e3ebe6',
                    200: '#c5d8cd',
                    300: '#9ebfb1',
                    400: '#75a292',
                    500: '#548776',
                    600: '#406b5d',
                    700: '#35564b',
                    800: '#2d463e',
                    900: '#263a34',
                },
                sand: {
                    50: '#fbfaf8',
                    100: '#f5f2eb',
                    200: '#eae3d4',
                    300: '#dbcea1',
                    400: '#c7b07b',
                    500: '#ad925a',
                    600: '#8c7144',
                    700: '#6f5637',
                    800: '#5d4732',
                    900: '#4d3b2c',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
            },
            keyframes: {
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'fadeIn': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'slideUp': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fadeInDown': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' },
                },
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'fadeIn': 'fadeIn 0.2s ease-out',
                'slideUp': 'slideUp 0.4s ease-out',
                'fadeInDown': 'fadeInDown 0.3s ease-out',
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
