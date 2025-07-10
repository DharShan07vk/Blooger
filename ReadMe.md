## 📝 Blooger – A Minimal Blog Platform

> Blooger is a simple blogging platform that allows users to create, edit, and share blog posts. The project is designed for learning and demonstration purposes.
> A clean and responsive blog application built using **Express.js**, **EJS**, and **MongoDB** that allows users to register, log in, create and manage blogs, and leave comments with profile pictures.

---

### 📸 Features

✅ User registration and login
✅ Profile picture upload
✅ Create, edit, and delete blogs
✅ Commenting system with user avatars
✅ Blog search using title
✅ Slug-based routing for individual blog posts
✅ Flash messages for UX feedback
✅ Clean, mobile-responsive UI

---

### 🛠 Tech Stack

| Technology               | Purpose                    |
| ------------------------ | -------------------------- |
| **Node.js & Express.js** | Backend server and routing |
| **MongoDB + Mongoose**   | Database and schema design |
| **EJS**                  | Templating engine          |
| **Multer**               | Handling image uploads     |
| **Express-Session**      | Session-based user login   |
| **Flash Messages**       | UX feedback on actions     |
| **Vanilla CSS**          | Styling and responsiveness |

---

### 🚀 Getting Started

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/DharShan07vk/Blooger.git
cd blooger
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Setup Environment Variables

Create a `.env` file in the root and add:

```env
MongoDB_Connection_String=your_mongo_uri
Session_Secret=any_random_string
```

#### 4️⃣ Run the App

```bash
node app.js
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---
### Live App 

Visit 👉 https://bloogit.vercel.app/
### 📂 Folder Structure

```
blooger/
├── public/
│   ├── static/            # CSS, fonts, favicon
│   └── uploads/           # (Optional) if you use disk storage
├── views/
│   ├── partials/          # header, footer
│   ├── *.ejs              # pages: home, blog, post, login, etc.
├── app.js                 # Main app logic
├── config.js              # MongoDB models & connection
├── .env                   # Environment variables
└── package.json
```

---

### 📷 How Profile Pictures Work

* Profile images are uploaded using `multer` into MongoDB as `Buffer`.
* On login or profile load, they are converted to base64 and stored in `req.session.profilePic`.
* This base64 image is shown as the avatar in the comments section.

---


### ✨ Improvements You Can Add

* ✅ Like button with AJAX
* ✅ Rich text editor for blog content
* ✅ Pagination or infinite scroll
* ✅ Social login (Google, GitHub)
* ✅ REST API support
* ✅ Markdown blog support

---

### 📄 License

This project is open-source and free to use under the [MIT License](LICENSE).

---

### 🙌 Credits

Built with ❤️ using Node.js, MongoDB, and lots of caffeine ☕.

---


