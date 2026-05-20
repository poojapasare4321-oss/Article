import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.DATABASE_URL

if (!uri) {
  throw new Error("DATABASE_URL is missing")
}

// ✅ GLOBAL CONNECTION (IMPORTANT FOR VERCEL)
let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// ========================= GET BLOGS =========================
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('aaragya-insights')

    const blogs = db.collection('blogs')
    const users = db.collection('users')

    const allBlogs = await blogs
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const blogsWithAuthors = await Promise.all(
      allBlogs.map(async (blog) => {
        let author = null

        if (blog.authorId && ObjectId.isValid(blog.authorId)) {
          author = await users.findOne({
            _id: new ObjectId(blog.authorId)
          })
        }

        return {
          ...blog,
          id: blog._id.toString(),
          author: {
            name: author?.name || 'Admin',
            email: author?.email || 'admin@aaragya.com'
          }
        }
      })
    )

    return NextResponse.json(blogsWithAuthors)

  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// ========================= CREATE BLOG =========================
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || "admin123"

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      featuredImage,
      published,
      featured,
      categoryId,
      tags
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    const client = await clientPromise
    const db = client.db('aaragya-insights')
    const blogs = db.collection('blogs')

    const blog = {
      _id: new ObjectId(),
      title,
      slug,
      content,
      excerpt: excerpt || '',
      featuredImage: featuredImage || '',
      published: published || false,
      featured: featured || false,
      categoryId: categoryId || null,
      tags: tags || [],
      authorId: userId,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await blogs.insertOne(blog)

    return NextResponse.json({
      ...blog,
      id: blog._id.toString()
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}