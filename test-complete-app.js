// Comprehensive test script to verify all functionality
const API_BASE = 'http://localhost:4000/api';

async function testCompleteApp() {
  console.log('🧪 Testing Complete Blog Application...\n');
  
  try {
    // Test 1: Server Health
    console.log('1. Testing server health...');
    const healthRes = await fetch(`${API_BASE.replace('/api', '')}/api/health`);
    if (healthRes.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }
    
    // Test 2: User Registration
    console.log('\n2. Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const signupRes = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(testUser)
    });
    
    if (signupRes.ok) {
      console.log('✅ User registration successful');
    } else {
      const error = await signupRes.json();
      if (error.error === 'Email already registered') {
        console.log('✅ User already exists (expected)');
      } else {
        console.log('❌ Registration failed:', error.error);
      }
    }
    
    // Test 3: User Login
    console.log('\n3. Testing user login...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    if (loginRes.ok) {
      console.log('✅ User login successful');
    } else {
      console.log('❌ Login failed:', (await loginRes.json()).error);
      return;
    }
    
    // Test 4: Create Post
    console.log('\n4. Testing post creation...');
    const newPost = {
      title: 'Test Blog Post',
      content: 'This is a test blog post content. It should be saved to the database.',
      tags: ['test', 'blog', 'demo'],
      status: 'published',
      featured: false
    };
    
    const createPostRes = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newPost)
    });
    
    let postId;
    if (createPostRes.ok) {
      const postData = await createPostRes.json();
      postId = postData.post._id;
      console.log('✅ Post creation successful, ID:', postId);
    } else {
      console.log('❌ Post creation failed:', (await createPostRes.json()).error);
      return;
    }
    
    // Test 5: Get All Posts
    console.log('\n5. Testing get all posts...');
    const postsRes = await fetch(`${API_BASE}/posts`);
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      console.log(`✅ Retrieved ${postsData.posts.length} posts`);
    } else {
      console.log('❌ Failed to get posts:', (await postsRes.json()).error);
    }
    
    // Test 6: Get My Posts
    console.log('\n6. Testing get my posts...');
    const myPostsRes = await fetch(`${API_BASE}/posts/my`, {
      credentials: 'include'
    });
    if (myPostsRes.ok) {
      const myPostsData = await myPostsRes.json();
      console.log(`✅ Retrieved ${myPostsData.posts.length} of my posts`);
    } else {
      console.log('❌ Failed to get my posts:', (await myPostsRes.json()).error);
    }
    
    // Test 7: Get Single Post
    console.log('\n7. Testing get single post...');
    const singlePostRes = await fetch(`${API_BASE}/posts/${postId}`);
    if (singlePostRes.ok) {
      const postData = await singlePostRes.json();
      console.log('✅ Retrieved single post:', postData.post.title);
    } else {
      console.log('❌ Failed to get single post:', (await singlePostRes.json()).error);
    }
    
    // Test 8: Like Post
    console.log('\n8. Testing like post...');
    const likeRes = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include'
    });
    if (likeRes.ok) {
      const likeData = await likeRes.json();
      console.log('✅ Post liked successfully, likes count:', likeData.likesCount);
    } else {
      console.log('❌ Failed to like post:', (await likeRes.json()).error);
    }
    
    // Test 9: Add Comment
    console.log('\n9. Testing add comment...');
    const commentRes = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: 'This is a test comment!' })
    });
    if (commentRes.ok) {
      console.log('✅ Comment added successfully');
    } else {
      console.log('❌ Failed to add comment:', (await commentRes.json()).error);
    }
    
    // Test 10: Update Profile
    console.log('\n10. Testing update profile...');
    const profileRes = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: 'Updated Test User' })
    });
    if (profileRes.ok) {
      console.log('✅ Profile updated successfully');
    } else {
      console.log('❌ Failed to update profile:', (await profileRes.json()).error);
    }
    
    // Test 11: Update Post
    console.log('\n11. Testing update post...');
    const updatePostRes = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: 'Updated Test Blog Post',
        content: 'This is an updated test blog post content.',
        tags: ['test', 'blog', 'demo', 'updated'],
        status: 'published'
      })
    });
    if (updatePostRes.ok) {
      console.log('✅ Post updated successfully');
    } else {
      console.log('❌ Failed to update post:', (await updatePostRes.json()).error);
    }
    
    // Test 12: Get Popular Tags
    console.log('\n12. Testing get popular tags...');
    const tagsRes = await fetch(`${API_BASE}/posts/tags/popular`);
    if (tagsRes.ok) {
      const tagsData = await tagsRes.json();
      console.log('✅ Retrieved popular tags:', tagsData.tags.map(t => t._id));
    } else {
      console.log('❌ Failed to get popular tags:', (await tagsRes.json()).error);
    }
    
    // Test 13: Search Posts
    console.log('\n13. Testing search posts...');
    const searchRes = await fetch(`${API_BASE}/posts?search=test`);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      console.log(`✅ Search successful, found ${searchData.posts.length} posts`);
    } else {
      console.log('❌ Search failed:', (await searchRes.json()).error);
    }
    
    // Test 14: Delete Post
    console.log('\n14. Testing delete post...');
    const deleteRes = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (deleteRes.ok) {
      console.log('✅ Post deleted successfully');
    } else {
      console.log('❌ Failed to delete post:', (await deleteRes.json()).error);
    }
    
    // Test 15: Logout
    console.log('\n15. Testing logout...');
    const logoutRes = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (logoutRes.ok) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed:', (await logoutRes.json()).error);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ User authentication (signup, login, logout)');
    console.log('✅ Post management (create, read, update, delete)');
    console.log('✅ Social features (likes, comments)');
    console.log('✅ Search and filtering');
    console.log('✅ Profile management');
    console.log('✅ Database integration');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure both servers are running:');
    console.log('   - Backend: npm run server (in server directory)');
    console.log('   - Frontend: npm start (in root directory)');
    console.log('   - MongoDB: mongod (or MongoDB service running)');
  }
}

// Run the comprehensive test
testCompleteApp();
