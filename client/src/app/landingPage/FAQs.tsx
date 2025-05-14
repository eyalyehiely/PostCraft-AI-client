import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is PostCraft AI?",
      answer: "PostCraft AI is an AI-powered social media content creation platform that helps creators and businesses generate engaging posts, captions, and content ideas. It provides scheduling tools, analytics, and multi-platform support to streamline your content strategy."
    },
    {
      question: "How does the AI content generation work?",
      answer: "Our AI system uses advanced algorithms to create content tailored to your brand voice and audience. Simply provide a topic or idea, and our AI will generate engaging posts, captions, and content suggestions optimized for different social media platforms."
    },

    {
      question: "Is my content and data secure?",
      answer: "Yes, we take data security very seriously. All your content and data is encrypted in transit and at rest. We follow industry best practices and comply with relevant data protection regulations to ensure your information remains secure."
    },
    {
      question: "How often should I create new content?",
      answer: "With PostCraft AI, you can maintain a consistent posting schedule easily. Our smart scheduling feature suggests optimal posting times, and you can create content in bulk. We recommend posting regularly based on your audience engagement patterns and platform best practices."
    },
    
  ];

  return (
    <div className="py-12 md:py-20" id="faqs">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions about our platform
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`px-6 transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQs; 