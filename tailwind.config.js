// filepath: c:\Users\user hp2\Documents\Project\PKL\SiMiskin\SiMiskin\tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            lineHeight: {
                tight: '0.81',
            },
            fontFamily: {
                sans: [
                    'Figtree',
                    ...defaultTheme.fontFamily.sans
                ]
            },
            fontSize: {
                'xxs': ['0.44rem', { lineHeight: '0.1rem' }],
                ...defaultTheme.fontSize,


            },
            colors: {
                primary: {
                    bg: '#221e24',
                    fg: '#ddd7e4',
                    accent: '#5f63e8',
                    DEFAULT: '#221e24',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                background: '#221e24',
                foreground: '#ddd7e4',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: '#221e24',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: '#221e24',
                    foreground: '#ddd7e4',
                    primary: '#221e24',
                    'primary-foreground': '#221e24',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': '#221e24',
                    border: '#221e24',
                    ring: '#221e24'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        },
        plugins: [
            'forms'
        ]
    },

    // Add custom scrollbar styles
    plugins: [
        require("tailwindcss-animate"),
        function({ addUtilities }) {
            addUtilities({
                '::-webkit-scrollbar': {
                    width: '12px',
                },
                '::-webkit-scrollbar-track': {
                    background: '#221e24',
                },
                '::-webkit-scrollbar-thumb': {
                    background: '#221e24',
                    borderRadius: '6px',
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: '#221e24',
                },
            });
        }
    ]
}