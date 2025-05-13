'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchPublicPost } from '@/services/posts/fetchPublicPost';
import { Post } from '@/types/post';
import { toast } from 'sonner';
import { CalendarIcon, ClockIcon, Share2Icon, BookOpenIcon, HeartIcon, TwitterIcon, FacebookIcon, LinkedinIcon } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PublicPostPage() {
  const params = useParams();
  const publicId = params.publicId;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const calculateReadingTime = (content: string) => {
    // Average reading speed (words per minute)
    const wordsPerMinute = 120;
    
    // Remove HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.trim().split(/\s+/).length;
    
    // Calculate reading time
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return readingTime;
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!publicId) return;
      
      try {
        setIsLoading(true);
        const postData = await fetchPublicPost(publicId as string);
       
        setPost(postData);
      } catch (error) {
        console.error('Error loading post:', error);
        toast.error('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [publicId]);

  if (!publicId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Oops!</h1>
          <p className="text-gray-600">Post ID not found</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Post Not Found</h1>
          <p className="text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                PostCraft AI
              </span>
            </Link>
            <nav className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10 dark:hover:from-primary/20 dark:hover:to-purple-500/20 transition-all"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2Icon className="w-5 h-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!');
                        setShowShareMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Share2Icon className="w-4 h-4" />
                      Copy Link
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <TwitterIcon className="w-4 h-4" />
                      Share on Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <FacebookIcon className="w-4 h-4" />
                      Share on Facebook
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                      Share on LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
          {/* Hero Section */}
          <div className="relative h-[60vh] bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 dark:from-primary/30 dark:via-purple-500/30 dark:to-blue-500/30">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-900"></div>
            <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="space-y-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary to-purple-600 dark:from-white dark:via-primary dark:to-purple-400 leading-tight tracking-tight"
                >
                  {post.title}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300"
                >
                  <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/10 dark:border-primary/20 shadow-sm hover:shadow-md transition-all">
                    {post.author ? (
                      <span className="font-medium bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        {post.author.first_name && post.author.last_name 
                          ? `${post.author.first_name} ${post.author.last_name}`
                          : post.author.email || 'Author'}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-500">Unknown Author</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/10 dark:border-primary/20 shadow-sm hover:shadow-md transition-all">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/10 dark:border-primary/20 shadow-sm hover:shadow-md transition-all">
                    <ClockIcon className="w-4 h-4 text-primary" />
                    <span>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/10 dark:border-primary/20 shadow-sm hover:shadow-md transition-all">
                    <BookOpenIcon className="w-4 h-4 text-primary" />
                    <span>{calculateReadingTime(post.content)} min read</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-gray-900 prose-headings:to-primary dark:prose-headings:from-white dark:prose-headings:to-primary prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-purple-500 dark:prose-a:text-primary dark:hover:prose-a:text-purple-400 prose-img:rounded-xl prose-img:shadow-lg prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-primary/5 dark:prose-blockquote:bg-primary/10 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </motion.div>
          </article>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4"
            >
              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast.success(isLiked ? 'Post unliked' : 'Post liked!');
                }}
                className={`group flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  isLiked 
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/20' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10 dark:hover:from-primary/20 dark:hover:to-purple-500/20'
                }`}
              >
                <HeartIcon className={`w-5 h-5 transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{isLiked ? 'Liked' : 'Like this post'}</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 