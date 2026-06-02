'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { motion } from "framer-motion";





export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    published: false,
    featured: false,
    categoryId: '',
    tags: ''
  })



  const [editBlog, setEditBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    published: false,
    featured: false,
    categoryId: '',
    tags: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchBlogs()
  }, [session, status, router])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs')
      const data = await response.json()

      // Ensure data is always an array
      if (Array.isArray(data)) {
        setBlogs(data)
      } else {
        console.error('Invalid data format:', data)
        setBlogs([])
        setError('Failed to load blogs. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogs([])
      setError('Failed to load blogs. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBlog = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBlog,
          tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewBlog({
          title: '',
          content: '',
          excerpt: '',
          featuredImage: '',
          published: false,
          featured: false,
          categoryId: '',
          tags: ''
        })
        setShowCreateForm(false)
        setMessage('Blog created successfully!')
        fetchBlogs()
      } else {
        setError(data.error || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      setError('An error occurred while creating the blog')
    }
  }

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleStartEdit = (blog) => {
    setEditingBlog(blog.id)
    setEditBlog({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      featuredImage: blog.featuredImage || '',
      published: blog.published,
      featured: blog.featured,
      categoryId: blog.categoryId || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : ''
    })
    setShowCreateForm(false)
    setMessage('')
    setError('')
  }

  const handleUpdateBlog = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/blogs/${editingBlog}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editBlog,
          tags: editBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEditingBlog(null)
        setEditBlog({
          title: '',
          content: '',
          excerpt: '',
          featuredImage: '',
          published: false,
          featured: false,
          categoryId: '',
          tags: ''
        })
        setMessage('Blog updated successfully!')
        fetchBlogs()
      } else {
        setError(data.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      setError('An error occurred while updating the blog')
    }
  }

  const togglePublish = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto"></div>
          <p className="text-sm mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="
min-h-screen
bg-[radial-gradient(circle_at_10%_20%,rgba(255,182,193,0.65)_0%,transparent_38%),radial-gradient(circle_at_50%_0%,rgba(196,181,253,0.55)_0%,transparent_42%),radial-gradient(circle_at_95%_15%,rgba(147,197,253,0.65)_0%,transparent_40%),radial-gradient(circle_at_30%_60%,rgba(255,255,255,0.45)_0%,transparent_45%),linear-gradient(to_bottom,#fde7f3_0%,#efe7ff_45%,#dbeafe_75%,#f8fafc_100%)]
"
    >
      {/* Header */}


<header className="relative">

  <div
    className="
    flex
    items-center
    justify-between

    max-[150px]:flex-col
    max-[150px]:items-end

    px-4
    sm:px-6
    md:px-12
    lg:px-24
    py-5
    "
  >






    {/* LEFT SIDE */}
    <div className="flex items-center gap-4 sm:gap-8">



    <div className="flex flex-col justify-center min-w-0">

  {/* Heading */}
  <h1
    className="
      text-[15px]
      min-[380px]:text-lg
      sm:text-2xl
      md:text-3xl

      font-extrabold
      tracking-tight
      text-[#610f94]

      leading-tight

      break-all
      min-[380px]:break-normal
    "
  >
    Aarogya Insights
  </h1>

  {/* Subtitle */}
  <div
    className="
      mt-1.5
      sm:mt-2

      inline-flex
      items-center
      gap-1.5
      sm:gap-2

      w-fit
      max-w-full
    "
  >
    <span
      className="
        h-2
        w-2
        rounded-full
        bg-gradient-to-r
        from-pink-500
        to-violet-500
        animate-pulse
        flex-shrink-0
      "
    />

    <p
      className="
        text-[9px]
        min-[380px]:text-[10px]
        sm:text-xs

        font-semibold
        tracking-wide
        text-[#7b4bb3]

        leading-tight

        break-all
        min-[380px]:break-normal
      "
    >
      Admin Dashboard
    </p>
  </div>

</div>  






    </div>

    {/* DESKTOP RIGHT SIDE */}
    <div className="hidden md:flex items-center gap-4">

      {/* Profile Card */}
      <div
        className="
          flex
          items-center
          gap-3
          px-4
          py-2
          rounded-2xl
          bg-white/35
          backdrop-blur-xl
          border border-white/40
          shadow-[0_8px_24px_rgba(255,255,255,0.25)]
        "
      >

        {/* Avatar */}
        <div
          className="
            w-10
            h-10
            rounded-full
            bg-gradient-to-br
            from-pink-400
            via-purple-400
            to-blue-400
            flex
            items-center
            justify-center
            text-white
            font-bold
            text-sm
            shadow-lg
          "
        >
          {session?.user?.name?.charAt(0) || "A"}
        </div>

        {/* Text */}
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-800">
            {session?.user?.name || session?.user?.email}
          </p>

          <p className="text-xs font-medium text-purple-700/80">
            Administrator
          </p>
        </div>

      </div>

      {/* NAV BUTTONS */}
      <div
        className="
          relative
          flex
          items-center
          rounded-2xl
          overflow-hidden
          bg-white/35
          backdrop-blur-xl
          border border-white/40
          shadow-[0_8px_24px_rgba(255,255,255,0.2)]
        "
      >

        <Link
          href="/"
          className="
            pl-4
            pr-3
            py-3
            text-sm
            font-semibold
            text-blue-700
            hover:bg-white/20
            transition-all
            duration-300
          "
        >
          Visit Home
        </Link>

        <div className="w-[1px] h-6 bg-white/30"></div>

        <button
          onClick={() => signOut()}
          className="
            pl-3
            pr-4
            py-3
            text-sm
            font-semibold
            text-red-600
            hover:bg-white/20
            transition-all
            duration-300
          "
        >
          Sign Out
        </button>

      </div>

    </div>

    {/* MOBILE MENU BUTTON */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="
        md:hidden
        p-2
        rounded-xl
        bg-white/30
        backdrop-blur-lg
        border border-white/30
      "
    >
      {isMobileMenuOpen ? (
        <svg
          className="w-6 h-6 text-[#610f94]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-[#610f94]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>

  </div>

  {/* MOBILE MENU */}
  {isMobileMenuOpen && (
    <div
      className="
        md:hidden
        px-4
        pb-5
      "
    >

      <div
        className="
          rounded-3xl
          bg-white/40
          backdrop-blur-2xl
          border border-white/30
          shadow-xl
          p-4
          space-y-4
        "
      >

        {/* Profile */}
        <div className="flex items-center gap-2">

          <div
            className="
              w-11
              h-11
              rounded-full
              bg-gradient-to-br
              from-pink-400
              via-purple-400
              to-blue-400
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
          >
            {session?.user?.name?.charAt(0) || "A"}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {session?.user?.name || session?.user?.email}
            </p>

            <p className="text-xs text-purple-700/80 font-medium">
              Administrator
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <Link
            href="/"
            className="
              px-4
              py-3
              rounded-2xl
              bg-white/30
              text-sm
              font-semibold
              text-blue-700
              hover:bg-white/50
              transition-all
            "
          >
            Visit Home
          </Link>

          <button
            onClick={() => signOut()}
            className="
              px-4
              py-3
              rounded-2xl
              bg-white/30
              text-sm
              font-semibold
              text-red-600
              hover:bg-white/50
              transition-all
              text-left
            "
          >
            Sign Out
          </button>

         <svg
                  className="outline absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 75"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    className="rect"
                    pathLength="100"
                    x="0"
                    y="0"
                    width="400"
                    height="75"
                    rx="10"
                    ry="10"
                    fill="transparent"
                    strokeWidth="1.5"
                  />
                </svg>

        </div>







      </div>

    </div>
  )}

</header>




     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* <div className="w-full px-6 md:px-10 lg:px-14 py-6 md:py-8"> */}
        
        
   
        
                {/* Key Metrics Cards */}
               
                {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10"> */}

                <div
  className="
    grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4
  gap-3
  sm:gap-4
  md:gap-6
  relative
  z-10
  "
>
                  
        
                  {/* Total Blogs */}
                  <div className="
          relative
          group
         h-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px]
          flex-shrink-0
          bg-white
          rounded-[28px]
          p-3 sm:p-4 md:p-6
          overflow-hidden
          border border-[#e8eef5]
          shadow-[0_6px_18px_rgba(15,23,42,.05)]
          transition-all duration-500 ease-out
          hover:-translate-y-2
          hover:scale-[1.02]
          hover:border-blue-100
          hover:shadow-[0_20px_35px_rgba(59,130,246,.10)]
        ">
        
                    {/* Animated Top Border */}
                    <div className="
            absolute
            top-0
            left-[-100%]
            w-full
            h-1
            bg-gradient-to-r
            from-blue-500
            to-cyan-400
            transition-all
            duration-700
            group-hover:left-0
          "></div>
        
                    {/* Glow Circle */}
                    <div className="
            absolute
            -top-20
            -right-20
            w-44
            h-44
            rounded-full
            bg-blue-500/10
            blur-3xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-110
          "></div>
        
                    {/* Content */}
                    {/* <div className="relative z-10 flex flex-col items-center justify-center text-center"> */}
                   <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[170px] h-full">
        
                      {/* Icon Wrapper */}
                      <div className="
             w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
              rounded-[22px]
              bg-gradient-to-br
              from-blue-50
              to-cyan-100
              flex
              items-center
              justify-center
              mb-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_20px_rgba(59,130,246,.10)]
              transition-all
              duration-500
              group-hover:-translate-y-1
              group-hover:-rotate-3
              group-hover:shadow-[0_15px_25px_rgba(59,130,246,.18)]
            ">
        

        
        
        {/* Icon Wrapper */}
        

        
        
        <div
          className="
            relative
           w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
            rounded-2xl
            bg-white/70
            border
            border-white/80
            backdrop-blur-xl
            flex
            items-center
            justify-center
            overflow-hidden
            transition-all
            duration-500
            cursor-pointer
            shadow-[0_10px_30px_rgba(59,130,246,0.12)]
            group-hover:-translate-y-1
            group-hover:shadow-[0_20px_40px_rgba(59,130,246,0.18)]
          "
        >
          {/* Glow */}
          <div
            className="
              absolute
              -top-8
              -left-8
              w-28
              h-28
              rounded-full
              bg-blue-400/20
              blur-2xl
              transition-all
              duration-500
              group-hover:scale-125
            "
          />
        
          {/* File */}
          <div
            className="
              relative
              w-[34px]
              h-[42px]
              rounded-xl
              bg-gradient-to-b
              from-white
              to-blue-50
              shadow-[0_8px_20px_rgba(37,99,235,0.12)]
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-2
              z-10
            "
          >
            {/* Folded corner */}
            <div
              className="
                absolute
                top-0
                right-0
                w-4
                h-4
                bg-blue-200
                clip-path-triangle
              "
              style={{
                clipPath: "polygon(100% 0,0 0,100% 100%)",
              }}
            />
        
            {/* Lines */}
            <div className="mt-4 ml-2 w-5 h-[3px] rounded-full bg-blue-600" />
            <div className="mt-2 ml-2 w-4 h-[3px] rounded-full bg-blue-500" />
            <div className="mt-2 ml-2 w-6 h-[3px] rounded-full bg-blue-400" />
          </div>
        </div>
        
        
                      </div>
        
                      {/* Number */}
                      <p className="
              text-2xl sm:text-3xl md:text-5xl
              font-extrabold
              text-slate-800
              leading-none
              mb-2
              transition-all
              duration-300
              group-hover:scale-110
            ">
                        {Array.isArray(blogs) ? blogs.length : 0}
                      </p>
        
                      {/* Label */}
                      <p className="
              text-xs
              md:text-sm
              font-bold
              text-slate-500
              uppercase
              tracking-[2px]
            ">
                        Total Blogs
                      </p>
        
                    </div>
                  </div>
        
        
                  {/* Published Blogs */}
        
                  {/* Published Blogs */}
                  <div className="
          relative
          h-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px]
          flex-shrink-0
          bg-white
          rounded-[28px]
          p-3 sm:p-4 md:p-6
          overflow-hidden
          border border-[#e8eef5]
          shadow-[0_6px_18px_rgba(15,23,42,.05)]
          transition-all duration-500 ease-out
          hover:-translate-y-2
          hover:scale-[1.02]
          hover:border-green-100
          hover:shadow-[0_20px_35px_rgba(34,197,94,.10)]
          group
        ">
        
                    {/* Animated Top Border */}
                    <div className="
            absolute
            top-0
            left-[-100%]
            w-full
            h-1
            bg-gradient-to-r
            from-green-500
            to-emerald-400
            transition-all
            duration-700
            group-hover:left-0
          "></div>
        
                    {/* Glow Circle */}
                    <div className="
            absolute
            -top-20
            -right-20
            w-44
            h-44
            rounded-full
            bg-green-500/10
            blur-3xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-110
          "></div>
        
                    {/* Content */}
                    {/* <div className="relative z-10 flex flex-col items-center justify-center text-center"> */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[170px] h-full">
        
                      {/* Icon Wrapper */}
                      <div className="
             w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
              rounded-[22px]
              bg-gradient-to-br
              from-green-50
              to-emerald-100
              flex
              items-center
              justify-center
              mb-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_20px_rgba(34,197,94,.10)]
              transition-all
              duration-500
              group-hover:-translate-y-1
              group-hover:-rotate-3
              group-hover:shadow-[0_15px_25px_rgba(34,197,94,.18)]
            ">
        

        
                        <div
          className="
            relative
           w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
            rounded-full
            border-[5px]
            border-[#2ddc34]
            transition-all
            duration-300
            group-hover:scale-110
          "
        >
          <div
            className="
               absolute
    left-1/2
    top-1/2

    w-[22%]
    h-[45%]

    border-r-[5px]
    border-b-[5px]
    border-[#2ddc34]

    rotate-45

    -translate-x-1/2
    -translate-y-[65%]
            "
          ></div>
        </div>
        
        
        
                      </div>
        
                      {/* Number */}
                      <p className="
             text-2xl sm:text-3xl md:text-5xl
              font-extrabold
              text-green-700
              leading-none
              mb-2
              transition-all
              duration-300
              group-hover:scale-110
            ">
                        {Array.isArray(blogs)
                          ? blogs.filter(blog => blog.published).length
                          : 0}
                      </p>
        
                      {/* Label */}
                      <p className="
              text-xs
              md:text-sm
              font-bold
              text-slate-500
              uppercase
              tracking-[2px]
            ">
                        Published
                      </p>
        
                    </div>
                  </div>
        
                  {/* Draft Blogs */}
        
                  <div className="
          relative
          h-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px]
          flex-shrink-0
          bg-white
          rounded-[28px]
          p-3 sm:p-4 md:p-6
          overflow-hidden
          border border-[#e8eef5]
          shadow-[0_6px_18px_rgba(15,23,42,.05)]
          transition-all duration-500 ease-out
          hover:-translate-y-2
          hover:scale-[1.02]
          hover:border-yellow-100
          hover:shadow-[0_20px_35px_rgba(234,179,8,.10)]
          group
        ">
        
                    {/* Animated Top Border */}
                    <div className="
            absolute
            top-0
            left-[-100%]
            w-full
            h-1
            bg-gradient-to-r
            from-yellow-500
            to-amber-400
            transition-all
            duration-700
            group-hover:left-0
          "></div>
        
                    {/* Glow Circle */}
                    <div className="
            absolute
            -top-20
            -right-20
            w-44
            h-44
            rounded-full
            bg-yellow-500/10
            blur-3xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-110
          "></div>
        
                    {/* Content */}
                    {/* <div className="relative z-10 flex flex-col items-center justify-center text-center"> */}
                      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[170px] h-full">
        
                      {/* Icon Wrapper */}
                      <div className="
             w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
              rounded-[22px]
              bg-gradient-to-br
              from-yellow-50
              to-amber-100
              flex
              items-center
              justify-center
              mb-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_20px_rgba(234,179,8,.10)]
              transition-all
              duration-500
              group-hover:-translate-y-1
              group-hover:-rotate-3
              group-hover:shadow-[0_15px_25px_rgba(234,179,8,.18)]
            ">
        
                        <svg
                          className="
                 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
                  text-yellow-600
                  transition-all
                  duration-300
                  group-hover:scale-110
                "
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
        
                     
        
        
        
                      </div>
        
                      {/* Number */}
                      <p className="
              text-2xl sm:text-3xl md:text-5xl
              font-extrabold
              text-yellow-700
              leading-none
              mb-2
              transition-all
              duration-300
              group-hover:scale-110
            ">
                        {Array.isArray(blogs)
                          ? blogs.filter(blog => !blog.published).length
                          : 0}
                      </p>
        
                      {/* Label */}
                      <p className="
              text-xs
              md:text-sm
              font-bold
              text-slate-500
              uppercase
              tracking-[2px]
            ">
                        Drafts
                      </p>
        
                    </div>
                  </div>
        
        
                  {/* Featured Blogs */}
        
                  <div className="
          relative
          h-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px]
          flex-shrink-0
          bg-white
          rounded-[28px]
          p-3 sm:p-4 md:p-6
          overflow-hidden
          border border-[#e8eef5]
          shadow-[0_6px_18px_rgba(15,23,42,.05)]
          transition-all duration-500 ease-out
          hover:-translate-y-2
          hover:scale-[1.02]
          hover:border-purple-100
          hover:shadow-[0_20px_35px_rgba(168,85,247,.10)]
          group
        ">
        
                    {/* Animated Top Border */}
                    <div className="
            absolute
            top-0
            left-[-100%]
            w-full
            h-1
            bg-gradient-to-r
            from-purple-500
            to-fuchsia-400
            transition-all
            duration-700
            group-hover:left-0
          "></div>
        
                    {/* Glow Circle */}
                    <div className="
            absolute
            -top-20
            -right-20
            w-44
            h-44
            rounded-full
            bg-purple-500/10
            blur-3xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-110
          "></div>
        
                    {/* Content */}
                    {/* <div className="relative z-10 flex flex-col items-center justify-center text-center"> */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[170px] h-full">
        
                      {/* Icon Wrapper */}
                      <div className="
              w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
              rounded-[22px]
              bg-gradient-to-br
              from-purple-50
              to-fuchsia-100
              flex
              items-center
              justify-center
              mb-5
              shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_20px_rgba(168,85,247,.10)]
              transition-all
              duration-500
              group-hover:-translate-y-1
              group-hover:-rotate-3
              group-hover:shadow-[0_15px_25px_rgba(168,85,247,.18)]
            ">
        
                        <svg
                          className="
                 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
                  text-purple-600
                  transition-all
                  duration-300
                  group-hover:scale-110
                "
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
        
        
        
                      </div>
        
                      {/* Number */}
                      <p className="
             text-2xl sm:text-3xl md:text-5xl
              font-extrabold
              text-purple-700
              leading-none
              mb-2
              transition-all
              duration-300
              group-hover:scale-110
            ">
                        {Array.isArray(blogs)
                          ? blogs.filter(blog => blog.featured).length
                          : 0}
                      </p>
        
                      {/* Label */}
                      <p className="
              text-xs
              md:text-sm
              font-bold
              text-slate-500
              uppercase
              tracking-[2px]
            ">
                        Featured
                      </p>
        
                    </div>
                  </div>
        
        
                </div>
              </div>
    
   



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
 

        {/* Blog Management Header */}
      
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
          
 <div className="min-w-0 w-full md:w-auto">
    
    <h2
      className="
        text-[17px]
        xs:text-lg
        sm:text-xl
        md:text-2xl
        font-bold
        text-[#610f94]
        leading-tight
        break-words
      "
    >
      Blog Management
    </h2>

    <p
      className="
        text-[11px]
        sm:text-sm
        text-gray-600
        mt-1
        leading-relaxed
        break-words
      "
    >
      Manage and create blog posts
    </p>

  </div>

          {/* <div className="flex items-center justify-between md:justify-end space-x-4 w-full lg:w-[400px] md:w-auto"> */}
          {/* <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto"> */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
            {/* <div className="text-left md:text-right"> */}
            <div className="text-left md:text-right w-full xs:w-auto">
              <div className="text-2xl sm:text-3xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-0 leading-none md:leading-8">
                {Array.isArray(blogs) ? blogs.length : 0}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 md:text-gray-600 font-medium md:font-normal uppercase md:normal-case tracking-wide md:tracking-normal">Total Posts</div>
            </div>

     
  <button
  onClick={() => setShowCreateForm(!showCreateForm)}
  className="
    w-full
    min-[380px]:w-auto

    px-3
    min-[380px]:px-4
    sm:px-6

    py-2
    min-[380px]:py-2.5
    sm:py-3

    text-xs
    min-[380px]:text-sm
    sm:text-base

    bg-blue-600
    text-white
    font-semibold
    rounded-lg

    hover:bg-blue-700
    transition-all
    duration-200

    shadow-lg
    hover:shadow-xl

    transform
    hover:-translate-y-0.5

    flex
    items-center
    justify-center
    gap-1.5
    min-[380px]:gap-2

      whitespace-normal
    min-[480px]:whitespace-nowrap
  "
>
  <svg
    className="
      w-4 h-4
      min-[380px]:w-5 min-[380px]:h-5
    "
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>

 <span
  className="
    text-center
    leading-tight

    break-normal
    
  "
>
  {showCreateForm ? "Cancel" : "Create New Blog"}
</span>
</button>       


          </div>
        </div>


        {/* Success Message */}
        {message && (
          <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-emerald-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Blog Form */}
        {editingBlog && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Blog Post
            </h3>
            <form onSubmit={handleUpdateBlog} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Blog Title *
                </label>
                <input
                  type="text"
                  value={editBlog.title}
                  onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-lg font-semibold bg-white text-slate-900"
                  placeholder="Enter an engaging title for your blog post..."
                  required
                />
                <p className="text-sm text-slate-500">This will be the main headline of your blog post</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Blog Excerpt
                </label>
                <textarea
                  value={editBlog.excerpt}
                  onChange={(e) => setEditBlog({ ...editBlog, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  rows="4"
                  placeholder="Write a brief summary or description of your blog post..."
                />
                <p className="text-sm text-slate-500">A short description that will appear on the blog listing page</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Blog Content *
                </label>
                <textarea
                  value={editBlog.content}
                  onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  rows="15"
                  placeholder="Write your blog post content here. You can include multiple paragraphs, details, and information..."
                  required
                />
                <p className="text-sm text-slate-500">The main content of your blog post. Be detailed and informative!</p>
              </div>

              <ImageUpload
                imageType="banner"
                onImageUpload={(url) => setEditBlog({ ...editBlog, featuredImage: url })}
                currentImage={editBlog.featuredImage}
                label="Featured Image (Optional)"
                description="Upload a banner image for your blog post - this is completely optional"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editBlog.tags}
                  onChange={(e) => setEditBlog({ ...editBlog, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  placeholder="healthcare, innovation, technology, telemedicine"
                />
                <p className="text-sm text-slate-500">Separate multiple tags with commas (e.g., healthcare, innovation, technology)</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Blog Settings</h4>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editBlog.published}
                      onChange={(e) => setEditBlog({ ...editBlog, published: e.target.checked })}
                      className="mr-3 w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Published</span>
                    <span className="text-xs text-slate-500 ml-1">(Visible to public)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editBlog.featured}
                      onChange={(e) => setEditBlog({ ...editBlog, featured: e.target.checked })}
                      className="mr-3 w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Featured</span>
                    <span className="text-xs text-slate-500 ml-1">(Highlighted on homepage)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium border border-green-200"
                >
                  Update Blog Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Blog Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Blog Post
            </h3>
            <form onSubmit={handleCreateBlog} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Blog Title *
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-lg font-semibold bg-white text-slate-900"
                  placeholder="Enter an engaging title for your blog post..."
                  required
                />
                <p className="text-sm text-slate-500">This will be the main headline of your blog post</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Blog Excerpt
                </label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  rows="4"
                  placeholder="Write a brief summary or description of your blog post..."
                />
                <p className="text-sm text-slate-500">A short description that will appear on the blog listing page</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Blog Content *
                </label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  rows="15"
                  placeholder="Write your blog post content here. You can include multiple paragraphs, details, and information..."
                  required
                />
                <p className="text-sm text-slate-500">The main content of your blog post. Be detailed and informative!</p>
              </div>

              <ImageUpload
                imageType="banner"
                onImageUpload={(url) => setNewBlog({ ...newBlog, featuredImage: url })}
                currentImage={newBlog.featuredImage}
                label="Featured Image (Optional)"
                description="Upload a banner image for your blog post - this is completely optional"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newBlog.tags}
                  onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  placeholder="healthcare, innovation, technology, telemedicine"
                />
                <p className="text-sm text-slate-500">Separate multiple tags with commas (e.g., healthcare, innovation, technology)</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Blog Settings</h4>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newBlog.published}
                      onChange={(e) => setNewBlog({ ...newBlog, published: e.target.checked })}
                      className="mr-3 w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Published</span>
                    <span className="text-xs text-slate-500 ml-1">(Visible to public)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newBlog.featured}
                      onChange={(e) => setNewBlog({ ...newBlog, featured: e.target.checked })}
                      className="mr-3 w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Featured</span>
                    <span className="text-xs text-slate-500 ml-1">(Highlighted on homepage)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium border border-purple-200"
                >
                  Create Blog Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Management Section - Matching Reference Design */}





        {/* Premium Blog Management UI */}
        <div className="space-y-10">
          {Array.isArray(blogs) &&
            blogs.map((blog, index) => (
              <div
                key={blog.id}
                className={`flex items-center relative ${index % 2 !== 0 ? "flex-row-reverse" : ""
                  } max-lg:flex-col`}
              >
                {/* BLUE PANEL */}
                <div
                  className="
            relative z-10 shrink-0
            w-full
max-w-[400px]
min-h-[480px]
           
            px-12 pt-6 pb-10
            text-white
            overflow-visible
            shadow-[0_30px_60px_rgba(70,65,220,.18)]
            bg-[linear-gradient(135deg,#5148f0,#4037d3)]
            flex flex-col justify-between
            max-lg:w-full
          "
                >
                  {/* Triangle */}
       


{index % 2 === 0 && (
  <>
    {/* Exact Triangle Fold */}
    <div
      className="
        absolute
        bottom-[-60px]
        right-0
        z-20
        w-[60px]
        h-[60px]
        bg-gradient-to-br
        from-[#0d32ad]
        to-[#1e5bf2]
      "
      style={{
        clipPath: "polygon(0 0, 100% 0, 0 100%)",
      }}
    />

    {/* Fold Joining Line */}
    <div
      className="
        absolute
        bottom-0
        right-0
        z-30
        w-[84px]
        h-[1.5px]
        bg-white/15
        origin-right
        rotate-[-45deg]
      "
    />
  </>
)}




<div className="flex items-center justify-between gap-10 flex-wrap mt-6">
  
  {/* AUTHOR */}
  {/* <div className="flex items-center gap-2">
    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-sm">
      <span className="text-lg font-bold">
        {blog.author?.name
          ? blog.author.name.charAt(0).toUpperCase()
          : "R"}
      </span>
    </div>

    <div>
      <p className="text-[22px] font-medium">
        {blog.author?.name || "reddy"}
      </p>

      <p className="text-sm text-white/70 capitalize">
        {blog.author?.role || "Blogger"}
      </p>
    </div>
  </div> */}

  <div className="flex items-center gap-2 min-w-0 overflow-hidden">

  {/* Avatar */}
  <div
    className="
      w-10 h-10
      sm:w-12 sm:h-12

      rounded-full
      bg-white/20

      flex
      items-center
      justify-center

      border border-white/20
      backdrop-blur-sm

      shrink-0
    "
  >
    <span className="text-base sm:text-lg font-bold">
      {blog.author?.name
        ? blog.author.name.charAt(0).toUpperCase()
        : "B"}
    </span>
  </div>

  {/* Text */}
  <div className="min-w-0 max-w-full overflow-hidden">

    <p
      className="
        text-base
        min-[380px]:text-lg
        sm:text-[22px]

        font-medium
        leading-tight

        break-all
        min-[380px]:break-normal
      "
    >
      {blog.author?.name || session?.user?.name || "Blogger"}
    </p>

    <p
      className="
        text-xs
        sm:text-sm

        text-white/70
        capitalize

        leading-tight

        break-all
        min-[380px]:break-normal
      "
    >
      {blog.author?.role || "Blogger"}
    </p>

  </div>

</div>

  {/* TAGS */}
  {/* {blog.tags && blog.tags.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {blog.tags.slice(0, 6).map((tag, tagIndex) => (
        <span
          key={tagIndex}
          className="
            inline-flex
            px-5 py-3
            rounded-full
            bg-white/20 border-white/20 backdrop-blur-sm
            text-[#edf4ff]
            text-sm
            font-semibold
          "
        >
          {tag}
        </span>
      ))}
    </div>
  )} */}

{blog.tags && blog.tags.length > 0 && (
  <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">

    {blog.tags.slice(0, 6).map((tag, tagIndex) => (
      <span
        key={tagIndex}
        className="
          inline-flex

          px-2
          min-[380px]:px-4
          sm:px-5

          py-1.5
          sm:py-3

          rounded-full

          bg-white/20
          border border-white/20
          backdrop-blur-sm

          text-[#edf4ff]

          text-[10px]
          min-[380px]:text-sm

          font-semibold

          break-all
          min-[380px]:break-normal

          max-w-full
          overflow-hidden
        "
      >
        {tag}
      </span>
    ))}

  </div>
)}

</div>



                    {/* HEADING */}
          

                    <h2
  className="
    mt-8
    sm:mt-12

    text-[28px]
    min-[380px]:text-[34px]
    sm:text-[48px]
    lg:text-[64px]

    leading-tight
    sm:leading-[1.3]
    lg:leading-[1.55]

    font-extrabold
    tracking-[-1px]

    break-words
  "
>
  {blog.title}
</h2>

                    {/* LINE */}
                    {/* <div className="w-[80px] h-[5px] rounded-full bg-cyan-400 mt-8" /> */}
                    <div
  className="
    w-[40px]
    min-[380px]:w-[60px]
    sm:w-[80px]

    h-[3px]
    sm:h-[5px]

    rounded-full
    bg-cyan-400

    mt-4
    sm:mt-8
  "
/>
             

                  {/* BOTTOM META */}
                  {/* <div className="flex gap-14 mt-14">
                    <div>
                      <p className="text-lg text-white/70 mb-1">Created</p>

                      <h4 className="text-[34px] font-bold">
                        {new Date(blog.createdAt).getDate()}
                      </h4>
                    </div>

                    <div>
                      <p className="text-lg text-white/70 mb-1">Views</p>

                      <h4 className="text-[34px] font-bold">
                        {blog.views || 0}
                      </h4>
                    </div>
                  </div> */}


<div className="flex flex-wrap gap-6 sm:gap-10 lg:gap-14 mt-8 sm:mt-14 overflow-hidden">

  {/* CREATED */}
  <div className="min-w-0 max-w-full">

    <p
      className="
        text-[10px]
        min-[380px]:text-xs
        sm:text-lg

        text-white/70
        mb-1

        break-all
        min-[380px]:break-normal
      "
    >
      Created
    </p>

    <h4
      className="
        text-xl
        sm:text-2xl
        lg:text-[34px]

        font-bold

        break-all
        min-[380px]:break-normal
      "
    >
      
          {new Date(blog.createdAt).toLocaleDateString()}
    </h4>
  </div>

  {/* VIEWS */}
  <div className="min-w-0 max-w-full">

    <p
      className="
        text-[10px]
        min-[380px]:text-xs
        sm:text-lg

        text-white/70
        mb-1

        break-all
        min-[380px]:break-normal
      "
    >
      Views
    </p>

    <h4
      className="
        text-xl
        sm:text-2xl
        lg:text-[34px]

        font-bold

        break-all
        min-[380px]:break-normal
      "
    >
      {blog.views || 0}
    </h4>

  </div>

</div>

                  
                </div>

                {/* WHITE CARD */}
            


<div
  className={`
    grid
    ${
      index % 2 !== 0
        ? "lg:grid-cols-[480px_minmax(150px,1fr)]"
        : "lg:grid-cols-[minmax(150px,1fr)_480px]"
    }
    items-center
    gap-x-[2px]
    gap-y-[20px]
  `}
>
  {/* BLUE CARD */}
  <div
    className={`
      relative
      ${index % 2 !== 0 ? "lg:order-2" : ""}
    `}
  >
    {/* YOUR BLUE CARD HERE */}
  </div>

  {/* WHITE CONTENT */}
<motion.div
  initial={{
    opacity: 0,
    y: 120,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  whileOutOfView={{
    opacity: 0,
    y: -80,
  }}
  transition={{
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1],
  }}
  viewport={{
    amount: 0.25,
  }}
>



    {/* BADGES */}
    {/* <div className="flex items-center gap-3 flex-wrap mb-5">
      {blog.featured && (
      <span
    className="
      inline-flex
      items-center
      gap-2
    
      py-2.5
      rounded-full
     
      text-[#6b3df4]
      text-[20px]
      font-semibold
      tracking-[0.3px]
    "
  >
    <svg
      className="w-4 h-4 text-[#6b3df4]"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>

    Featured
  </span>
      )}

     <span
  className={`
    inline-flex
    items-center
    gap-2
    px-5 py-2.5
    rounded-full
    text-[20px]
    font-semibold
    ${
      blog.published
        ? "text-green-700"
        : "text-yellow-700"
    }
  `}
>
  {blog.published ? (
    <svg
      className="w-5 h-5 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ) : (
    <svg
      className="w-5 h-5 text-yellow-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )}

  {blog.published ? "Published" : "Draft"}
</span>
    </div> */}

<div className="flex items-center gap-3 flex-wrap mb-5 overflow-hidden">

  {/* FEATURED */}
  {blog.featured && (
    <span
      className="
        inline-flex
        items-center
        gap-2

        py-2
        sm:py-2.5

        text-[10px]
        min-[380px]:text-sm
        sm:text-[20px]

        font-semibold
        tracking-[0.3px]

        text-[#6b3df4]

        break-all
        min-[380px]:break-normal
      "
    >
      <svg
        className="w-4 h-4 text-[#6b3df4] flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>

      Featured
    </span>
  )}

  {/* STATUS */}
  <span
    className={`
      inline-flex
      items-center
      gap-2

     
      py-2 sm:py-2.5

      text-[10px]
      min-[380px]:text-sm
      sm:text-[20px]

      font-semibold

      ${
        blog.published ? "text-green-700" : "text-yellow-700"
      }

      break-all
      min-[380px]:break-normal
    `}
  >
    {blog.published ? (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )}

    {blog.published ? "Published" : "Draft"}
  </span>

</div>



    {/* TEXT */}
    {/* <p
      className="
          text-[18px]
  leading-[1.9]
  text-[#4b5563]
  font-[450]
  max-w-[500px]
  text-left
      "
    >
      {blog.excerpt ||
        blog.content.substring(0, 200) + "..."}
    </p> */}

<p
  className="
    text-[14px]
    min-[380px]:text-[16px]
    sm:text-[18px]

    leading-[1.7]
    sm:leading-[1.9]

    text-[#4b5563]
    font-[450]

    w-full
    max-w-full

    break-words
  "
>
  {blog.excerpt ||
    blog.content.substring(0, 200) + "..."}
</p>


    {/* BUTTONS */}
    {/* <div className="flex items-center gap-4 flex-wrap mt-8">
      <button
        className="
          h-[48px]
          px-7
          rounded-2xl
          bg-[#f5f7fb]
          text-[#374151]
          text-sm
          font-semibold
        "
      >
        Edit
      </button>

      <button
        className={`
          h-[48px]
          px-7
          rounded-2xl
          text-sm
          font-semibold
          ${
            blog.published
              ? "bg-orange-50 text-orange-700"
              : "bg-green-50 text-green-700"
          }
        `}
      >
        {blog.published ? "Unpublish" : "Publish"}
      </button>

      <button
        className="
          h-[48px]
          px-7
          rounded-2xl
          bg-red-50
          text-red-700
          text-sm
          font-semibold
        "
      >
        Delete
      </button>
    </div> */}


 <div className="flex items-center gap-4 flex-wrap mt-8">
                    {/* <button
                      onClick={() => handleStartEdit(blog)}
                      className="px-4 py-2 text-sm font-medium text-gray-700
                      bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button> */}

<button
  onClick={() => handleStartEdit(blog)}
  className="
    flex items-center justify-center gap-2

    px-3 sm:px-4
    py-2

    text-xs sm:text-sm
    font-medium

    text-gray-700

    bg-white/20
    backdrop-blur-xl
    border border-white/20
    shadow-lg

    rounded-lg

    hover:bg-gray-200
    transition-colors

    shrink-0
  "
>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>

  <span className="break-all min-[360px]:break-normal">
    Edit
  </span>
</button>

                    {/* <button
                      onClick={() => togglePublish(blog.id, blog.published)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${blog.published
                      ? 'text-orange-700 bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-orange-200'
: 'text-green-700 bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-green-200'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{blog.published ? 'Unpublish' : 'Publish'}</span>
                    </button> */}

<button
  onClick={() => togglePublish(blog.id, blog.published)}
  className={`
    flex items-center justify-center gap-2

    px-3 sm:px-4
    py-2

    text-xs sm:text-sm
    font-medium

    rounded-lg
    transition-colors

    bg-white/20
    backdrop-blur-xl
    border border-white/20
    shadow-lg

    shrink-0

    ${
      blog.published
        ? "text-orange-700 hover:bg-orange-200"
        : "text-green-700 hover:bg-green-200"
    }
  `}
>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>

  <span className="break-all min-[360px]:break-normal">
    {blog.published ? "Unpublish" : "Publish"}
  </span>
</button>



                    {/* <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="px-4 py-2 text-sm font-medium text-red-700
                      bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg rounded-lg
                        hover:bg-red-200 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button> */}

<button
  onClick={() => handleDeleteBlog(blog.id)}
  className="
    flex items-center justify-center gap-2

    px-3 sm:px-4
    py-2

    text-xs sm:text-sm
    font-medium

    text-red-700

    bg-white/20
    backdrop-blur-xl
    border border-white/20
    shadow-lg

    rounded-lg

    hover:bg-red-200
    transition-colors

    shrink-0
  "
>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>

  <span className="break-all min-[360px]:break-normal">
    Delete
  </span>
</button>

                  </div>





 </motion.div>
    {/* this one */}
</div>


              </div>
            ))}
        </div>
      </div>



      {(!Array.isArray(blogs) || blogs.length === 0) && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 className="text-heading-4 text-gray-900 mb-2">
            No blogs yet
          </h3>

          <p className="text-body text-gray-600 mb-6">
            Get started by creating your first blog post.
          </p>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Blog
          </button>
        </div>
      )}
    </div>
  )
}


