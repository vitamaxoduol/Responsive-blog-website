document.addEventListener("DOMContentLoaded", function () {
  // to toggle the visibility of the menu items when the menu icon is clicked.

  window.toggleMenu = function () {
    let menuItems = document.getElementById("menu-items");
    menuItems.classList.toggle("show");
  };
  
  // Fetch all blogs and display them in the blog listing
  // function fetchBlogs() {
  //   fetch('http://localhost:3000/blogs')
  //   .then(response => response.json())
  //   .then(data => {
  //       const blogListing = document.getElementById('blog-listing');
  //       data.forEach(blog => {
  //           const article = document.createElement('article');
  //           article.classList.add('blog-item');
  //           article.innerHTML = `
  //               <h3>${blog.title}</h3>
  //               <p>${blog.summary}</p>
  //               <img src="${blog.image}" alt="Blog Image" />
  //               <a href="#blog-post" class="read-more" data-id="${blog.id}">Read More</a>
  //           `;
  //           blogListing.appendChild(article);
  //       });
  //   });
  // }
  // fetchBlogs();

  // Or
  // Fetch all blogs and display them in the blog listing
  async function fetchBlogs() {
    try {
      const response = await fetch("http://localhost:3000/blogs");
      const data = await response.json();

      const blogListing = document.getElementById("blog-listing");
      data.forEach((blog) => {
        const article = document.createElement("article");
        article.classList.add("blog-item");
        article.innerHTML = `
              <h3>${blog.title}</h3>
              <p>${blog.summary}</p>
              <img src="${blog.image}" alt="Blog Image" />
              <button class="like-button" data-id="${blog.id}">Like <span class="like-count">0</span></button>
              <button class="dislike-button" data-id="${blog.id}">Dislike <span class="dislike-count">0</span></button>
              <a href="#blog-post" class="read-more" data-id="${blog.id}">Read More</a>
          `;
        blogListing.appendChild(article);
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }
  fetchBlogs();

  // Display the content of a particular blog in the Blog Post section
  // when 'Read More' is clicked.
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("read-more")) {
      const blogId = e.target.getAttribute("data-id");
      fetchBlogContent(blogId);
    }
  });

  async function fetchBlogContent(blogId) {
    try {
      const response = await fetch(`http://localhost:3000/blogs/${blogId}`);
      const data = await response.json();

      const blogPostSection = document.getElementById("blog-post");
      blogPostSection.innerHTML = `
  <h3>${data.title}</h3>
  <p>${data.content}</p>
  <img src="${data.image}" alt="Blog Image" />`;
    } catch (error) {
      console.error("Error fetching blog content:", error);
    }
  }


// Allow a user to like and dislike a blog post and display the count of likes.
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('like-button')) {
      const blogId = e.target.getAttribute('data-id');
      updateLikes(blogId, true);
  } else if (e.target.classList.contains('dislike-button')) {
      const blogId = e.target.getAttribute('data-id');
      updateLikes(blogId, false);
  }
});

function updateLikes(blogId, isLike) {
  // Keep track of likes and dislikes in session storage
  let likes = sessionStorage.getItem(`blog-${blogId}-likes`);
  let dislikes = sessionStorage.getItem(`blog-${blogId}-dislikes`);
  
  likes = likes ? parseInt(likes, 10) : 0;
  dislikes = dislikes ? parseInt(dislikes, 10) : 0;

  // Increment likes or dislikes
  if (isLike) {
      likes++;
  } else {
      dislikes++;
  }

  // Store the updated likes and dislikes back to session storage
  sessionStorage.setItem(`blog-${blogId}-likes`, likes);
  sessionStorage.setItem(`blog-${blogId}-dislikes`, dislikes);

  // Display updated likes
  const likeCount = document.querySelector(`.like-button[data-id="${blogId}"] .like-count`);
  likeCount.innerText = likes;

  // Display updated dislikes
  const dislikeCount = document.querySelector(`.dislike-button[data-id="${blogId}"] .dislike-count`);
  dislikeCount.innerText = dislikes;
}


 // Function to add a blog post to the UI
function addBlogPostToUI(post) {
  const article = document.createElement('article');
  article.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.summary}</p>
      <img src="${post.image}" alt="${post.title}" />
      <div>${post.content}</div>
  `;

  document.getElementById('blogs').appendChild(article);
}

// Function to convert image file to data URL
function toDataUrl(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
  });
}

document.getElementById('blogForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const summary = document.getElementById('summary').value;
  const content = document.getElementById('content').value;
  const imageFile = document.getElementById('image').files[0];

  // Convert image file to data URL
  const imageUrl = await toDataUrl(imageFile);

  const newPost = {
      title: title,
      summary: summary,
      content: content,
      image: imageUrl,
  };

  // Add the new blog post to the local storage
  const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
  posts.push(newPost);
  localStorage.setItem('blogPosts', JSON.stringify(posts));

  // Add the new blog post to the UI
  addBlogPostToUI(newPost);

  // Clear the form
  e.target.reset();
  document.getElementById('imagePreview').src = "#";
});

// Handling featured post
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more')) {
        const postId = e.target.getAttribute('data-id');
        displaySingleBlogPost(postId);
    }
});

function loadFeaturedBlogPost() {
    fetch('http://localhost:3000/blogs')
    .then(response => response.json())
    .then(posts => {
        // Assuming the first post is the featured one
        const featuredPost = posts[0];
        if (featuredPost) {
            addFeaturedPostToUI(featuredPost);
        }
    });
}
loadFeaturedBlogPost();

function addFeaturedPostToUI(post) {
    const article = document.getElementById('featured-article');
    article.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <img src="${post.image}" alt="${post.title}" />
        <a href="#blog-post" class="read-more" data-id="${post.id}">Read More</a>
    `;
}

function displaySingleBlogPost(postId) {
    fetch(`http://localhost:3000/blogs/${postId}`)
    .then(response => response.json())
    .then(post => {
        const article = document.getElementById('single-blog-post');
        article.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
        `;
    });
}


// Posting a created blog
document.getElementById('blogForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const summary = document.getElementById('summary').value;
  const content = document.getElementById('content').value;
  const imageFile = document.getElementById('image').files[0];

  const formData = new FormData();
  formData.append('title', title);
  formData.append('summary', summary);
  formData.append('content', content);
  formData.append('image', imageFile);
  
  try {
      const response = await fetch('http://localhost:3000/blogs', {
          method: 'POST',
          body: formData
      });

      if (response.ok) {
          // Optionally, you can fetch and update the blog list again
          fetchBlogs();
          // Clear the form
          e.target.reset();
          document.getElementById('imagePreview').src = "#";
      } else {
          console.error('Failed to post the blog', response);
      }
  } catch (error) {
      console.error('Error posting blog:', error);
  }
});


// // Deleting a post from the server
// document.addEventListener('click', function(event) {
//   if (event.target.classList.contains('delete-btn')) {
//       const id = event.target.getAttribute('data-id');

//       fetch(`http://localhost:3000/blogs/${id}`, {
//           method: 'DELETE',
//       })
//       .then(response => response.json())
//       .then(data => {
//           console.log('Success:', data);
//           // Remove the blog post from the DOM
//           const blogPostElement = document.getElementById(`blog-post-${id}`);
//           blogPostElement.remove();
//       })
//       .catch((error) => {
//           console.error('Error:', error);
//       });
//   }
// });

});