import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { PieChart } from "lucide-react";
import GoogleAnalytics from "@/GoogleAnalytics/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: 'Financial Planning Made Easy | Your Path to Financial Freedom',
  description: 'Plan your financial future with our intuitive tool. Visualize savings, investments, and retirement plans. Free, easy-to-use, and personalized.',
  keywords: 'financial planning, retirement calculator, investment growth, SIP calculator, SWP planner',
  openGraph: {
    title: 'Financial Planning Made Easy | Your Path to Financial Freedom',
    description: 'Plan your financial future with our intuitive tool. Visualize savings, investments, and retirement plans.',
    images: [{ url: '../../public/vercel.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Planning Made Easy',
    description: 'Plan your financial future with our intuitive tool.',
    images: ['../../public/vercel.svg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className="bg-gray-100 text-gray-900 font-sans bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <header className="pt-2">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-800">FinPlanner</span>
            </div>
            {/* <div className="flex space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </div> */}
          </nav>
        </header>
        {/* <div className="flex justify-center gap-4 p-4">
          <Link className="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded px-3 py-1 hover:shadow-md" href="/" activeClassName="bg-blue-200 shadow-md">Home</Link>
          <Link className="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded px-3 py-1 hover:shadow-md" href='/financial-planner' activeClassName="bg-blue-200 shadow-md">Financial Planner</Link>
        </div> */}
        {children}
      </body>
    </html>
  );
}
