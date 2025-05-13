export interface Post {
  id: number
  uuid: string
  title: string
  publicId: string
  content: string
  preview: string
  date: string
  style: string
  isPublic: boolean
  author: {
    _id: string
    email: string
    name?: string
    first_name?: string
    last_name?: string
    image?: string
  }
  createdAt: string
  updatedAt: string
} 