# Dwitter
Twitter Clone Project

Insert your MONGODB credentials in models/connect.js or pass them using environment variables (e.g. env.sh)

Functionality: 
  1. Sign up and Login built with Passport.js
  2. Fields in the form validation using express-validator middleware
  3. Tweeting and displaying all users' tweets in the Feed chronologically
  4. Displaying specific user's profile with tweets created solely by him/her
  5. Liking tweets
  6. Following users
  7. Chat function built with Socket.IO (currently real-time chat for all users through one socket and one room, but person-to-person functionality in progress)
  8. Frontend built with Handlebars and Bootstrap
