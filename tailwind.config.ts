import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
	theme: {
		extend: {
			keyframes: {
				shimmer: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(200%)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
			},
			animation: {
				shimmer: "shimmer 3s infinite",
				float: "float 6s ease-in-out infinite",
				floatSlow: "float 8s ease-in-out infinite",
				floatDelayed: "float 7s ease-in-out 1.2s infinite",
			},
		},
	},
};

export default config;
