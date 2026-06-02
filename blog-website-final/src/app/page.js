"use client";
import {
  User,
  Calendar,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useMemo } from "react";
import { motion } from "framer-motion";



// Utility function to create URL-friendly slugs
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
}


export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
const [animateKey, setAnimateKey] = useState(0);
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCard, setActiveCard] = useState(null);
 
const [showCard, setShowCard] = useState(false);

 const [activeIndex, setActiveIndex] = useState(0);
const [isFalling, setIsFalling] = useState(false);

const [showInfo, setShowInfo] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setShowInfo(false)
  }

  window.addEventListener("scroll", handleScroll)

  return () => window.removeEventListener("scroll", handleScroll)
}, [])


const visibleCards =
  blogs.length > 0
    ? [
        blogs[activeIndex],
        blogs[(activeIndex + 1) % blogs.length],
        blogs[(activeIndex + 2) % blogs.length],
      ]
    : [];

const currentBlog = visibleCards[0] || {};




  // Enhanced function to calculate blog ranking score
  const calculateBlogScore = (blog) => {
    let score = 0;

    // Base score for featured blogs (highest priority)
    if (blog.featured) score += 200;

    // Score based on views (engagement indicator)
    score += (blog.views || 0) * 0.2;

    // Score based on content length (longer content = more valuable)
    score += Math.min(blog.content.length / 50, 100);

    // Score based on recency (newer posts get higher score)
    const daysSinceCreated =
      (new Date() - new Date(blog.createdAt)) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 50 - daysSinceCreated);

    // Score based on category relevance
    if (blog.category) score += 30;

    // Score based on tags (more tags = more comprehensive)
    if (blog.tags && blog.tags.length > 0) score += blog.tags.length * 8;

    // Score based on author reputation (if author has more blogs)
    if (blog.author && blog.author.blogCount) {
      score += Math.min(blog.author.blogCount * 2, 40);
    }

    // Bonus for complete metadata
    if (blog.excerpt) score += 15;
    if (blog.featuredImage) score += 20;

    // Small random factor for variety (reduced)
    score += Math.random() * 5;

    return Math.round(score);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchResults && !event.target.closest("form")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);


//   const blogsArray = Array.isArray(data) ? data : data.blogs || [];

