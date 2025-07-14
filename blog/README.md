# Blog Organization Structure

## Directory Structure

```
blog/
├── blog.html              # Main blog listing page
├── blog.js                # Blog functionality and post data
├── blog-styles.css        # Blog-specific styling
├── blog-post-template.html # Template for creating new blog posts
├── BLOG_GUIDE.md          # Guide for creating blog posts
├── images/                # Shared blog images
│   ├── blog1.JPG
│   └── parth.JPG
├── angel-investment/      # Angel investment blog post
│   ├── index.html         # The blog post content
│   └── images/            # Images specific to this post
│       ├── blog1.JPG
│       ├── angel-blog.JPG
│       └── parth.JPG
└── [future-blog-posts]/   # Future blog posts will follow this structure
    ├── index.html
    └── images/
```

## Creating New Blog Posts

### Step 1: Create Directory Structure
1. Create a new directory in `blog/` with a slug name (e.g., `blog/my-new-post/`)
2. Create an `images/` subdirectory within the blog post directory
3. Place all images specific to that blog post in the `images/` subdirectory

### Step 2: Create Blog Post File
1. Copy `blog-post-template.html` to `blog/my-new-post/index.html`
2. Replace all placeholders in the template:
   - `[BLOG_TITLE]` - The title of your blog post
   - `[BLOG_DESCRIPTION]` - Brief description for meta tags
   - `[BLOG_KEYWORDS]` - SEO keywords
   - `[AUTHOR_NAME]` - Author's name
   - `[BLOG_SLUG]` - URL-friendly version of the title
   - `[BLOG_IMAGE]` - Featured image filename
   - `[CATEGORY]` - Blog category
   - `[DATE]` - Publication date
   - `[READ_TIME]` - Estimated reading time
   - `[AUTHOR_INITIAL]` - Author's initial for avatar
   - `[AUTHOR_ROLE]` - Author's role/title
   - `[BLOG_CONTENT]` - The actual blog content
   - `[TAG1]`, `[TAG2]`, `[TAG3]` - Tags for the post

### Step 3: Update Blog Index
1. Open `blog/blog.js`
2. Add a new object to the `blogPosts` array:
```javascript
{
    id: 2, // Increment the ID
    title: "Your Blog Title",
    excerpt: "Brief excerpt...",
    category: "category",
    author: "Author Name",
    authorInitial: "A",
    date: "2025-01-20",
    readTime: 5,
    image: "my-new-post/images/featured-image.jpg",
    featured: false, // Set to true if featured
    url: "my-new-post/"
}
```

### Step 4: Test
1. Open `blog/blog.html` to verify the new post appears
2. Click on the post to ensure it navigates correctly
3. Verify all images load properly

## File Paths

All blog posts should use relative paths from their location:
- CSS: `../../styles.css` and `../blog-styles.css`
- JavaScript: `../../script.js` and `../../theme.js`
- Images (navbar): `../../images/`
- Images (blog-specific): `images/`
- Navigation links: `../../index.html`, `../blog.html`, etc.

## Benefits of This Structure

1. **Organization**: Each blog post has its own directory with associated images
2. **Scalability**: Easy to add new blog posts without cluttering the main directory
3. **Maintainability**: Images are kept with their respective posts
4. **SEO-friendly**: Clean URLs (e.g., `/blog/angel-investment/`)
5. **Easy management**: All related files are grouped together 