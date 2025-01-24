# YouTube Clone API Documentation

This document provides an overview of the available APIs for user registration, login, profile management, subscription management, video management, and comment management in the YouTube Clone application.

## Table of Contents
- [User  APIs](#user-apis)
  - [Register User API](#register-user-api)
  - [User  Login API](#user-login-api)
  - [Get User Profile API](#get-user-profile-api)
  - [User  Logout API](#user-logout-api)
  - [Subscribe to Channel/User API](#subscribe-to-channeluser-api)
  - [Unsubscribe from Channel/User API](#unsubscribe-from-channeluser-api)
  - [Watch History API](#watch-history-api)
  - [Get User Watch History API](#get-user-watch-history-api)
  - [Remove Watch History API](#remove-watch-history-api)
- [Video APIs](#video-apis)
  - [Upload Video API](#upload-video-api)
  - [Update Video API](#update-video-api)
  - [Delete Video API](#delete-video-api)
  - [Like Video API](#like-video-api)
  - [Dislike Video API](#dislike-video-api)
  - [Views of Video API](#views-of-video-api)
  - [Get All Videos API](#get-all-videos-api)
  - [Get Video by ID API](#get-video-by-id-api)
  - [Get Suggestions Video API](#get-suggestions-video-api)
- [Comment APIs](#comment-apis)
  - [New Comment API](#new-comment-api)
  - [Get All Comments on Video API](#get-all-comments-on-video-api)
  - [Update Comment API](#update-comment-api)
  - [Delete Comment API](#delete-comment-api)

---

## User APIs

### Register User API
- **Endpoint:** `POST http://localhost:8888/api/user/register`
- **Purpose:** Allows new users to register by providing their details.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/register' \
    --form 'logo=@"/C:/Users/intel/Downloads/std1.jpg"' \
    --form 'email="kp@gmail.com"' \
    --form 'password="123"' \
    --form 'channelName="kp"' \
    --form 'phone="123"' \
    --form 'userName="kp"'
    ```

### User Login API
- **Endpoint:** `POST http://localhost:8888/api/user/login`
- **Purpose:** Authenticates users and provides a token for subsequent requests.
- **Request Body:**
    ```json
    {
        "email": "sf@gmail.com",
        "password": "123"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email": "sf@gmail.com",
        "password": "123"
    }'
    ```

### Get User Profile API
- **Endpoint:** `GET http://localhost:8888/api/user/profile`
- **Purpose:** Retrieves the profile information of the logged-in user.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/profile' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### User Logout API
- **Endpoint:** `GET http://localhost:8888/api/user/logout`
- **Purpose:** Logs out the user.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/logout'
    ```

### Subscribe to Channel/User API
- **Endpoint:** `PUT http://localhost:8888/api/user/subscribe/{userId}`
- **Purpose:** Subscribes the logged-in user to another user/channel.
- **CURL Example:**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/user/subscribe/USER_ID_HERE' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Unsubscribe from Channel/User API
- **Endpoint:** `PUT http://localhost:8888/api/user/unsubscribe/{userId}`
- **Purpose:** Unsubscribes the logged-in user from another user/channel.
- **CURL Example:**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/user/unsubscribe/USER_ID_HERE' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Watch History API
- **Endpoint:** `POST http://localhost:8888/api/user/watch-history`
- **Purpose:** Adds a video to the user's watch history.
- **Request Body:**
    ```json
    {
        "videoId": "678782cd8dfe032b5a31fcbb"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/watch-history' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --data '{
        "videoId": "678782cd8dfe032b5a31fcbb"
    }'
    ```

### Get User Watch History API
- **Endpoint:** `GET http://localhost:8888/api/user/watch-history`
- **Purpose:** Retrieves the watch history of the logged-in user.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/watch-history' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Remove Watch History API
- **Endpoint:** `POST http://localhost:8888/api/user/clear-watch-history`
- **Purpose:** Removes a video from the user's watch history.
- **Request Body:**
    ```json
    {
        "videoId": "678782cd8dfe032b5a31fcbb"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/user/clear-watch-history' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --data '{
        "videoId": "678782cd8dfe032b5a31fcbb"
    }'
    ```

## Video APIs

### Upload Video API
- **Endpoint:** `POST http://localhost:8888/api/video/upload`
- **Purpose:** Allows users to upload a new video.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/video/upload' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --form 'title="mern video"' \
    --form 'description="mern url shortener"' \
    --form 'category="development"' \
    --form 'tags="mern,mern"' \
    --form 'thumbnail=@"/C:/Users/intel/Downloads/javascript-image.png"' \
    --form 'video=@"/C:/Users/intel/Downloads/demo-video.mp4"'
    ```

### Update Video API
- **Endpoint:** `PUT http://localhost:8888/api/video/update/{videoId}`
- **Purpose:** Updates the details of an existing video.
- **CURL Example (with file):**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/video/update/6786b73d2279bb64ddcae017' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --form 'thumbnail=@"/C:/Users/intel/Downloads/power-platform.png"'
    ```
- **CURL Example (without file):**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/video/update/6786b73d2279bb64ddcae017' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --form 'title="power platform tutorial"' \
    --form 'tags="powerapps, sharepoint, power bi, azure"'
    ```

### Delete Video API
- **Endpoint:** `DELETE http://localhost:8888/api/video/delete/{videoId}`
- **Purpose:** Deletes a video from the platform.
- **CURL Example:**
    ```bash
    curl --location --request DELETE 'http://localhost:8888/api/video/delete/67877c072179fa3e22754393' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Like Video API
- **Endpoint:** `PUT http://localhost:8888/api/video/like/{videoId}`
- **Purpose:** Likes a specific video.
- **CURL Example:**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/video/like/678782e78dfe032b5a31fcbe' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Dislike Video API
- **Endpoint:** `PUT http://localhost:8888/api/video/dislike/{videoId}`
- **Purpose:** Dislikes a specific video.
- **CURL Example:**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/video/dislike/678782e78dfe032b5a31fcbe' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Views of Video API
- **Endpoint:** `PUT http://localhost:8888/api/video/views/{videoId}`
- **Purpose:** Increments the view count of a specific video.
- **CURL Example:**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/video/views/678782cd8dfe032b5a31fcbb'
    ```

### Get All Videos API
- **Endpoint:** `GET http://localhost:8888/api/video/videos`
- **Purpose:** Retrieves a list of all videos.
- **CURL Example: ```bash
    curl --location 'http://localhost:8888/api/video/videos'
    ```

### Get Video by ID API
- **Endpoint:** `GET http://localhost:8888/api/video/video/{videoId}`
- **Purpose:** Retrieves details of a specific video by its ID.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/video/video/678782cd8dfe032b5a31fcbb'
    ```

### Get Suggestions Video API
- **Endpoint:** `GET http://localhost:8888/api/video/video/{videoId}/suggestions`
- **Purpose:** Retrieves suggested videos based on a specific video.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/video/video/678782cd8dfe032b5a31fcbb/suggestions'
    ```

## Comment APIs

### New Comment API
- **Endpoint:** `POST http://localhost:8888/api/comment/new-comment/{videoId}`
- **Purpose:** Allows users to add a new comment to a video.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/comment/new-comment/678782e78dfe032b5a31fcbe' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --data '{
        "commentText" : "Nice video of nodejs series"
    }'
    ```

### Get All Comments on Video API
- **Endpoint:** `GET http://localhost:8888/api/comment/comments/{videoId}`
- **Purpose:** Retrieves all comments for a specific video.
- **CURL Example:**
    ```bash
    curl --location 'http://localhost:8888/api/comment/comments/678782e78dfe032b5a31fcbe' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Update Comment API
- **Endpoint:** `PUT http://localhost:8888/api/comment/update/{commentId}`
- **Purpose:** Updates an existing comment.
- **CURL Example:**
    ```bash
    curl --location --request PUT 'http://localhost:8888/api/comment/update/678b56e83d568b4b3c520d0a' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --data '{
        "commentText" : "modified"
    }'
    ```

### Delete Comment API
- **Endpoint:** `DELETE http://localhost:8888/api/comment/delete/{commentId}`
- **Purpose:** Deletes a specific comment.
- **CURL Example:**
    ```bash
    curl --location --request DELETE 'http://localhost:8888/api/comment/delete/678b56e83d568b4b3c520d0a' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

## Conclusion
This README provides a comprehensive overview of the YouTube Clone API endpoints available for user management, video management, and comment management. For further details or updates, please refer to the repository or contact the development team.