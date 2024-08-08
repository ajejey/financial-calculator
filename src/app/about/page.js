import { Metadata } from 'next'
import Link from 'next/link'

export const metadata = {
  title: 'About FinPlanner | Your Trusted Financial Planning Partner',
  description: 'Learn about FinPlanner, our mission to empower individuals with smart financial planning tools, and our commitment to your financial success.',
  keywords: 'financial planning, wealth management, retirement planning, investment strategies, financial tools',
  openGraph: {
    title: 'About FinPlanner | Your Trusted Financial Planning Partner',
    description: 'Discover how FinPlanner is revolutionizing personal finance with innovative tools and expert insights.',
    images: [{ url: '/images/finplanner-team.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FinPlanner | Empowering Your Financial Future',
    description: 'Learn how FinPlanner is helping thousands achieve their financial goals with cutting-edge planning tools.',
    images: ['/images/finplanner-app-screenshot.jpg'],
  },
}

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About FinPlanner</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          At FinPlanner, we're on a mission to democratize financial planning. We believe that everyone, regardless of their financial background, deserves access to powerful tools that can help them secure their financial future.
        </p>
        <p className="text-gray-600">
          Our innovative platform combines cutting-edge technology with financial expertise to provide you with personalized, actionable insights that can transform your financial life.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Story</h2>
        <p className="text-gray-600 mb-4">
          Founded in 2020 by a team of financial experts and tech innovators, FinPlanner was born out of a simple observation: traditional financial planning was too complex, too expensive, and often out of reach for the average person.
        </p>
        <p className="text-gray-600">
          We set out to change that. By leveraging advanced algorithms, machine learning, and user-friendly design, we've created a platform that makes financial planning accessible, understandable, and even enjoyable.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">What Sets Us Apart</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li className="mb-2">Personalized financial projections based on your unique situation</li>
          <li className="mb-2">Interactive tools that let you visualize different financial scenarios</li>
          <li className="mb-2">Expert-curated content to improve your financial literacy</li>
          <li className="mb-2">Bank-level security to protect your sensitive information</li>
          <li>Continuous updates and improvements based on user feedback and financial trends</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Team</h2>
        <p className="text-gray-600 mb-4">
          Behind FinPlanner is a diverse team of financial advisors, data scientists, software engineers, and user experience designers. We're united by our passion for technology and our commitment to improving people's financial lives.
        </p>
        <p className="text-gray-600">
          Led by our CEO, Jane Doe, a veteran in both finance and technology, our team brings together decades of experience from leading financial institutions and tech companies.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Commitment to You</h2>
        <p className="text-gray-600 mb-4">
          Your financial success is our top priority. We're committed to:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li className="mb-2">Providing accurate, up-to-date financial information and projections</li>
          <li className="mb-2">Continuously improving our tools based on your feedback</li>
          <li className="mb-2">Protecting your privacy and securing your data</li>
          <li>Offering responsive customer support to address your questions and concerns</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Join Us on Your Financial Journey</h2>
        <p className="text-gray-600 mb-4">
          Whether you're just starting to think about your financial future or you're looking to optimize your existing plans, FinPlanner is here to help. Our tools are designed to grow with you, providing relevant insights at every stage of your financial journey.
        </p>
        <p className="text-gray-600 mb-4">
          Ready to take control of your financial future? Start your journey with FinPlanner today.
        </p>
        <Link 
          href="/planner" 
          className="bg-blue-600 text-white px-6 py-3 rounded-full inline-flex items-center text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Try FinPlanner Now
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          Have questions or feedback? We'd love to hear from you.
        </p>
        <p className="text-gray-600">
          Email: <a href="mailto:support@finplanner.com" className="text-blue-600 hover:underline">support@finplanner.com</a><br />
          Phone: +1 (555) 123-4567<br />
          Address: 123 Financial Street, Tech City, CA 94000
        </p>
      </section>
    </div>
    </div>
  )
}