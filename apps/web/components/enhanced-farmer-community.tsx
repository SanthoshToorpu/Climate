"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, ThumbsUp, Send, Image as ImageIcon, X } from "lucide-react"

// Simulated data for initial posts
const initialPosts = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Just harvested my first batch of organic tomatoes! Any tips on storage?",
    image: "/placeholder.svg?height=300&width=400",
    likes: 15,
    comments: [
      { id: 1, author: "Jane Smith", content: "Congrats! Store them at room temperature and away from direct sunlight." }
    ]
  },
  {
    id: 2,
    author: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Has anyone tried companion planting with marigolds? I've heard it helps with pest control.",
    image: null,
    likes: 8,
    comments: []
  }
]

export function EnhancedFarmerCommunityComponent() {
  const [posts, setPosts] = useState(initialPosts)
  const [newPost, setNewPost] = useState("")
  const [newImage, setNewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreatePost = () => {
    if (newPost.trim() || newImage) {
      const post = {
        id: posts.length + 1,
        author: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        content: newPost,
        image: newImage,
        likes: 0,
        comments: []
      }
      setPosts([post, ...posts])
      setNewPost("")
      setNewImage(null)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleComment = (postId: number, comment: string) => {
    //@ts-ignore
    setPosts(posts.map(post => 
      post.id === postId ? { 
        ...post, 
        comments: [...post.comments, { id: post.comments.length + 1, author: "Current User", content: comment }]
      } : post
    ))
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl bg-green-50">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Farmer's Community</h1>
      
      {/* Create Post */}
      <Card className="mb-6 border-green-200 bg-white">
        <CardHeader>
          <h2 className="text-xl font-semibold text-green-700">Create a Post</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your farming experiences or ask for advice..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] mb-4 border-green-200 focus:border-green-400"
          />
          {newImage && (
            <div className="relative w-full h-40 mb-4">
              <img src={newImage} alt="Uploaded" className="w-full h-full object-cover rounded-md" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setNewImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-green-600 border-green-300 hover:bg-green-100"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button onClick={handleCreatePost} className="bg-green-600 hover:bg-green-700 text-white">Post</Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <ScrollArea className="h-[600px] pr-4">
        {posts.map(post => (
          <Card key={post.id} className="mb-4 border-green-200 bg-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-green-800">{post.author}</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-900 mb-4">{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Post" className="w-full h-auto rounded-md mb-4" />
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4 w-full">
                <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} className="text-green-600 hover:text-green-700 hover:bg-green-100">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-100">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments.length}
                </Button>
              </div>
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-green-100 p-3 rounded-md w-full">
                  <p className="font-semibold text-green-800">{comment.author}</p>
                  <p className="text-green-700">{comment.content}</p>
                </div>
              ))}
              <div className="flex items-center gap-2 w-full">
                <Input placeholder="Add a comment..." className="flex-grow border-green-200 focus:border-green-400" />
                <Button size="icon" onClick={() => handleComment(post.id, "Sample comment")} className="bg-green-600 hover:bg-green-700 text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </ScrollArea>
    </div>
  )
}