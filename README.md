 FriendsGram
FriendsGram is a full-stack social media application built with the MERN stack, allowing users to connect, share posts, and chat in real time.

🚀 Features
✅ Email/password authentication (Login & Register)

👤 Profile editing with bio and follower/following lists

📸 Upload and display text, image, and video posts

🔍 User search by name or email

💬 Real-time messaging (1-on-1 chat)

🔄 Responsive UI built with Tailwind CSS

🛠️ Tech Stack
Frontend:

React

React Router

Tailwind CSS

Context API for authentication

Backend:

Node.js

Express.js

MongoDB & Mongoose

JWT for secure authentication

🖼️ Screenshots
(You can upload and embed screenshots later for Login, Profile, Chat, etc.)

📂 Folder Structure
bash
Copy
Edit
friendsgram/
│
├── backend/        # Express server & API routes
│
├── frontend/       # React client
│
└── README.md
⚙️ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/yourusername/friendsgram.git
cd friendsgram
2. Set Up the Backend
bash
Copy
Edit
cd backend
npm install
Create a .env file inside backend/:

ini
Copy
Edit
PORT=4000
MongoDBURI=mongodb://localhost:27017/friendsgram
JWT_SECRET=your_secret_key
Then run:

bash
Copy
Edit
npm start
3. Set Up the Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm start
4. Access the App
Go to http://localhost:3000 in your browser.

🤝 Contributing
Pull requests are welcome! If you’d like to suggest improvements, feel free to fork and contribute.

📬 Contact
Made with ❤️ by Ayush Kesherwani
GitHub: @Ayush-Kesherwani
