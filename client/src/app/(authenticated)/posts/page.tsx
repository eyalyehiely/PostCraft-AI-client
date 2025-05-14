'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { fetchPosts } from '@/services/posts/fetchPosts'
import { Post } from '@/types/post'
import { TrashIcon, PencilIcon, PlusIcon, XIcon, ExternalLink, ChevronLeft, ChevronRight, GlobeIcon, LockIcon, ChevronDown } from 'lucide-react'
import { editPost } from '@/services/posts/edit'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { deletePost } from '@/services/posts/delete'
import { savePost } from '@/services/posts/savePost'
import { generateContent } from '@/services/posts/generate'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

function Posts() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showGeneratedContent, setShowGeneratedContent] = useState(false)
  const [showSpecialRequests, setShowSpecialRequests] = useState(false)
  const [wordLimit, setWordLimit] = useState('')
  const [pronoun, setPronoun] = useState<'first' | 'second' | 'third' | ''>('')

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        const token = await getToken()
        if (!token) {
          router.push('/sign-in')
          return
        }
        const fetchedPosts = await fetchPosts({ token })
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [getToken, router])

  const handleEdit = (post: Post) => {
    setEditingPostId(post.uuid)
    setEditingPost(post)
  }

  const handleCancelEdit = () => {
    setEditingPostId(null)
    setEditingPost(null)
  }

  const handleSaveEdit = async () => {
    if (!editingPost) return

    setIsSaving(true)
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      const updatedPost = await editPost(editingPost.uuid, editingPost, token)
      setPosts(posts.map(post => 
        post.uuid === editingPost.uuid ? updatedPost : post
      ))
      toast.success('Post updated successfully')
      handleCancelEdit()
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  const typeText = (text: string) => {
    let index = 0
    setIsTyping(true)
    setContent('')
    setShowGeneratedContent(true)

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setContent(prev => prev + text[index])
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 30)
  }

  const handleGenerate = async () => {
    if (!topic || !style) {
      toast.error('Please fill in both topic and writing style')
      return
    }

    setIsGenerating(true)
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      
      const generatedContent = await generateContent({ 
        topic, 
        style, 
        token,
        wordLimit: wordLimit ? parseInt(wordLimit) : undefined,
        pronoun: pronoun || undefined
      })
      typeText(generatedContent)
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!content) {
      toast.error('No content to save')
      return
    }
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      const savedPost = await savePost({ title: topic, content, style, token })
      
      // Add the new post to the list
      setPosts(prevPosts => [savedPost, ...prevPosts])
      
      toast.success('Draft saved successfully!')
      setShowCreateModal(false)
      // Reset form
      setTopic('')
      setStyle('')
      setContent('')
      setShowGeneratedContent(false)
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    }
  }

  const handleCreate = () => {
    setShowCreateModal(true)
  }

  const handleDelete = async (postUuid: string) => {
    const token = await getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }
    try {
      const result = await deletePost(postUuid, token)
      if (result !== null) {  // Only update UI if deletion was confirmed and successful
        setPosts(posts.filter(post => post.uuid !== postUuid))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const generateLink = (publicId: string) => {
    return `https://postcraft-ai.up.railway.app/posts/${publicId}`
  }

  const totalPages = Math.ceil(posts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Posts</h1>
          <p className="text-muted-foreground mt-1">Manage and edit your content</p>
        </div>
        <Button onClick={handleCreate} className="gap-2 hover:scale-105 transition-transform">
          <PlusIcon className="w-4 h-4" />
          Create New Post
        </Button>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Generate and save your new post</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">Topic</label>
              <Input
                id="topic"
                placeholder="e.g., Tech News in a Professional Tone"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="style" className="text-sm font-medium">Writing Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Funny">Funny</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Collapsible
              open={showSpecialRequests}
              onOpenChange={setShowSpecialRequests}
              className="space-y-2"
            >
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDown className={`w-4 h-4 transition-transform ${showSpecialRequests ? 'rotate-180' : ''}`} />
                Special Requests
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pl-6">
                <div className="space-y-2">
                  <label htmlFor="wordLimit" className="text-sm font-medium">Word Limit</label>
                  <Input
                    id="wordLimit"
                    type="number"
                    placeholder="e.g., 500"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    className="w-full"
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="pronoun" className="text-sm font-medium">Writing Perspective</label>
                  <Select value={pronoun} onValueChange={(value: 'first' | 'second' | 'third') => setPronoun(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select perspective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First Person (I, we)</SelectItem>
                      <SelectItem value="second">Second Person (you)</SelectItem>
                      <SelectItem value="third">Third Person (he, she, they)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Post'}
            </Button>

            {showGeneratedContent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Generated Content</label>
                  <div className="relative">
                    <Textarea
                      placeholder="Your generated content will appear here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] max-h-[50vh] resize-none overflow-y-auto"
                      disabled={isTyping}
                    />
                    {isTyping && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90" 
                  onClick={handleSaveDraft}
                  disabled={!content}
                >
                  Save Draft
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {currentPosts.map((post) => (
              <Card 
                key={post.uuid} 
                className={`group transition-all duration-300 ${
                  editingPostId === post.uuid 
                    ? 'shadow-xl scale-[1.02] border-primary/50' 
                    : 'hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {editingPostId === post.uuid ? (
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-primary">Editing Post</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          value={editingPost?.title}
                          onChange={(e) => setEditingPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                          required
                          className="w-full focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter post title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Style</label>
                        <Select
                          value={editingPost?.style}
                          onValueChange={(value) => setEditingPost(prev => prev ? { ...prev, style: value } : null)}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                            <SelectValue>{editingPost?.style || "Select style"}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Funny">Funny</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="public-mode"
                          checked={editingPost?.isPublic}
                          onCheckedChange={(checked: boolean) => setEditingPost(prev => prev ? { ...prev, isPublic: checked } : null)}
                        />
                        <label
                          htmlFor="public-mode"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Make this post public
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <div className="h-[300px] border rounded-md focus-within:ring-2 focus-within:ring-primary/20">
                          <ReactQuill
                            theme="snow"
                            value={editingPost?.content}
                            onChange={(content) => setEditingPost(prev => prev ? { ...prev, content } : null)}
                            modules={modules}
                            className="h-[250px]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          type="submit" 
                          disabled={isSaving}
                          className="flex-1 bg-primary hover:bg-primary/90 transition-colors"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="flex-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            post.isPublic 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {post.isPublic ? (
                              <>
                                <GlobeIcon className="w-3 h-3" />
                                Published
                              </>
                            ) : (
                              <>
                                <LockIcon className="w-3 h-3" />
                                Draft
                              </>
                            )}
                          </div>
                          {post.isPublic && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => {
                                const link = generateLink(post.publicId);
                                navigator.clipboard.writeText(link);
                                toast.success('Link copied to clipboard!');
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        Style: {post.style}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.preview}</p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleEdit(post)}
                        >
                          <PencilIcon className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          onClick={() => handleDelete(post.uuid)}
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "bg-primary" : "hover:bg-primary/10 hover:text-primary"}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Posts