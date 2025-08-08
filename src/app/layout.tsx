import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-heading",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-body",
});

export const metadata: Metadata = {
	title: "Journey Writer",
	description: "AI travel journal assistant",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${instrumentSerif.variable} ${inter.variable} font-body antialiased px-0.5`}>
				{children}
			</body>
		</html>
	);
}