// setBlogs(blogsArray);


  // const fetchBlogs = async () => {
  //   try {
  //     const response = await fetch("/api/blogs");
  //     const data = await response.json();
  //     console.log("Fetched blogs:", data);
  //     console.log("Number of blogs:", data.length);

  //     setBlogs(data);
  //     const featured = data.filter((blog) => blog.featured).slice(0, 1);
  //     console.log("Featured blogs:", featured);
  //     console.log("Number of featured blogs:", featured.length);
  //     setFeaturedBlogs(featured);
  //   } catch (error) {
  //     console.error("Error fetching blogs:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBlogs = async () => {
  try {
    const response = await fetch("/api/blogs");
    const data = await response.json();

    console.log("Fetched blogs:", data);

    // normalize
    const blogsArray = Array.isArray(data) ? data : data.blogs || [];

    console.log("Number of blogs:", blogsArray.length);

    // ✅ store ALL blogs
    setBlogs(blogsArray);

    // ✅ get ONLY ONE featured for hero
    const featured = blogsArray.find((blog) => blog.featured);

    // if no featured exists, fallback to first blog
    setFeaturedBlogs(featured ? [featured] : blogsArray.slice(0, 1));

  } catch (error) {
    console.error("Error fetching blogs:", error);
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  if (blogs.length === 0) return;

  const interval = setInterval(() => {
    setIsFalling(true);

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % blogs.length);
      setIsFalling(false);
    }, 500); // match CSS animation
  }, 3000);

  return () => clearInterval(interval);
}, [blogs.length]);



  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = blogs.filter((blog) => {
      const title = (blog.title || "").toLowerCase();
      const content = (blog.content || "").toLowerCase();
      const category = (blog.category || "").toLowerCase();
      const excerpt = (blog.excerpt || "").toLowerCase();

      return (
        title.includes(searchTerm) ||
        content.includes(searchTerm) ||
        category.includes(searchTerm) ||
        excerpt.includes(searchTerm)
      );
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    handleSearch(query);
  };

  // Auto change between first 3 blogs cards
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
  //   }, 3000); //
  //   return () => clearInterval(interval);
  // }, []);
useEffect(() => {
  if (blogs.length === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % blogs.length);
    setAnimateKey((prev) => prev + 1); // re-trigger animation
  }, 4000);

  return () => clearInterval(interval);
}, [blogs]);


  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    setSubLoading(true);
    setSuccess(false);

    // Basic email validation
    if (!email || !email.includes("@")) {
      alert("⚠️ Please enter a valid email address.");
      setSubLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmail("");
      setSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter(
          (blog) =>
            blog.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 7 }).map((_, i) => ({
      width: Math.random() * 240 + 120 + "px",
      height: Math.random() * 240 + 120 + "px",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      background: `hsl(${165 + i * 20}, 70%, 70%)`,
      animationDuration: Math.random() * 8 + 10 + "s",
      animationDelay: `${i * 0.6}s`,
    }));

    setBubbles(generated);
  }, []);

  const stats = [
    {
      image: "/books.png",
      count: blogs.length,
      label: "ARTICLES",
    },
    {
      image: "/doctor.png",
      count: "500+",
      label: "EXPERTS",
    },
    {
      image: "/people.png",
      count: "250K+",
      label: "MONTHLY READERS",
    },
    {
      image: "/star.png",
      count: "4.9",
      label: "RATING",
    },
  ];

  const categories = [
    {
      name: "COVID-19",
      image: "/covid.png",
      count: "2.5K",
    },
    {
      name: "Mental Health",
      image: "/brain.png",
      count: "1.8K",
    },
    {
      name: "Nutrition",
      image: "/salad.png",
      count: "1.2K",
    },
    {
      name: "Exercise",
      image: "/muscle.png",
      count: "980",
    },
    {
      name: "Prevention",
      image: "/encrypted.png",
      count: "750",
    },
    {
      name: "Technology",
      image: "/phone.png",
      count: "650",
    },
  ];

  return (
    <div className="bg-background min-h-screen ">
      {/* Navbar */}
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-blue-100/70 py-14 md:py-20">
        {/* Soft Gradient Orbs */}
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute top-10 left-1/4 w-[28rem] h-[28rem] rounded-full blur-[120px]"
            style={{
              background:
                "linear-gradient(145deg, var(--primary) 0%, var(--secondary) 100%)",
            }}
          />
          <div
            className="absolute bottom-10 right-1/3 w-[22rem] h-[22rem] rounded-full blur-[120px]"
            style={{
              background:
                "linear-gradient(145deg, var(--secondary) 0%, var(--accent) 100%)",
            }}
          />
        </div>

        {/* Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-float"
              style={bubble}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          {/* Badge */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/70 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-semibold text-gray-700 tracking-wide">
                Trusted by healthcare professionals worldwide
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              <span className="block text-gray-900">Discover Healthcare</span>
              <span
                className="block 
              bg-gradient-to-r 
              from-emerald-600 
              via-blue-600 
              to-cyan-600 
              bg-clip-text 
              text-transparent 
              animate-gradient-smooth"
              >
                Insights & Stories
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
              Expert analysis, latest medical research, and practical healthcare
              guidance—all in one place.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="relative flex items-center bg-[#E8EEFB] rounded-full shadow-lg p-2 transition-all duration-300">
                  {/* Search Icon */}
                  <div className="ml-1 flex-shrink-0">
                    <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search articles, topics, or experts..."
                    className="w-full pl-4 pr-32 bg-transparent text-gray-900 placeholder-gray-800 focus:outline-none text-lg font-medium h-12"
                  />

                  {/* Button */}
                  <button
                    type="submit"
                    className="absolute right-2 px-8 py-2 bg-white text-[#1E3A8A] font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Search
                  </button>
                </div>

                {/* SEARCH DROPDOWN */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-gray-200 shadow-2xl max-h-96 overflow-y-auto z-50 pb-4 custom-scroll">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                        <span className="text-sm font-semibold text-emerald-700">
                          Found {searchResults.length} results
                        </span>
                        <button
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchQuery("");
                          }}
                          className="text-gray-500 hover:text-emerald-700"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-3">
                        {searchResults.map((blog) => (
                          <Link
                            key={blog.id}
                            href={`/blogs/${createSlug(blog.title)}-${blog.id}`}
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchQuery("");
                            }}
                            className="block p-3 rounded-xl transition-all hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
                          >
                            <div className="flex gap-3">
                              {blog.featuredImage && (
                                <Image
                                  src={blog.featuredImage}
                                  alt={blog.title}
                                  width={64}
                                  height={64}
                                  className="rounded-lg w-16 h-16 object-cover shadow-sm"
                                />
                              )}
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                  {blog.title}
                                </h4>
                                {blog.category && (
                                  <p className="text-xs text-emerald-700 mt-1">
                                    {blog.category}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* NO RESULTS */}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchQuery.trim() !== "" && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-gray-200 shadow-2xl p-10 text-center z-50">
                      <h3 className="font-semibold text-gray-900 text-xl mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Try different keywords or browse featured insights.
                      </p>
                      <button
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="px-5 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
              </form>
            </div>
          </div>

          {/* Stats Section - Glassmorphism Design */}
          <div className="relative w-full max-w-5xl mx-auto mt-16 md:mt-24 px-4 md:px-6">
            {/* Background Gradient with Soft Blur */}
            <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-purple-100/50 to-blue-200/40 rounded-3xl blur-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-transparent to-purple-50/30 rounded-3xl"></div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="relative group min-h-[220px] md:min-h-[260px] h-full"
                >
                  {/* Glass Card */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Content Container - Centered Vertical Stack */}
                    <div className="relative h-full py-8 md:py-10 px-4 md:px-6 flex flex-col items-center justify-center gap-1">
                      {/* Icon Section - Top */}
                      <div className="flex justify-center items-center mb-3 md:mb-4">
                        <div className="relative w-16 h-16 md:w-20 md:h-20 group-hover:scale-110 transition-transform duration-500">
                          <Image
                            src={item.image}
                            alt={item.label}
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                          />
                        </div>
                      </div>

                      {/* Number - Below Icon */}
                      <div className="flex justify-center items-center mb-1 md:mb-2">
                        <p
                          className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none text-center"
                          style={{
                            fontWeight: 900,
                            textShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            letterSpacing: "-0.02em",
                            lineHeight: "1.1",
                          }}
                        >
                          {item.count}
                        </p>
                      </div>

                      {/* Label - Below Number */}
                      <div className="flex justify-center items-center">
                        <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-[0.12em] md:tracking-[0.15em] leading-tight whitespace-nowrap text-center">
                          {item.label}
                        </p>
                      </div>
                    </div>

                    {/* Soft shadow beneath card */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[85%] h-3 bg-black/5 blur-xl rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>





      {/* Featured Story Section */}
      {loading ? (
        /* -------------------- LOADING SKELETON -------------------- */
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gray-200 h-12 w-48 rounded-full"></div>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
                        <div className="bg-gray-200 h-4 w-16 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-200 h-8 w-full rounded"></div>
                        <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gray-200 h-4 w-full rounded"></div>
                        <div className="bg-gray-200 h-4 w-full rounded"></div>
                        <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="bg-gray-200 h-4 w-20 rounded"></div>
                          <div className="bg-gray-200 h-3 w-16 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="bg-gray-200 h-12 w-40 rounded-xl"></div>
                    </div>
                  </div>

                  <div className="lg:w-1/2">
                    <div className="h-80 lg:h-full bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> 
      ) : featuredBlogs.length > 0 ? (
        /* -------------------- FEATURED STORY (NEW DESIGN) -------------------- */


  
<section className="bg-background py-10 md:py-16 -mt-8 md:-mt-14">

  {/* BLUE SECTION */}
  <div className="max-w-7xl mx-auto px-4">

    <div
      key={animateKey}
      className="relative bg-cover bg-center min-h-[520px] md:min-h-[500px] pt-16 md:pt-28 pb-14 md:pb-28 px-4 md:px-8 -mt-2 text-center overflow-hidden"
      style={{
        backgroundImage: "url('/hero-bg.jpeg')",
      }}
    >

      {/* ================= MOBILE HERO ================= */}
      <div className="block md:hidden">

        {/* LABEL */}
        <p className="text-sm text-gray-600 mb-3 tracking-wide">
          Featured Story
        </p>

        {/* TITLE */}
        <h1
          className="
            text-3xl
            font-bold
            leading-snug
            tracking-tight
            text-center
            text-gray-900
            line-clamp-3
            max-w-[95%]
            mx-auto
          "
        >
          {currentBlog.title}
        </h1>

        {/* PILLS */}
        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">

          <span className="px-3 py-1 text-xs bg-white/90 backdrop-blur border border-black rounded-full shadow whitespace-nowrap">
            {currentBlog.category || "Wellness"}
          </span>

          <span className="px-3 py-1 text-xs bg-white/90 backdrop-blur border border-black rounded-full shadow whitespace-nowrap">
            {currentBlog.createdAt
              ? new Date(currentBlog.createdAt).toLocaleDateString()
              : "Latest"}
          </span>

        </div>

        {/* CONTENT */}
        <p
          className="
            mt-5
            text-sm
            leading-relaxed
            text-gray-700
            text-center
            line-clamp-3
            max-w-md
            mx-auto
          "
        >
          {currentBlog.excerpt || currentBlog.content}
        </p>

        {/* IMAGE */}
        <div className="mt-8">

          <img
            src={currentBlog.featuredImage || "/default-blog.jpg"}
            alt={currentBlog.title}
            className="
              w-full
              h-[260px]
              object-cover
              rounded-[28px]
              border border-black
              shadow-lg
            "
          />

        </div>

      </div>

      {/* ================= DESKTOP HERO ================= */}
      <div className="hidden md:block">

        {/* LABEL */}
        <p className="text-sm md:text-base text-gray-600 mb-3 tracking-wide">
          Featured Story
        </p>

        {/* HEADING */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-center max-w-3xl mx-auto">
          {currentBlog.title.split(" ").map((word, i) => (
            <span
              key={i}
              className="inline-block animate-word text-gray-900"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {word}&nbsp;
            </span>
          ))}
        </h1>

        {/* PILLS */}
        <div className="relative mt-10 mb-16 md:mb-20 z-20">

          {/* LEFT PILL */}
          <span className="absolute left-10 sm:left-14 md:left-28 -top-8 px-3 md:px-4 py-1 text-xs md:text-sm bg-white/90 backdrop-blur border border-black rounded-full shadow whitespace-nowrap">
            {currentBlog.category || "Wellness"}
          </span>

          {/* RIGHT PILL */}
          <span className="absolute right-10 sm:right-14 md:right-28 -top-8 px-3 md:px-4 py-1 text-xs md:text-sm bg-white/90 backdrop-blur border border-black rounded-full shadow whitespace-nowrap">
            {currentBlog.createdAt
              ? new Date(currentBlog.createdAt).toLocaleDateString()
              : "Latest"}
          </span>

        </div>

      </div>

    </div>

  </div>

  
  {/* ================= MOBILE READ MORE ================= */}
<div className="block md:hidden px-4 pt-6 pb-10">

  <Link
    href={`/blogs/${createSlug(currentBlog.title)}-${currentBlog.id}`}
    className="block"
  >

    <div className="flex items-center justify-center gap-3">

      {/* LEFT LINE */}
      <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"></div>

      {/* BUTTON */}
      <button
        className="
          btn-iron group relative flex items-center justify-center
          h-[46px] px-5
          text-sm
          uppercase
          rounded-full
          overflow-hidden

          bg-gradient-to-r
          from-blue-500
          via-purple-500
          to-pink-400

          shadow-[0_7px_0_0_rgba(168,85,247,0.9)]

          active:translate-y-[7px]
          active:shadow-none
          transition-all duration-75
        "
      >

        {/* DEFAULT TEXT */}
        <span className="btn-text absolute inset-0 flex items-center justify-center text-white font-semibold tracking-[2px] text-sm">
          READ MORE
        </span>

        {/* LETTERS */}
        <span className="flex gap-[2px]">
          <i className="letter">R</i>
          <i className="letter">E</i>
          <i className="letter">A</i>
          <i className="letter">D</i>
          <i className="letter">&nbsp;</i>
          <i className="letter">M</i>
          <i className="letter">O</i>
          <i className="letter">R</i>
          <i className="letter">E</i>
        </span>

      </button>

      {/* RIGHT LINE */}
      <div className="flex-grow h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600"></div>

    </div>

  </Link>

</div>

  {/* ================= DESKTOP CARD SECTION ================= */}
  <div className="hidden md:block max-w-5xl mx-auto px-4 -mt-12 md:-mt-28 relative pb-12 md:pb-16">

    <div className="relative">

      {visibleCards[0] && (
        <div className="relative">

          {/* NEXT CARD */}
          {visibleCards[1] && (
            <div className="absolute top-0 left-0 right-0 z-10 overflow-hidden pointer-events-none">

              <div
                className="
                  bg-white border border-black shadow-lg overflow-hidden
                  rounded-2xl md:rounded-t-3xl

                  h-auto
                  sm:min-h-[320px]
                  md:h-[360px]

                  scale-[0.94]
                  sm:scale-100

                  origin-top
                  transition-all duration-500 ease-out
                "
              >

                <div className="grid grid-cols-1 md:grid-cols-2 h-full">

                  {/* LEFT */}
                  <div
                    className="
                      p-3 sm:p-4 md:p-6
                      pb-16 sm:pb-16 md:pb-14
                      relative flex flex-col h-full

                      hidden sm:flex
                    "
                  >

                    {/* TEXT */}
                    <div className="flex-1 flex items-center">
                      <p className="text-sm md:text-base leading-relaxed text-gray-700 break-words">
                        {visibleCards[1].excerpt || visibleCards[1].content}
                      </p>
                    </div>

                    {/* AUTHOR */}
                    <div className="absolute bottom-3 left-4 sm:left-5 md:left-8 flex items-center gap-2">

                      <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-[10px] sm:text-xs font-semibold">
                        {(visibleCards[1].author?.name || "A").charAt(0)}
                      </div>

                      <div>
                        <p className="text-xs md:text-sm font-semibold text-gray-900">
                          {visibleCards[1].author?.name || "Admin"}
                        </p>

                        <p className="text-[10px] md:text-xs text-gray-500">
                          {visibleCards[1].author?.role || "Healthcare"}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* IMAGE */}
                  <div className="h-full overflow-hidden rounded-t-[40px] md:rounded-l-[120px]">
                    <img
                      src={visibleCards[1].featuredImage || "/default-blog.jpg"}
                      alt={visibleCards[1].title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out"
                    />
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* STACK BARS */}
          <div className="hidden sm:block absolute -top-4 md:-top-5 left-[8%] right-[8%] md:left-20 md:right-20 h-2 md:h-3 bg-white border border-black rounded-t-[50px] opacity-80 z-0"></div>

          <div className="absolute -top-2 left-[5%] right-[5%] md:left-14 md:right-14 h-2 md:h-3 bg-white border border-black rounded-t-[50px] opacity-90 z-0"></div>

          {/* MAIN CARD */}
          <Link
            href={`/blogs/${createSlug(visibleCards[0].title)}-${visibleCards[0].id}`}
            className="block"
          >

            <div
              className={`
                relative
                ${isFalling ? "z-50 animate-fall" : "z-20 scale-[1.02] md:scale-[1.05]"}

                bg-white border border-black shadow-lg overflow-hidden

                rounded-2xl md:rounded-t-3xl

                h-auto
                sm:min-h-[320px]
                md:h-[360px]

                transition-all duration-500 ease-out

                sm:max-w-[95%] md:max-w-full mx-auto
              `}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 h-full">

                {/* LEFT */}
                <div
                  className="
                    p-3 sm:p-4 md:p-6
                    pb-16 sm:pb-16 md:pb-14
                    relative flex flex-col h-full
                  "
                >

                  {/* TEXT */}
                  <div className="flex-1 flex items-center">

                    <p className="text-sm md:text-base leading-relaxed text-gray-700 break-words">
                      {visibleCards[0].excerpt || visibleCards[0].content}
                    </p>

                  </div>

                  {/* AUTHOR */}
                  <div className="absolute bottom-3 left-4 sm:left-5 md:left-8 flex items-center gap-2">

                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-[10px] sm:text-xs font-semibold">
                      {(visibleCards[0].author?.name || "A").charAt(0)}
                    </div>

                    <div>

                      <p className="text-xs md:text-sm font-semibold text-gray-900">
                        {visibleCards[0].author?.name || "Admin"}
                      </p>

                      <p className="text-[10px] md:text-xs text-gray-500">
                        {visibleCards[0].author?.role || "Healthcare"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* IMAGE */}
                <div className="h-full overflow-hidden rounded-t-[40px] md:rounded-l-[120px]">

                  <img
                    src={visibleCards[0].featuredImage || "/default-blog.jpg"}
                    alt={visibleCards[0].title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out"
                  />

                </div>

              </div>

            </div>

            {/* OUTSIDE BUTTON */}
            <div className="flex items-center justify-center my-10 gap-3">

              {/* LEFT LINE */}
              <div className="flex-grow h-[1px] bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"></div>

              {/* BUTTON */}
              <button
                className="
                  btn-iron group relative flex items-center justify-center
                  h-[50px] px-5
                  text-sm md:text-base
                  uppercase
                  rounded-full
                  overflow-hidden

                  bg-gradient-to-r
                  from-blue-500
                  via-purple-500
                  to-pink-400

                  shadow-[0_7px_0_0_rgba(168,85,247,0.9)]

                  active:translate-y-[7px]
                  active:shadow-none
                  transition-all duration-75
                "
              >

                {/* DEFAULT TEXT */}
                <span className="btn-text absolute inset-0 flex items-center justify-center text-white font-semibold tracking-[2px] text-sm md:text-base">
                  READ MORE
                </span>

                {/* LETTERS */}
                <span className="flex gap-[2px]">
                  <i className="letter">R</i>
                  <i className="letter">E</i>
                  <i className="letter">A</i>
                  <i className="letter">D</i>
                  <i className="letter">&nbsp;</i>
                  <i className="letter">M</i>
                  <i className="letter">O</i>
                  <i className="letter">R</i>
                  <i className="letter">E</i>
                </span>

              </button>

              {/* RIGHT LINE */}
              <div className="flex-grow h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600"></div>

            </div>

          </Link>

        </div>
      )}

    </div>

    <div className="mt-6 md:mt-10"></div>

  </div>

</section>


      ) : (
        /* -------------------- NO FEATURED STORY -------------------- */
       
<section className="py-0 bg-white">

  <div className="relative overflow-hidden">

    {/* BACKGROUND LAYERS */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-blue-100/70"></div>

    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-1/4 w-[28rem] h-[28rem] bg-blue-400/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-10 right-1/3 w-[22rem] h-[22rem] bg-purple-400/30 rounded-full blur-[120px]"></div>
    </div>

    {/* MAIN CONTENT */}
    <div
      className="
        bg-background
        animated-bg
        py-4
        flex items-start justify-center
        px-3 sm:px-4
      "
    >

      <div
        className="
          group w-full max-w-lg mx-auto relative

          bg-gradient-to-br
          from-blue-50
          via-white
          to-blue-200/60

          bg-white/70
          backdrop-blur-xl

          rounded-3xl
          border border-gray-200/60

          shadow-[0_10px_30px_rgba(0,0,0,0.08)]

          px-4 sm:px-5
          pt-[145px] sm:pt-[165px] md:pt-[185px]
          pb-5 sm:pb-6

          text-center

          transition-all duration-500
          hover:-translate-y-2
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
        "
      >

        {/* PENCIL */}
        <div className="absolute -top-2 sm:top-0 left-1/2 -translate-x-1/2">
          <div className="pencil-loader scale-75 sm:scale-90 md:scale-100"></div>
        </div>

        {/* TITLE */}
        <h2
          className="
            relative
            text-2xl sm:text-3xl
            font-semibold
            text-blue-900
            mb-1 sm:mb-2
            tracking-tight
            px-2
          "
        >
          <span className="typing-title group-hover:text-blue-700 transition-colors duration-300">
            No Featured Story Yet
          </span>
        </h2>

        {/* EXPLORE BUTTON + REVEAL TEXT */}
        <div className="relative mt-3 mb-2 sm:mb-4 flex justify-center items-center min-h-[65px] sm:min-h-[72px]">

          {/* BUTTON */}
          <button
            onClick={() => setShowInfo(true)}
            className={`
              absolute

              px-4 sm:px-5
              py-2

              rounded-full

              text-sm font-medium
              text-blue-600

              bg-blue-50
              border border-blue-100

              transition-all duration-500

              hover:bg-blue-100
              hover:text-blue-700
              hover:shadow-md

              active:scale-95

              ${showInfo
                ? "opacity-0 scale-90 pointer-events-none"
                : "opacity-100 scale-100"}
            `}
          >
            Explore Articles
          </button>

          {/* PARAGRAPH CARD */}
          <div
            className={`
              w-full
              max-w-[260px] sm:max-w-sm

              transition-all duration-500

              ${showInfo
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-3 scale-95 pointer-events-none absolute"}
            `}
          >

            <div
              className="
                relative overflow-hidden

                rounded-2xl
                border border-blue-100/80

                bg-gradient-to-br
                from-blue-50/90
                via-white
                to-cyan-50/80

                px-4 sm:px-5
                py-4

                shadow-lg shadow-blue-100/40
                backdrop-blur-md
              "
            >

              {/* TOP ACCENT */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400"></div>

              <p className="text-sm leading-relaxed text-gray-600 text-center">
                Check back soon for{" "}
                <span className="font-semibold text-blue-700">
                  featured blog posts
                </span>
                !
              </p>

            </div>
          </div>

        </div>

      </div>

    </div>

  </div>

</section>


      )}
 
      {/* Recent Articles Section */}
   

   <section
  id="recent-articles"
  className="
    -mt-18 md:-mt-24
    pt-10 md:pt-14
    pb-10 md:pb-14
    px-4 sm:px-6 lg:px-8

    bg-gradient-to-br
    from-blue-50
    via-purple-50
    to-pink-50
  "
>
  <div className="max-w-7xl mx-auto">

    {/* 🔷 TOP HEADER ROW */}
{blogs.length > 0 && (

    <div
      className={`
        flex flex-col
        gap-6 mb-10 md:mb-14

        ${!showAll
          ? "lg:flex-row lg:items-center lg:justify-between"
          : "items-center text-center"}
      `}
    >

      {/* LEFT SIDE */}
      <div
        className={`
          flex flex-col items-center
          text-center

          ${!showAll ? "lg:items-start lg:text-left" : ""}
        `}
      >

        {/* Heading */}


<h2
  id="recent-articles"
  aria-label="Our Recent Articles — Fresh Insights Weekly"
  data-AOI="recent-articles-heading"
  tabIndex={0}
 className="
  text-[28px]
  sm:text-[34px]
  md:text-[48px]
  lg:text-[56px]

  font-black
  leading-[1.02]
  tracking-[-0.05em]

bg-gradient-to-b
from-[#2563eb]
to-[#000000]

  bg-clip-text
  text-transparent

  drop-shadow-[0_3px_10px_rgba(0,0,0,0.18)]

  focus:outline
  focus:outline-2
  focus:outline-[#5B9DD9]
"
>
  Our Recent Articles —

  <span
    class="
         block
    mt-3
 
    text-sm
    sm:text-base
    md:text-lg

    font-medium
    leading-relaxed
    tracking-normal

    bg-gradient-to-r
    from-[#2563eb]
    via-[#a855f7]
    to-[#ec4899]

    bg-[length:250%_auto]

    bg-clip-text
    text-transparent

    animate-gradient
        "
  >
    Stay informed with our latest healthcare insights and expert analysis
  </span>
</h2>



      </div>

      {/* DESKTOP BUTTON */}
      <div className="hidden lg:block">
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="
              group flex items-center gap-3
              px-6 py-3 rounded-full
              font-semibold text-white

              bg-gradient-to-r
              from-blue-600
              via-purple-600
              to-pink-500

              shadow-md hover:shadow-xl
              transition-all duration-300 hover:scale-105
              whitespace-nowrap
            "
          >

            <span>View All Articles</span>

            <span
              className="
                flex items-center justify-center
                w-8 h-8 rounded-full
                bg-white text-purple-600
              "
            >
              →
            </span>

          </button>
        )}
      </div>

    </div>
)}

    {/* BLOG GRID */}
    {(() => {
      const sortedBlogs = useMemo(() => {
        return blogs
          .map((blog, index) => ({
            ...blog,
            rank: index + 1,
            score: calculateBlogScore(blog),
          }))
          .sort((a, b) => b.score - a.score);
      }, [blogs]);

      return (
        <>
          {/* LOADING */}
          {loading ? (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {Array.from({ length: 4 }).map((_, index) => (

                <div
                  key={index}
                  className="
                    bg-white/70
                    backdrop-blur-xl
                    rounded-3xl
                    shadow-md
                    border border-white/50
                    p-4
                    animate-pulse
                  "
                >

                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>

                  <div className="h-4 bg-gray-200 w-3/4 rounded mb-3"></div>

                  <div className="h-4 bg-gray-200 w-1/2 rounded mb-3"></div>

                  <div className="h-3 bg-gray-200 w-full rounded mb-2"></div>

                  <div className="h-3 bg-gray-200 w-4/5 rounded mb-6"></div>

                  <div className="flex justify-between">
                    <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                  </div>

                </div>

              ))}

            </div>

          ) : sortedBlogs.length > 0 ? (
         

            <>
              {/* BLOG CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {sortedBlogs
                  .slice(0, showAll ? sortedBlogs.length : 4)
                  .map((post) => (


 <Link
                            key={post.id}
                            href={`/blogs/${createSlug(post.title)}-${post.id}`}
                            className="group"
                          >
                           


<motion.article
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.2 }}
  transition={{ duration: 0.6 }}

  className="
    group relative
    h-[280px] sm:h-[320px] md:h-[360px] lg:h-[380px]
    rounded-3xl overflow-hidden
    border border-gray-100
    shadow-md hover:shadow-2xl
    transition-all duration-500
    hover:-translate-y-1
    cursor-pointer
    active:scale-[0.98]
  "
>

  {/* 🌄 IMAGE */}
  <img
    src={post.featuredImage || "/placeholder.svg"}
    alt={post.title}
    className="
      absolute inset-0 w-full h-full
      object-cover
      transition duration-700
      group-hover:scale-105
    "
  />

  {/* 🌑 OVERLAY */}
  <div
    className="
      absolute inset-0
      bg-gradient-to-t
      from-black/70 via-black/20 to-transparent
    "
  />

  {/* 🏷 CATEGORY */}
  <span
    className="
      absolute top-4 left-4 z-20
      px-3 py-1 text-xs font-medium
      bg-white/80 text-black
      rounded-full shadow
      backdrop-blur-sm
    "
  >
    {post.category || "Healthcare"}
  </span>

  {/* ➡️ ARROW */}
  <Link
    href={`/blogs/${createSlug(post.title)}-${post.id}`}
    className="
      absolute top-3 right-3 z-20
      w-8 h-8 sm:w-10 sm:h-10
      bg-white/90 rounded-full
      flex items-center justify-center
      text-black shadow
      hover:scale-110 transition
    "
  >
    →
  </Link>

  {/* ================= MOBILE + TABLET TITLE ================= */}

  <motion.div
    initial={{ opacity: 1, y: 0 }}

    whileInView={{
      opacity: 0,
      y: -20,
    }}

    viewport={{
      once: false,
      amount: 0.5,
    }}

    transition={{
      duration: 0.6,
      delay: 1,
    }}

    className="
      absolute bottom-5 left-5 right-5
      z-20

      lg:hidden
    "
  >

    <h3
      className="
        text-lg sm:text-xl
        font-semibold
        text-white
        drop-shadow-md
        line-clamp-2
      "
    >
      {post.title}
    </h3>

  </motion.div>

  {/* ================= MOBILE FULL REVEAL ================= */}

  <motion.div
    initial={{
      opacity: 0,
      y: 50,
    }}

    whileInView={{
      opacity: 1,
      y: 0,
    }}

    viewport={{
      once: false,
      amount: 0.5,
    }}

    transition={{
      duration: 0.7,
      delay: 1.2,
    }}

    className="
      absolute inset-0 z-20
      flex flex-col justify-end
      p-5

      md:hidden
    "
  >

    <div
      className="
        bg-black/30
        backdrop-blur-[2px]
        rounded-2xl
        p-4
      "
    >

      <p className="text-white text-sm leading-relaxed line-clamp-3 mb-4">
        {post.excerpt || post.content?.substring(0, 100) + "..."}
      </p>

      <div className="flex items-center justify-between border-t border-white/20 pt-3">

        <div className="flex items-center gap-2 text-white text-xs">
          <span>👤</span>
          <span>{post.author?.name || "Admin"}</span>
        </div>

        <div className="flex items-center gap-2 text-white text-xs">
          <span>⏱</span>
          <span>{Math.ceil(post.content.length / 500)} min</span>
        </div>

      </div>

      <div className="flex items-center gap-2 text-white/70 text-[11px] mt-2">

        <span>📅</span>

        <span>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>

      </div>

    </div>

  </motion.div>

  {/* ================= TABLET SUBTLE REVEAL ================= */}

  <motion.div
    initial={{
      opacity: 0,
      y: 30,
    }}

    whileInView={{
      opacity: 1,
      y: 0,
    }}

    viewport={{
      once: false,
      amount: 0.4,
    }}

    transition={{
      duration: 0.7,
      delay: 1.2,
    }}

    className="
      hidden md:flex lg:hidden

      absolute inset-0 z-20
      flex-col justify-end
      p-6
    "
  >

    <div
      className="
        bg-black/20
        backdrop-blur-sm
        rounded-2xl
        p-5
      "
    >

      <p className="text-white text-sm leading-relaxed line-clamp-2 mb-4">
        {post.excerpt || post.content?.substring(0, 90) + "..."}
      </p>

      <div className="flex items-center justify-between text-white text-xs">

        <span>
          ⏱ {Math.ceil(post.content.length / 500)} min
        </span>

        <span>
          📅 {new Date(post.createdAt).toLocaleDateString()}
        </span>

      </div>

    </div>

  </motion.div>

  {/* ================= DESKTOP TITLE ================= */}

  <div
    className="
      hidden lg:block

      absolute bottom-5 left-5 right-5
      z-10

      transition duration-300
      group-hover:opacity-0
    "
  >

    <h3
      className="
        text-lg font-semibold
        text-white drop-shadow-md
        line-clamp-2
      "
    >
      {post.title}
    </h3>

  </div>

  {/* ================= DESKTOP HOVER ================= */}

  <div
    className="
      hidden lg:flex

      absolute inset-0 z-10
      flex-col justify-end
      p-5 sm:p-6

      bg-gradient-to-t
      from-black/70 via-black/20 to-transparent

      opacity-0
      group-hover:opacity-100

      transition-all duration-500
    "
  >

    <div
      className="
        translate-y-8
        group-hover:translate-y-0

        transition-all duration-500
      "
    >

      <p className="text-white text-sm sm:text-base leading-relaxed line-clamp-3 mb-5 max-w-sm">
        {post.excerpt || post.content?.substring(0, 120) + "..."}
      </p>

      <div className="flex items-center justify-between border-t border-white/20 pt-4">

        <div className="flex items-center gap-2 text-white text-sm">
          <span>👤</span>
          <span>{post.author?.name || "Admin"}</span>
        </div>

        <div className="flex items-center gap-2 text-white text-sm">
          <span>⏱</span>
          <span>{Math.ceil(post.content.length / 500)} min</span>
        </div>

      </div>

      <div className="flex items-center gap-2 text-white/80 text-xs mt-3">

        <span>📅</span>

        <span>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>

      </div>

    </div>

  </div>

</motion.article>



                          </Link>
                    
                  ))}

              </div>

              {/* MOBILE BUTTON */}
              {!showAll && (
                <div className="flex justify-center mt-12 sm:mt-16 px-4 lg:hidden">

                  <button
                    onClick={() => setShowAll(true)}
                    className="
                      group flex items-center gap-3
                      px-6 py-3 rounded-full
                      font-semibold text-white

                      bg-gradient-to-r
                      from-blue-600
                      via-purple-600
                      to-pink-500

                      shadow-md hover:shadow-xl
                      transition-all duration-300 hover:scale-105
                    "
                  >

                    <span>View All Articles</span>

                    <span
                      className="
                        flex items-center justify-center
                        w-8 h-8 rounded-full
                        bg-white/20
                        group-hover:bg-white/30
                        transition
                      "
                    >
                      →
                    </span>

                  </button>

                </div>
              )}

              {/* SHOW LESS */}
              {showAll && (
                <div className="flex justify-center mt-12 sm:mt-16 px-4">

                  <button
                    onClick={() => {
                      const section = document.getElementById("recent-articles");

                      section?.scrollIntoView({
                        behavior: "smooth",
                      });

                      setShowAll(false);
                    }}
                    className="
                      group flex items-center gap-3
                      px-6 py-3 rounded-full
                      font-semibold text-white

                      bg-gradient-to-r
                      from-blue-600
                      via-purple-600
                      to-pink-500

                      shadow-md hover:shadow-xl
                      transition-all duration-300 hover:scale-105
                    "
                  >

                    <span
                      className="
                        flex items-center justify-center
                        w-8 h-8 rounded-full
                        bg-white/20
                        group-hover:bg-white/30
                        transition
                      "
                    >
                      ←
                    </span>

                    <span>Show Less</span>

                  </button>

                </div>
              )}

            </>

          ) : (

            // <div className="text-center py-16">

            //   <h3 className="text-2xl font-bold mb-3 text-gray-900">
            //     No articles yet
            //   </h3>

            //   <p className="text-gray-600 text-base">
            //     Check back soon for the latest healthcare insights and expert analysis.
            //   </p>

            // </div>


<div className="flex justify-center pt-20 pb-3 sm:pt-14 sm:pb-5 px-4">

  {/* CARD WRAPPER */}
  <div
    className="
      group
      relative

      w-full
      max-w-xl

      min-h-[240px]
      sm:min-h-[300px]
      md:min-h-[340px]

      bg-gradient-to-br
      from-blue-100
      via-white
      to-blue-300/60

      backdrop-blur-xl

      rounded-3xl

      border border-gray-200/60

      shadow-[0_10px_30px_rgba(0,0,0,0.08)]

      flex

      overflow-visible

      transition-all
      duration-500

      hover:-translate-y-2
      hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
    "
  >

    {/* ================= LEFT PANEL ================= */}
    <div
      className="
        absolute
        left-0
        top-0

        h-full
        w-[42%]

        bg-gradient-to-br
        from-indigo-500/80
      via-purple-500/70
        to-blue-400/80
shadow-[8px_0_30px_rgba(79,70,229,0.25)]

        rounded-l-3xl

        flex items-center

        px-5

        z-0

        opacity-0
        -translate-x-full

        group-hover:opacity-100
        group-hover:translate-x-0

        group-active:opacity-100
        group-active:translate-x-0

        transition-all
        duration-[900ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]
      "
    >

      <div
        className="
          text-white

          px-4

          opacity-0
          translate-x-[-25px]
          scale-95

          group-hover:opacity-100
          group-hover:translate-x-0
          group-hover:scale-100

          group-active:opacity-100
          group-active:translate-x-0
          group-active:scale-100

          transition-all
          duration-700
          delay-300

          ease-out
        "
      >

        <h2
          className="
            text-lg sm:text-xl
            font-semibold

            leading-tight
            tracking-tight
          "
        >
          No Articles Available
        </h2>

        <p
          className="
            mt-2

            text-[11px]
            sm:text-xs

            leading-relaxed
            opacity-90
          "
        >
          Check back soon for the latest healthcare insights
          and expert analysis.
        </p>

      </div>

    </div>

    {/* ================= RIGHT PANEL ================= */}
    <div
      className="
        flex-1
        h-full

        p-4

        flex items-center justify-center

        relative
        z-10
      "
    >

      {/* RIGHT INNER CARD WRAPPER */}
      <div
        className="
          w-full
          h-full

          flex items-center justify-center

          transition-all
          duration-[900ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:translate-x-[20%]
sm:group-hover:translate-x-[30%]
md:group-hover:translate-x-[44%]

group-active:translate-x-[20%]
sm:group-active:translate-x-[30%]
md:group-active:translate-x-[44%]

will-change-transform

group-hover:opacity-0
group-active:opacity-0

md:group-hover:opacity-100
md:group-active:opacity-100


        "
      >

        {/* RIGHT INNER CARD */}
        <div
          className="
            w-full
            h-full

            bg-white/75
            backdrop-blur-lg

            rounded-2xl

            border border-white/40

            shadow-lg

            p-4

            flex flex-col
            gap-4

            relative
            overflow-visible

            transition-all
            duration-[900ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]

            will-change-transform
          "
        >

          {/* GLOW */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col h-full">

            {/* LOADER */}
            <div className="flex justify-center items-center h-[180px] sm:h-[200px]">

              <div className="loader">
                <div>
                  <ul>
                    {[...Array(5)].map((_, i) => (
                      <li key={i}>
                        <svg fill="currentColor" viewBox="0 0 90 120">
                          <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* TEXT */}
            <div className="text-center space-y-1 -mt-4">

              <h2 className="text-base sm:text-lg font-semibold text-blue-900">
                Recent Articles
              </h2>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Stay informed with the latest healthcare insights, research
                updates, and expert-backed analysis curated just for you.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>





          )}
        </>
      );
    })()}

  </div>
</section>


      {/* Trending Topics Section */}
    
    <section
  className="
    py-8 md:py-12
    bg-gradient-to-br
    from-pink-100/70
    via-purple-100/60
    to-blue-100/70
  "
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6">

    {/* Header */}
    <div className="text-center mb-14 px-4">

      {/* Heading */}
 

<div className="text-center">

 
 <h2
  id="trending-topics"
  aria-label="Trending Topics — Explore top healthcare insights now"
  className="
    text-center

    text-[28px]
    sm:text-[34px]
    md:text-[48px]
    lg:text-[56px]

    font-black
    leading-[1.02]
    tracking-[-0.05em]

    bg-gradient-to-b
    from-[#2563eb]
    to-[#000000]

    bg-clip-text
    text-transparent

    drop-shadow-[0_3px_10px_rgba(0,0,0,0.18)]

    focus:outline
    focus:outline-2
    focus:outline-[#5B9DD9]
  "
>
  Trending Topics

<span
  className="
    block
    mt-3
 
    text-sm
    sm:text-base
    md:text-lg

    font-medium
    leading-relaxed
    tracking-normal

    bg-gradient-to-r
    from-[#2563eb]
    via-[#a855f7]
    to-[#ec4899]

    bg-[length:250%_auto]

    bg-clip-text
    text-transparent

    animate-gradient
  "
>
  Explore the most discussed healthcare topics and emerging trends
</span>

</h2>


</div>



    </div>

    {/* Premium Topic Cards */}
   

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
               {categories.map((topic, index) => (
                 <div key={index} className="group cursor-pointer">
                   <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl md:rounded-3xl p-5 md:p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40 overflow-hidden">
                     {/* Gradient Highlight on Hover */}
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-secondary/10 transition-all duration-500 rounded-2xl md:rounded-3xl pointer-events-none"></div>
   
                     {/* Content Container */}
                     <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[140px] py-4">
                       {/* Icon - Bigger, Floating */}
                       <div className="mb-3 md:mb-4 transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-500">
                         <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
                           <Image
                             src={topic.image}
                             alt={topic.name}
                             fill
                             className="object-contain drop-shadow-lg"
                           />
                         </div>
                       </div>
   
                       {/* Title - Clear Hierarchy */}
                       <h3 className="font-bold text-foreground mb-1 md:mb-2 text-sm md:text-base group-hover:text-primary transition-colors duration-300">
                         {topic.name}
                       </h3>
   
                       {/* Count - Below Title */}
                       <p className="text-xs font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300 mb-2 md:mb-3">
                         {topic.count} articles
                       </p>
   
                       {/* Bottom Accent Line - Animated */}
                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                       </div>
                     </div>
   
                     {/* Neumorphism Shadow Effect */}
                     <div
                       className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                       style={{
                         boxShadow:
                           "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)",
                       }}
                     ></div>
                   </div>
                 </div>
               ))}
             </div>

  </div>
</section>



      {/* Category Filter Section */}
      <section className="relative py-10 md:py-16 bg-background overflow-hidden white-100/30">
       

  {/* Floating Small Bubbles */}

<div className="absolute inset-0 overflow-hidden pointer-events-none">



  {/* Top Left */}
  <div className="absolute top-[6%] left-[4%] w-[110px] h-[110px] rotate-[18deg] rounded-[34px] bg-purple-300/10 border border-purple-300/20 backdrop-blur-[20px] animate-float" />

  {/* Top Right */}
  <div className="absolute top-[12%] right-[8%] w-[220px] h-[220px] -rotate-[16deg] rounded-[42px] bg-purple-300/10 border border-purple-300/20 backdrop-blur-[20px] animate-float" />

  {/* Left Bottom */}
  <div className="absolute bottom-[14%] left-[16%] w-[120px] h-[120px] rotate-[12deg] rounded-[34px] bg-blue-400/10 border border-blue-300/20 backdrop-blur-[20px] animate-float" />

  {/* Bottom Center */}
  <div className="absolute bottom-[6%] left-[42%] w-[160px] h-[160px] -rotate-[10deg] rounded-[38px] bg-violet-300/10 border border-violet-300/20 backdrop-blur-[20px] animate-float" />

  {/* Right Mid */}
  <div className="absolute top-[48%] right-[12%] w-[100px] h-[100px] rotate-[14deg] rounded-[30px] bg-sky-300/10 border border-sky-400/20 backdrop-blur-[20px] animate-float" />


{/* Small Bottom Left Purple */}
<div className="absolute bottom-[4%] left-[4%] w-[70px] h-[70px] rotate-[18deg] rounded-[28px] bg-purple-500/10 border border-purple-200/20 backdrop-blur-[20px] animate-float" />



</div>


 {/* Animated Bokeh Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-10">
          <div className="bg-card border border-border backdrop-blur-sm rounded-3xl px-8 py-10 shadow-lg">
            {/* <h2 className="text-center text-3xl md:text-4xl font-bold text-foreground mb-8">
              Explore by Category
            </h2> */}
            <h2
  // className="text-center text-[28px] sm:text-[34px] md:text-[48px] lg:text-[56px] font-black leading-[1.02] tracking-[-0.05em] bg-gradient-to-b from-[#111111] via-[#1f1f1f] to-[#4b5563] bg-clip-text text-transparent mb-8"
  className="
  mb-8
  text-center
  text-[28px]
  sm:text-[34px]
  md:text-[48px]
  lg:text-[56px]

  font-black
  leading-[1.02]
  tracking-[-0.05em]

 bg-gradient-to-b
from-[#2563eb]
to-purple

  bg-clip-text
  text-transparent

  drop-shadow-[0_3px_10px_rgba(0,0,0,0.18)]

  focus:outline
  focus:outline-2
  focus:outline-[#5B9DD9]
"
>
  Explore by Category



</h2>

            <div className="flex flex-wrap justify-center items-center gap-3">
              {[
                "All",
                "Wellness",
                "Nutrition",
                "Mental Health",
                "Technology",
                "Research",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105"
                      : "bg-muted text-foreground hover:bg-muted/80 border border-border hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured + Subscribe Section */}
      <section
        id="subscribe-section"
        className="py-10 md:py-16 bg-gradient-to-br from-background via-background to-secondary/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Featured Card (2 columns) */}
            <div className="lg:col-span-2">
              {blogs.length > 0 && (
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl h-full min-h-[50vh] md:min-h-[480px]">
                  <Image
                    src={blogs[currentIndex]?.featuredImage || "/default.jpg"}
                    alt={blogs[currentIndex]?.title || "Featured Blog"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 text-white z-10">
                    <span className="inline-block bg-primary/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-wide">
                      {blogs[currentIndex]?.category || "Health"}
                    </span>

                    <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight line-clamp-2">
                      {blogs[currentIndex]?.title || "Featured Insight"}
                    </h3>

                    <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-6">
                      {blogs[currentIndex]?.excerpt ||
                        blogs[currentIndex]?.content?.substring(0, 120) + "..."}
                    </p>

                    <Link
                      href={`/blogs/${createSlug(blogs[currentIndex]?.title)}-${blogs[currentIndex]?.id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      Read More →
                    </Link>
                  </div>

                  {/* Indicators */}
                  <div className="absolute top-6 right-6 flex gap-2 z-20">
                    {blogs.slice(0, 3).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`rounded-full transition-all duration-300 ${
                          currentIndex === index
                            ? "bg-white w-8 h-2"
                            : "bg-white/40 w-2 h-2 hover:bg-white/60"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Subscribe Box */}
            {/* <div className="lg:col-span-1">
              <div className="h-full min-h-[480px] bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-primary-foreground/80 mb-8 text-sm leading-relaxed">
                  Subscribe to get the latest healthcare insights and wellness
                  updates.
                </p>

                <form
                  onSubmit={handleSubscribeSubmit}
                  className="flex flex-col gap-4 mb-6"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                  >
                    {loading ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>

                {success && (
                  <div className="bg-green-500/20 border border-green-400/40 text-green-100 px-4 py-3 rounded-xl text-sm animate-fade-in">
                    ✓ Successfully subscribed! Thank you for joining us.
                  </div>
                )}
              </div>
            </div> */}

{/* Subscribe Box */}
<div className="lg:col-span-1 w-full">
  <div className="w-full h-full overflow-hidden
    min-h-[320px] sm:min-h-[380px] lg:min-h-[480px]
    bg-gradient-to-br from-primary to-secondary
    text-primary-foreground rounded-3xl
    p-5 sm:p-6 md:p-8
    shadow-2xl flex flex-col justify-center"
  >
    
    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
      Stay Updated
    </h2>

    <p className="text-primary-foreground/80 mb-6 text-sm sm:text-base leading-relaxed">
      Subscribe to get the latest healthcare insights and wellness updates.
    </p>

    <form
      onSubmit={handleSubscribeSubmit}
      className="flex flex-col gap-4 mb-6 w-full"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="w-full px-4 py-3 rounded-xl 
        bg-white/10 border border-white/20
        text-primary-foreground
        placeholder-primary-foreground/50
        focus:outline-none focus:ring-2
        focus:ring-white/40 transition-all"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-primary
        font-semibold px-6 py-3 rounded-xl
        hover:bg-gray-100 hover:shadow-lg
        transition-all duration-300 disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>

    {success && (
      <div className="bg-green-500/20 border border-green-400/40 
      text-green-100 px-4 py-3 rounded-xl text-sm">
        ✓ Successfully subscribed!
      </div>
    )}
  </div>
</div>

          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Know Us */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Know Us
              </h4>
              <ul className="space-y-2 text-sm text-background/70">
                {[
                  "About Us",
                  "Contact Us",
                  "Press Coverage",
                  "Careers",
                  "Business Partnership",
                  "Become a Health Partner",
                  "Corporate Governance",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-background transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Our Policies
              </h4>
              <ul className="space-y-2 text-sm text-background/70">
                {[
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Editorial Policy",
                  "User Manual",
                  "Important Documents",
                  "Required Documents",
                  "Patient Form",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-background transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Our Services
              </h4>
              <ul className="space-y-2 text-sm text-background/70">
                {[
                  "Features for Doctor",
                  "Features for Hospital",
                  "Features for Lab",
                  "Features for HSP",
                  "Features for Patient",
                  "Features for Chemist",
                  "Features for Health Worker",
                  "Features for Pharma Manufacturers",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-background transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect  */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h4>
              <p className="text-sm text-background/70 mb-4">
                Follow Aarogya Insights for latest updates
              </p>

              {/* Social Icons */}
              <div className="flex gap-3 mb-8">
                {[Instagram, Facebook, Twitter, Linkedin, Youtube].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="p-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5 text-background" />
                    </a>
                  ),
                )}
              </div>

              {/* Subscribe Section  */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                  Aarogya Insights
                </h4>
                <p className="text-background/70 text-sm mb-4">
                  Subscribe for weekly health insights.
                </p>

                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-background/10 text-background placeholder:text-background/50 text-sm border border-background/20 focus:border-background/50 focus:outline-none transition-colors"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-background/20 py-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Compact Info Row */}
            <div className="w-full text-background/70 text-xs md:text-sm flex flex-col items-center md:items-start gap-1">
              {/* Row 1 */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                <span>Government of India | Aarogya Insights</span>
                <span className="hidden md:inline">•</span>
                <span>ISO:27001 Certified</span>
                <span className="hidden md:inline">•</span>
                <span>Online Healthcare Platform</span>
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                <span>Your Health, Your Choice</span>
                <span className="hidden md:inline">•</span>
                <span>+91 79-7272-7498</span>
                <span className="hidden md:inline">•</span>
                <span>info@aarogya.com</span>
              </div>
            </div>

            {/* Original Footer Text */}
            <p className="text-background/60 text-xs md:text-sm text-center md:text-left">
              © 2024 Aarogya Insights Pvt. Ltd. All rights reserved. IT Act,
              2000 compliant.
            </p>

            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
            >
              <ArrowUp className="w-5 h-5 text-background" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
