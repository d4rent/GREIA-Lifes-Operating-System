'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Post {
  id: string
  content: string
  type: 'STANDARD' | 'STORY' | 'ARTICLE' | 'POLL' | 'EVENT'
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
  media: {
    id: string
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO'
    url: string
    thumbnail?: string
  }[]
  user: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  location?: string
  hashtags: string[]
  mentions: string[]
  likeCount: number
  commentCount: number
  shareCount: number
  isLiked: boolean
  comments?: Comment[]
}

interface Comment {
  id: string
  content: string
  user: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  likeCount: number
  replyCount: number
  isLiked: boolean
}

interface Story {
  id: string
  user: {
    id: string
    name: string
    image: string
  }
  media: {
    url: string
    type: 'IMAGE' | 'VIDEO'
  }
  createdAt: string
  expiresAt: string
  hasViewed: boolean
}

export default function ConnectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [postContent, setPostContent] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [selectedStoryMedia, setSelectedStoryMedia] = useState<File | null>(null)
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [activeStory, setActiveStory] = useState<Story | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchPosts()
    fetchStories()
  }, [user])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
      setLoading(false)
    } catch (error) {
      setError('Error loading posts')
      setLoading(false)
    }
  }

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      if (!response.ok) throw new Error('Failed to fetch stories')
      const data = await response.json()
      setStories(data)
    } catch (error) {
      console.error('Error loading stories:', error)
    }
  }

  const handlePostSubmit = async () => {
    if (!postContent.trim() && selectedMedia.length === 0) return

    try {
      const formData = new FormData()
      formData.append('content', postContent)
      selectedMedia.forEach((file) => {
        formData.append('media', file)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to create post')

      setPostContent('')
      setSelectedMedia([])
      fetchPosts()
    } catch (error) {
      setError('Error creating post')
    }
  }

  const handleStorySubmit = async () => {
    if (!selectedStoryMedia) return

    try {
      const formData = new FormData()
      formData.append('media', selectedStoryMedia)

      const response = await fetch('/api/stories', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to create story')

      setSelectedStoryMedia(null)
      setShowStoryModal(false)
      fetchStories()
    } catch (error) {
      setError('Error creating story')
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to like post')

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
                isLiked: !post.isLiked,
              }
            : post
        )
      )
    } catch (error) {
      setError('Error liking post')
    }
  }

  const handleComment = async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error('Failed to add comment')

      const newComment = await response.json()

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
                commentCount: post.commentCount + 1,
              }
            : post
        )
      )
    } catch (error) {
      setError('Error adding comment')
    }
  }

  const handleShare = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/share`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to share post')

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, shareCount: post.shareCount + 1 }
            : post
        )
      )
    } catch (error) {
      setError('Error sharing post')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Stories */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {/* Add Story Button */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowStoryModal(true)}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-1">
              <span className="text-2xl">+</span>
            </div>
            <span className="text-sm">Add Story</span>
          </div>

          {/* Story Previews */}
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActiveStory(story)}
            >
              <div
                className={`w-16 h-16 rounded-full ${
                  story.hasViewed ? 'ring-gray-300' : 'ring-primary'
                } ring-2 p-0.5`}
              >
                <Avatar className="w-full h-full">
                  <AvatarImage src={story.user.image} alt={story.user.name} />
                  <AvatarFallback>
                    {story.user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-sm mt-1">{story.user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src={user?.image} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={3}
              />
              {selectedMedia.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedMedia.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Selected media"
                        width={200}
                        height={200}
                        className="rounded object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6"
                        onClick={() =>
                          setSelectedMedia(selectedMedia.filter((_, i) => i !== index))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('media-input')?.click()}
                  >
                    📷 Photo/Video
                  </Button>
                  <input
                    id="media-input"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setSelectedMedia([
                        ...selectedMedia,
                        ...(e.target.files ? Array.from(e.target.files) : []),
                      ])
                    }
                  />
                  <Button variant="outline" size="sm">
                    📍 Location
                  </Button>
                  <Button variant="outline" size="sm">
                    🏷️ Tag People
                  </Button>
                </div>
                <Button onClick={handlePostSubmit}>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user.image} alt={post.user.name} />
                    <AvatarFallback>
                      {post.user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                      {post.location && ` • ${post.location}`}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Save Post</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    {post.user.id === user?.id && (
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Post Content */}
              <div className="mb-4">
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.hashtags.length > 0 && (
                  <div className="mt-2">
                    {post.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-primary hover:underline cursor-pointer mr-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Media */}
              {post.media.length > 0 && (
                <div
                  className={`grid ${
                    post.media.length === 1
                      ? 'grid-cols-1'
                      : post.media.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  } gap-2 mb-4`}
                >
                  {post.media.map((media) => (
                    <div key={media.id}>
                      {media.type === 'IMAGE' ? (
                        <Image
                          src={media.url}
                          alt="Post media"
                          width={400}
                          height={400}
                          className="rounded object-cover"
                        />
                      ) : media.type === 'VIDEO' ? (
                        <video
                          src={media.url}
                          controls
                          className="rounded w-full"
                          poster={media.thumbnail}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div>{post.likeCount} likes</div>
                <div>
                  {post.commentCount} comments • {post.shareCount} shares
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between border-y py-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.isLiked ? 'text-primary' : ''}
                >
                  {post.isLiked ? '❤️' : '🤍'} Like
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    document.getElementById(`comment-input-${post.id}`)?.focus()
                  }
                >
                  💭 Comment
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(post.id)}
                >
                  ↗️ Share
                </Button>
              </div>

              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={comment.user.image}
                          alt={comment.user.name}
                        />
                        <AvatarFallback>
                          {comment.user.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="font-medium">{comment.user.name}</div>
                          <p>{comment.content}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <button
                            onClick={() => handleLike(comment.id)}
                            className={comment.isLiked ? 'text-primary' : ''}
                          >
                            Like
                          </button>
                          <button>Reply</button>
                          <span>{comment.likeCount} likes</span>
                          <span>{comment.replyCount} replies</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex items-center space-x-3 mt-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id={`comment-input-${post.id}`}
                  placeholder="Write a comment..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(post.id, e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}