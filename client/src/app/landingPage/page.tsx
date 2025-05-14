"use client"
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, LightBulbIcon, GlobeAltIcon, UserGroupIcon, DocumentCheckIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CheckIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import contactUs from '../functions/contactUs';
import FAQs from './FAQs';



const LandingPage = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({
    type: '', // 'success' or 'error'
    message: ''
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactUs(formData);
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you soon.'
      });
      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    }
  };

  // Add smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                PostCraft AI
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <a href="#home" className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Home</a>
              <a href="#features" className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Features</a>
              <a href="#pricing" className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Pricing</a>
              <a href="#contact" className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Contact</a>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {!isSignedIn ? (
                <SignInButton mode="modal" redirectUrl="/dashboard">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                    Login
                  </button>
                </SignInButton>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/80 backdrop-blur-sm">
            <a href="#home" className="block px-3 py-2 text-base font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Home</a>
            <a href="#features" className="block px-3 py-2 text-base font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Features</a>
            <a href="#pricing" className="block px-3 py-2 text-base font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Pricing</a>
            <a href="#contact" className="block px-3 py-2 text-base font-medium text-white hover:bg-blue-600 rounded-lg transition-colors">Contact</a>
            <div className="pt-4 pb-3 border-t border-gray-700">
              {!isSignedIn ? (
                <SignInButton mode="modal" redirectUrl="/dashboard">
                  <button className="w-full px-3 py-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                    Login
                  </button>
                </SignInButton>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full px-3 py-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Bar */}
      {/* <Countdown /> */}

      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center pt-16" id="home">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center w-full"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
              Powered by AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Create Engaging Content
            <br />
            with AI-Powered Precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Transform your social media presence with AI-generated content that resonates with your audience. Create, schedule, and optimize your posts effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col gap-4 justify-center w-full max-w-xs mx-auto"
          >
            <SignInButton mode="modal" redirectUrl="/dashboard">
              <button
                className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Get Started"
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-white">
                Sign Up
              </button>
            </SignUpButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm text-center"
          >
            <GlobeAltIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-4xl font-bold mb-2">10K+</h3>
            <p className="text-gray-400">Posts Created</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm text-center"
          >
            <UserGroupIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-4xl font-bold mb-2">5K+</h3>
            <p className="text-gray-400">Active Creators</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm text-center"
          >
            <DocumentCheckIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-4xl font-bold mb-2">98%</h3>
            <p className="text-gray-400">Engagement Rate</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-20" id="features">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to create, manage, and optimize your social media content
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <SparklesIcon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Content Generation</h3>
            <p className="text-gray-400">Create engaging social media posts, captions, and content ideas powered by advanced AI algorithms tailored to your brand voice.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <ChartBarIcon className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-gray-400">Track engagement metrics, analyze post performance, and get insights to optimize your content strategy.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <LightBulbIcon className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-gray-400">Schedule posts at optimal times for maximum engagement using AI-powered timing recommendations.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <GlobeAltIcon className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-Platform Support</h3>
            <p className="text-gray-400">Create and manage content across multiple social media platforms from a single dashboard.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <DocumentCheckIcon className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Content Calendar</h3>
            <p className="text-gray-400">Plan and organize your content with an intuitive calendar interface and automated content suggestions.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <UserGroupIcon className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Audience Insights</h3>
            <p className="text-gray-400">Understand your audience better with AI-powered analytics and demographic data to create more targeted content.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 w-full"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of content creators and social media managers who have transformed their content strategy with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-xl font-bold">MS</span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Michael Santos</h4>
                <p className="text-sm text-gray-400">Data Science Lead, E-commerce Platform</p>
              </div>
            </div>
            <p className="text-gray-300">
              "We've been using PostCraft AI for 6 months now, and it's transformed our social media strategy. The AI-powered content suggestions helped us increase our engagement by 47%. The scheduling features save us hours every week."
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl font-bold">AR</span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Aisha Rahman</h4>
                <p className="text-sm text-gray-400">Marketing Director, FinTech Startup</p>
              </div>
            </div>
            <p className="text-gray-300">
              "The AI content generation has been a game-changer for our marketing team. We've seen a 52% improvement in engagement since implementing the platform's recommendations. The analytics tools make it easy to track our performance."
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-xl font-bold">JL</span>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">James Liu</h4>
                <p className="text-sm text-gray-400">CEO, SaaS Productivity Tool</p>
              </div>
            </div>
            <p className="text-gray-300">
              "As a small business owner, PostCraft AI has been invaluable. The AI-driven content creation helped us maintain a consistent social media presence, leading to a 35% increase in follower growth. The customer support team is incredibly responsive too."
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8 text-center w-full"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Social Media?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of creators and businesses already using our AI-powered content platform.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
            </SignUpButton>
          </div>
        </motion.div>
      </div>

      {/* Pricing Preview Section */}
      <div id="pricing" className="py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start with a free trial or unlock all features with our premium plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: 'Free',
              price: '$0',
              period: '',
              features: ['5 AI-generated posts per month', 'Basic analytics', 'Single platform support', 'Content calendar', 'Email support'],
            },
            {
              name: 'Premium',
              price: '$50',
              period: 'one-time payment',
              features: ['Unlimited AI-generated posts', 'Advanced analytics', 'Multi-platform support', 'Smart scheduling', 'Priority support', 'Custom templates', 'Team collaboration'],
              popular: true,
            },
          ].map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`p-6 rounded-xl ${plan.popular
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600'
                  : 'bg-gray-800/50 backdrop-blur-sm'
                }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-300 ml-1 text-sm">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <SignUpButton mode="modal">
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  Start Free Trial
                </button>
              </SignUpButton>

            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>
          <p className="text-gray-400 mb-8 text-center">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {submitStatus.message && (
              <div className={`p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {submitStatus.message}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
      <FAQs />

      {/* Footer */}
      <footer className="bg-gray-900 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                PostCraft AI
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transforming social media content creation with cutting-edge AI technology to help creators and businesses grow their online presence.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>



            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400 text-sm">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  <span>eyalwork0@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} PostCraft AI. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 