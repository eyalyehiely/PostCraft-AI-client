'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { generateContent } from '@/services/posts/generate'
import { useAuth } from '@clerk/nextjs'
import { savePost } from '@/services/posts/savePost'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

export default function Dashboard() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showGeneratedContent, setShowGeneratedContent] = useState(false)
  const [showSpecialRequests, setShowSpecialRequests] = useState(false)
  const [wordLimit, setWordLimit] = useState('')
  const [pronoun, setPronoun] = useState<'first' | 'second' | 'third' | ''>('')
  const { getToken } = useAuth()

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
        pronoun: pronoun as 'first' | 'second' | 'third'
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
      console.log(savedPost)
      toast.success('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Blog Post Generator</h1>
      
      <div className="flex flex-col gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">Generate New Post</CardTitle>
            <CardDescription>Enter your topic and preferred writing style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
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
          </CardContent>
        </Card>

        {showGeneratedContent && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Generated Content</CardTitle>
                <CardDescription>Edit and save your generated content</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGeneratedContent(false)}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <Textarea
                placeholder="Your generated content will appear here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-none"
                disabled={isTyping}
              />
              <Button 
                className="w-full bg-primary hover:bg-primary/90" 
                onClick={handleSaveDraft}
                disabled={!content}
              >
                Save Draft
              </Button>
            </CardContent>
          </Card>
        )}

        
      </div>
    </div>
  )
} 