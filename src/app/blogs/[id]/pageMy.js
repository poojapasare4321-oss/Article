'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { extractIdFromSlug } from '@/lib/slug'
import Navbar from '@/components/Navbar'
import CommentBox from "@/components/CommentBox";
import Logo from "@/components/Logo";
import { Calendar, Clock, Eye } from "lucide-react"

export default function BlogDetail() {
  const params = useParams()
  const id = params.id; 
  const router = useRouter()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openComments, setOpenComments] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);


  useEffect(() => {
    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  const fetchBlog = async () => {
    try {
      // Extract the actual ID from the slug/param
      const blogId = extractIdFromSlug(params.id)
      const response = await fetch(`/api/blogs/${blogId}`)
      const data = await response.json()

      if (response.ok) {
        setBlog(data)
      } else {
        setError(data.error || 'Blog not found')
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError('Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      short: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    }
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const isLongTitle = blog.title.length > 80
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-body text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-heading-2 text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-body text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
          <Link 
            href="/"
            className="text-btn bg-[#5678FF] text-white px-6 py-3 rounded-lg hover:bg-[#4567EE] transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const dateInfo = formatDate(blog.createdAt)
  const readTime = calculateReadTime(blog.content)

 
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-pink-100 to-gray-300">
    <Navbar variant="blog" />

  

  {/* Featured Image */}

<div className="mt-6 px-6 md:px-10 w-full">
 

  <div className="flex items-center gap-4">

    {/* Left Line */}
    <div className="flex-1 h-[4px] bg-white"></div>

    {/* Center Label */}
    <span className="text-xs tracking-widest uppercase text-gray-600 bg-white px-3 py-1 border border-gray-300 shadow-sm">
      Featured Post
    </span>

    {/* Right Line */}
    <div className="flex-1 h-[4px] bg-white"></div>

  </div>
</div>


  {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4">
      

{/* hero */}


{blog.featuredImage && (
  <div className="relative rounded-3xl overflow-hidden mb-8 border border-gray-200 shadow-xl min-h-[70vh] md:min-h-[660px]">

    {/* 🔥 BACKGROUND */}
    <div className="absolute inset-0">
      <Image
        src={blog.featuredImage}
        alt="bg"
        fill
        priority
        sizes="100vw"
        className="object-cover blur-[2px]"
      />
    </div>

    {/* ✅ OVERLAY */}
    <div className="absolute inset-0 bg-black/10" />

    {/* 🔥 CONTENT */}

    <div className="
   relative z-10 
grid grid-cols-1 md:grid-cols-2 items-center 

py-12 px-6 md:py-16 md:px-10 
pb-24 md:pb-28  

gap-6 md:gap-8
     ">
{/* py-12 px-6 md:py-16 md:px-10 gap-6 */}

      {/* LEFT */}
      <div className="space-y-4 text-black mt-6 md:mt-10">

        <Logo size={28} />

        {/* TITLE */}
        <div className="
       
 px-3 py-2
    rounded-lg
    bg-white/60 backdrop-blur-sm
    shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]
    border border-white/40
    max-w-full sm:max-w-[90%]
    w-fit

          ">

          {/* <h1 className="text-xl md:text-3xl font-medium leading-snug text-gray-900">
            {blog.title}
          </h1> */}
           <h1 className="text-xl md:text-3xl font-medium leading-snug text-gray-900 break-words">
    {blog.title}
  </h1>
        </div>

        {/* 🔥 META SECTION */}
     
   {/* 🔥 META SECTION */}
        {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"> */}
          {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"> */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 overflow-visible">

          {/* AUTHOR changing */}
          {/* <div className="group relative pb-10">
            <div 
            
        className="
w-12 h-12 sm:w-14 sm:h-14
flex items-center justify-center
rounded-[12px]
bg-white/70 backdrop-blur-lg
border border-white/40
shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
transition-all duration-300

group-hover:translate-y-[-4px]

hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
hover:text-white

cursor-pointer
"> */}
 <div className="group relative min-h-[80px] tabIndex={0}">
    <div className="
      w-12 h-12 sm:w-14 sm:h-14
      flex items-center justify-center
      rounded-[12px]
      bg-white/70 backdrop-blur-lg
      border border-white/40
      shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
      transition-all duration-300
      group-hover:-translate-y-1
      hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
      hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
      hover:text-white
      cursor-pointer
    ">


              {/* <div className="flex flex-col items-center leading-tight">
                <span className="text-gray-700 group-hover:text-white font-semibold text-sm">
                  {(blog.author?.name || 'Admin').charAt(0).toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
                  Author
                </span>
              </div>
            </div> */}

 <div className="flex flex-col items-center leading-tight">
        <span className="text-gray-700 group-hover:text-white font-semibold text-sm">
          {(blog.author?.name || 'Admin').charAt(0).toUpperCase()}
        </span>
        <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
          Author
        </span>
      </div>
    </div>

            
{/* 
            <div className="
            
  mt-2 flex justify-center
  opacity-0 max-h-0 overflow-hidden
  group-hover:opacity-100 group-hover:max-h-20
  group-focus:opacity-100 group-focus:max-h-20
  transition-all duration-300
">
            

              <div className="px-3 py-1.5 text-xs font-medium text-gray-700 rounded-[12px]
                bg-[#e0e0e0]
                shadow-[4px_4px_10px_#b8b9be,-4px_-4px_10px_#ffffff] whitespace-nowrap">
                {blog.author?.name || 'Admin'}
              </div>
            </div>
          </div> */}

    <div className="
      mt-2 flex justify-center
      opacity-0 max-h-0 overflow-hidden
      group-hover:opacity-100 group-hover:max-h-12
      group-focus:opacity-100 group-focus:max-h-12
      transition-all duration-300
    ">
      <div className="
        px-3 py-1.5 text-xs font-medium text-gray-800 rounded-xl
        bg-white/60 backdrop-blur-md
        border border-white/30
        shadow-lg
        whitespace-nowrap
      ">
        {blog.author?.name || 'Admin'}
      </div>
    </div>
  </div>




          {/* DATE */}
          {/* <div className="group relative">
                  <div 
            
      className="
w-14 h-14 flex items-center justify-center
rounded-[12px]
bg-white/70 backdrop-blur-lg
border border-white/40
shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
transition-all duration-300

hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
hover:text-white

cursor-pointer
"  >

              <div className="flex flex-col items-center leading-tight">
                <Calendar className="w-4 h-4 text-gray-700 group-hover:text-white" />
                <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
                  Published
                </span>
              </div>
            </div> */}


  {/* DATE */}
  <div className="group relative min-h-[80px] tabIndex={0}">
    <div className="
      w-14 h-14 flex items-center justify-center
      rounded-[12px]
      bg-white/70 backdrop-blur-lg
      border border-white/40
      shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
      transition-all duration-300
      group-hover:-translate-y-1
      hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
      hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
      hover:text-white
      cursor-pointer
    ">
      <div className="flex flex-col items-center leading-tight">
        <Calendar className="w-4 h-4 text-gray-700 group-hover:text-white" />
        <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
     Published
        </span>
      </div>
    </div>


{/* 
<div className="
  mt-2 flex justify-center
  opacity-0 max-h-0 overflow-hidden
  group-hover:opacity-100 group-hover:max-h-20
  group-focus:opacity-100 group-focus:max-h-20
  transition-all duration-300
">


              <div className="px-3 py-1.5 text-xs font-medium text-gray-700 rounded-[12px]
                bg-[#e0e0e0]
                shadow-[4px_4px_10px_#b8b9be,-4px_-4px_10px_#ffffff] whitespace-nowrap">
                {dateInfo.full}
              </div>
            </div>
          </div> */}



    <div className="
      mt-2 flex justify-center
      opacity-0 max-h-0 overflow-hidden
      group-hover:opacity-100 group-hover:max-h-12
      group-focus:opacity-100 group-focus:max-h-12
      transition-all duration-300
    ">
      <div className="
        px-3 py-1.5 text-xs font-medium text-gray-800 rounded-xl
        bg-white/60 backdrop-blur-md
        border border-white/30
        shadow-lg
        whitespace-nowrap
      ">
        {dateInfo.full}
      </div>
    </div>
  </div>




          {/* READ TIME */}
          {/* <div className="group relative">
                   <div 
            
      className="
w-14 h-14 flex items-center justify-center
rounded-[12px]
bg-white/70 backdrop-blur-lg
border border-white/40
shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
transition-all duration-300

hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
hover:text-white

cursor-pointer
"> */}

 <div className="group relative min-h-[80px] tabIndex={0}">
    <div className="
      w-14 h-14 flex items-center justify-center
      rounded-[12px]
      bg-white/70 backdrop-blur-lg
      border border-white/40
      shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
      transition-all duration-300
      group-hover:-translate-y-1
      hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
      hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
      hover:text-white
      cursor-pointer
    ">



{/* 
              <div className="flex flex-col items-center leading-tight">
                <Clock className="w-4 h-4 text-gray-700 group-hover:text-white" />
                <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
                  Duration
                </span>
              </div>
            </div> */}


  <div className="flex flex-col items-center leading-tight">
        <Clock className="w-4 h-4 text-gray-700 group-hover:text-white" />
        <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
          Duration
        </span>
      </div>
    </div>



            {/* <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4
              opacity-0 translate-y-2 scale-95
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
              transition-all duration-300"> */}

              {/* <div className="
  mt-2 flex justify-center
  opacity-0 max-h-0 overflow-hidden
  group-hover:opacity-100 group-hover:max-h-20
  group-focus:opacity-100 group-focus:max-h-20
  transition-all duration-300
">

              <div className="px-3 py-1.5 text-xs font-medium text-gray-700 rounded-[12px]
                bg-[#e0e0e0]
                shadow-[4px_4px_10px_#b8b9be,-4px_-4px_10px_#ffffff] whitespace-nowrap">
                {readTime} min read
              </div>
            </div>
          </div> */}

    <div className="
      mt-2 flex justify-center
      opacity-0 max-h-0 overflow-hidden
      group-hover:opacity-100 group-hover:max-h-12
      group-focus:opacity-100 group-focus:max-h-12
      transition-all duration-300
    ">
      <div className="
        px-3 py-1.5 text-xs font-medium text-gray-800 rounded-xl
        bg-white/60 backdrop-blur-md
        border border-white/30
        shadow-lg
        whitespace-nowrap
      ">
        {readTime} min read
      </div>
    </div>
  </div>




          {/* VIEWS */}
          {/* <div className="group relative">
                  <div 
            
      className="
w-14 h-14 flex items-center justify-center
rounded-[12px]
bg-white/70 backdrop-blur-lg
border border-white/40
shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
transition-all duration-300

hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
hover:text-white

cursor-pointer
">
              
              <div className="flex flex-col items-center leading-tight">
                <Eye className="w-4 h-4 text-gray-700 group-hover:text-white" />
                <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
                  Views
                </span>
              </div>
            </div> */}



  {/* VIEWS */}
  <div className="group relative min-h-[80px] tabIndex={0}">
    <div className="
      w-14 h-14 flex items-center justify-center
      rounded-[12px]
      bg-white/70 backdrop-blur-lg
      border border-white/40
      shadow-[1px_1px_5px_#c9cacf,-1px_-1px_5px_#f4f5f7]
      transition-all duration-300
      group-hover:-translate-y-1
      hover:shadow-[inset_1px_1px_4px_#c9cacf,inset_-1px_-1px_4px_#f4f5f7]
      hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-300
      hover:text-white
      cursor-pointer
    ">
      <div className="flex flex-col items-center leading-tight">
        <Eye className="w-4 h-4 text-gray-700 group-hover:text-white" />
        <span className="text-[10px] text-gray-500 group-hover:text-white/80 mt-1">
          Views
        </span>
      </div>
    </div>



    <div className="
      mt-2 flex justify-center
      opacity-0 max-h-0 overflow-hidden
      group-hover:opacity-100 group-hover:max-h-12
      group-focus:opacity-100 group-focus:max-h-12
      transition-all duration-300
    ">
      <div className="
        px-3 py-1.5 text-xs font-medium text-gray-800 rounded-xl
        bg-white/60 backdrop-blur-md
        border border-white/30
        shadow-lg
        whitespace-nowrap
      ">
        {blog.views || 0} views
      </div>
        </div>
      </div>


      </div>
  </div>


{/* 
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4
              opacity-0 translate-y-2 scale-95
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
              transition-all duration-300">

              <div className="px-3 py-1.5 text-xs font-medium text-gray-700 rounded-[12px]
                bg-[#e0e0e0]
                shadow-[4px_4px_10px_#b8b9be,-4px_-4px_10px_#ffffff] whitespace-nowrap">
                {blog.views || 0} views
              </div>
            </div>
          </div>

        </div>
      </div> */}



     

      {/* RIGHT IMAGE */}
      <div className="relative w-full flex items-center justify-center
       h-[220px] sm:h-[260px] md:h-[380px] ">
        <div className="relative w-full h-full rounded-2xl overflow-hidden 
          shadow-[0_25px_60px_rgba(0,0,0,0.35)] 
          transform perspective-1000 transition-all duration-500 
          hover:rotate-y-6 hover:-rotate-x-2 hover:scale-105
          bg-white/10">

         <div className="px-4 sm:px-6 md:px-10 py-8 md:py-10">
  <Image
    src={blog.featuredImage}
    alt={blog.title}
    fill
    className="object-cover"
  />
</div>
        </div>
      </div>

    </div>
  </div>
)}
        {/* Blog Content real */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="prose prose-lg max-w-none">
            <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap space-y-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {blog.content}
            </div>
          </div>
        </div> */}

{/* <div className="relative z-30 -mt-35"> */}
<div className="relative z-30 -mt-20 sm:-mt-24 md:-mt-24 mb-16">
  
  <div className="max-w-4xl mx-auto bg-white px-4 sm:px-6 md:px-10 py-8 md:py-10 border border-gray-200">
    
    <div className="prose prose-lg max-w-none">
      <div 
        className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap space-y-5"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {blog.content}
      </div>
    </div>

  </div>

</div>


{/* Blog Content  */}

   
      {/* 1 Comment Section */}


{/* 💬 Floating Comment Button */}
<div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
  <button
    onClick={() => setOpenComments(true)}
    className="flex items-center gap-2 px-5 py-3 rounded-full 
    bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
    shadow-xl hover:scale-105 transition-all duration-300"
  >
    💬 <span className="font-medium">Comments</span>
  </button>
</div>

{openComments && (
  <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
    
    {/* Slide Panel */}
    <div className="w-full sm:w-[380px] md:w-[420px]
     h-full 
    bg-white shadow-2xl p-6 flex flex-col 
    animate-slideIn">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          💬 Comments
        </h2>
        <button
          onClick={() => setOpenComments(false)}
          className="text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* Your ORIGINAL CommentBox */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner p-4 border border-gray-200">
          <CommentBox postId={id} />
        </div>
      </div>

    </div>
  </div>
)}


        {/* Additional Information */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Post Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Publication Status */}
            <div className="text-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {blog.published ? 'Published' : 'Draft'}
              </p>
              <p className="text-xs text-gray-600 font-medium">Publication Status</p>
            </div>

            {/* Last Updated */}
            <div className="text-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {formatDate(blog.updatedAt || blog.createdAt).short}
              </p>
              <p className="text-xs text-gray-600 font-medium">Last Updated</p>
            </div>

            {/* Word Count */}
            <div className="text-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {blog.content.split(' ').length}
              </p>
              <p className="text-xs text-gray-600 font-medium">Word Count</p>
            </div>

            {/* Category */}
            <div className="text-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {blog.category || 'General'}
              </p>
              <p className="text-xs text-gray-600 font-medium">Category</p>
            </div>
          </div>
        </div>
      </main>


{/* 🔙 Back Button Section (Below Navbar) */}



 <div className="max-w-6xl mx-auto px-4 md:px-6 mt-4">
  <div className="flex items-center">

    <Link
      href="/"
      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl 
      font-semibold text-white 
      bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
      shadow-md hover:shadow-xl
      transition-all duration-300 hover:scale-105"
    >

      {/* Icon */}

 
      <span className="flex items-center justify-center w-8 h-8 rounded-full 
        bg-white/20 group-hover:bg-white/30 transition">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </span>

      Back to Home
    </Link>

  </div>
</div> 


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-body text-gray-400 mb-4">Healthcare Insights & Innovation Stories</p>
          <p className="text-caption text-gray-500">© 2024 AAROGYA INSIGHTS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}







