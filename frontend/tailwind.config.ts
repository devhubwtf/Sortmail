import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				ink: {
					DEFAULT: 'var(--ink)',
					mid: 'var(--ink-mid)',
					light: 'var(--ink-light)'
				},
				surface: {
					DEFAULT: 'var(--surface)',
					2: 'var(--surface-2)',
					3: 'var(--surface-3)'
				},
				accent: {
					DEFAULT: 'var(--red)',
					soft: 'var(--red-soft)'
				},
				blue: {
					DEFAULT: 'var(--blue)',
					soft: 'var(--blue-soft)'
				},
				green: {
					DEFAULT: 'var(--green)',
					soft: 'var(--green-soft)'
				},
				amber: {
					DEFAULT: 'var(--amber)',
					soft: 'var(--amber-soft)'
				},
				violet: {
					DEFAULT: 'var(--violet)',
					soft: 'var(--violet-soft)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					2: 'var(--muted-2)',
					foreground: 'var(--muted-foreground)'
				},
				border: 'var(--border)',
				border2: 'var(--border-2)',
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				input: 'var(--input)',
				ring: 'var(--ring)',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				display: ['var(--ff-display)'],
				body: ['var(--ff-body)'],
				mono: ['var(--ff-mono)']
			},
			fontSize: {
				xs: 'var(--fs-xs)',
				sm: 'var(--fs-sm)',
				base: 'var(--fs-base)',
				md: 'var(--fs-md)',
				lg: 'var(--fs-lg)',
				xl: 'var(--fs-xl)',
				'2xl': 'var(--fs-2xl)'
			},
			spacing: {
				'sb': 'var(--sidebar-w)',
				'sb-col': 'var(--sidebar-col)',
				'tb': 'var(--topbar-h)',
				'panel': 'var(--panel-w)'
			},
			borderRadius: {
				sm: 'calc(var(--radius) - 4px)',
				md: 'calc(var(--radius) - 2px)',
				lg: 'var(--radius)',
				xl: '24px'
			},
			boxShadow: {
				sm: '0 1px 3px rgba(26, 26, 25, 0.06)',
				md: '0 4px 12px rgba(26, 26, 25, 0.08)',
				lg: '0 8px 32px rgba(26, 26, 25, 0.12)',
				xl: '0 16px 48px rgba(26, 26, 25, 0.16)'
			},
			transitionDuration: {
				instant: '80ms',
				fast: '150ms',
				normal: '250ms',
				slow: '400ms'
			},
			transitionTimingFunction: {
				'ease-out-custom': 'cubic-bezier(0, .6, .4, 1)',
				'ease-spring': 'cubic-bezier(.34, 1.56, .64, 1)'
			},
			animation: {
				'fade-up': 'fadeUp 300ms ease-out',
				'fade-in': 'fadeIn 200ms ease-out',
				'slide-in-right': 'slideInRight 250ms ease-out',
				'shimmer': 'shimmer 1.4s ease-in-out infinite',
				'pulse-dot': 'pulse-dot 2s ease-in-out infinite'
			},
			keyframes: {
				fadeUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(12px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				slideInRight: {
					'0%': {
						opacity: '0',
						transform: 'translateX(16px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				shimmer: {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'pulse-dot': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '.4'
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
