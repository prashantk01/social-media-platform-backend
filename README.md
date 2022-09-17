# social-media-platform-backend
  ## Back End Assignment - Full Time
  ### Problem Statement
  - Build APIs for a social media platform in either NodeJS or Python
  - The API should support features like getting a user profile, follow a user, upload a post, delete a post,  like a post, unlike a liked post, and comment on a post
  - Design the database schema and implement in PostgreSQL or MongoDB

  ### Techstack and packages Used
  - NodeJS, Express, MongoDB
  - jsonwebtoken, @sendgrid/mail, bcryptjs, validator, dotenv

  ### **API Endpoints**
  - GET: 

      - /api/user/

      - /api/user/authenticate
      
      - /api/posts/
      
      - /api/posts/:id
  
      - /test

  - POST:

      - /api/posts/
  
  - PUT:

      - /api/posts/like/:id

      - /api/posts/unlike/:id
      
      - /api/comment/:id
      
      - /api/user/follow/:id
      
      - /api/unfollow/:id
  
  - DELETE:

      - /api/posts/:id

  ### Steps to build and run this project at your setup
  - git clone <"project-link">
  - npm i
  - npm run dev


  ### Heroku deployed link for this project
  -  https://social-media-platform-backend.herokuapp.com/