/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: ['media', '[data-mode="dark"]'],
   content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
   prefix: '',
   theme: {
      container: {
         center: true,
         padding: '2rem',
         screens: {
            '2xl': '1400px',
         },
      },
   },
   plugins: [require('tailwindcss-animate'), require('daisyui')],
};
