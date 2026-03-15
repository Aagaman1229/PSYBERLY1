# Psyberly – Cybersecurity Blog

Psyberly is a modern **full-stack cybersecurity blog** built by two Nepali students passionate about ethical hacking, cryptography, and digital safety.

The platform is designed to **share knowledge, document learning, and grow the cybersecurity community in Nepal.**

---

## ✨ Features

* 🌗 **Light / Dark Theme** – Seamless theme switching with `localStorage`
* 📱 **Fully Responsive** – Mobile-first design with hamburger navigation
* 📝 **Articles** – Browse cybersecurity articles with rich content
* ♾️ **Infinite Scroll** – Articles load dynamically as you scroll
* 👤 **Author Popups** – Click an author to see their bio and social links
* ❤️ **Like System** – Like/unlike posts and comments
* 👁️ **View Counter** – Views counted once per session
* 💬 **Anonymous Comments** – Anyone can comment on articles
* 🔎 **Search & Multi-Tag Filtering** – Search by title and filter by tags
* 🧑‍🤝‍🧑 **About Page** – Story-driven team introduction

---

## 🛠️ Tech Stack

| Technology      | Purpose                                         |
| --------------- | ----------------------------------------------- |
| **Next.js 15**  | React framework (App Router, server components) |
| **Supabase**    | PostgreSQL database + API                       |
| **React**       | UI framework                                    |
| **CSS Modules** | Scoped styling                                  |
| **React Icons** | Icon library                                    |
| **Vercel**      | Deployment platform                             |

---

## 📦 Database Schema

### Authors Table

| Column       | Type      | Description     |
| ------------ | --------- | --------------- |
| id           | UUID      | Primary key     |
| name         | TEXT      | Author name     |
| slug         | TEXT      | URL slug        |
| bio          | TEXT      | Short biography |
| avatar_url   | TEXT      | Profile image   |
| social_links | JSONB     | Social links    |
| created_at   | TIMESTAMP | Created date    |

---

### Posts Table

| Column         | Type      | Description        |
| -------------- | --------- | ------------------ |
| id             | UUID      | Primary key        |
| title          | TEXT      | Article title      |
| description    | TEXT      | Article excerpt    |
| content        | TEXT      | HTML content       |
| tags           | TEXT[]    | Array of tags      |
| cover_image    | TEXT      | Cover image        |
| views          | INTEGER   | View count         |
| likes          | INTEGER   | Like count         |
| comments_count | INTEGER   | Comment count      |
| created_at     | TIMESTAMP | Created date       |
| updated_at     | TIMESTAMP | Updated date       |
| author_id      | UUID      | References authors |

---

### Comments Table

| Column     | Type      | Description     |
| ---------- | --------- | --------------- |
| id         | UUID      | Primary key     |
| post_id    | UUID      | References post |
| content    | TEXT      | Comment text    |
| likes      | INTEGER   | Like count      |
| created_at | TIMESTAMP | Created date    |

---

## ⚙️ Database RPC Functions

Used to safely update counts.

* `increment_post_views(post_id UUID)`
* `increment_post_likes(post_id UUID)`
* `decrement_post_likes(post_id UUID)`
* `increment_comment_likes(comment_id UUID)`
* `decrement_comment_likes(comment_id UUID)`

---

# 🚀 Getting Started

## 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/psyberly.git
cd psyberly
```

---

## 2️⃣ Install dependencies

```bash
npm install
```

---

## 3️⃣ Setup environment variables

Create a file:

```
.env.local
```

Add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 4️⃣ Setup the database

Run SQL scripts inside the Supabase SQL editor:

```
/supabase/schema.sql
```

This will create:

* tables
* triggers
* RPC functions

Then seed initial data using:

```
/supabase/seed.sql
```

---

## 5️⃣ Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🏗️ Build for Production

```bash
npm run build
npm start
```

---

# 📁 Project Structure

```
psyberly
│
├── app
│   ├── about
│   ├── articles
│   │   └── [slug]
│   └── layout.js
│
├── components
│   ├── ArticleCard.js
│   ├── CommentSection.js
│   ├── Navbar.js
│   ├── ThemeToggle.js
│   └── ...
│
├── lib
│   └── supabase.js
│
├── public
│   └── assets
│
├── styles
│   ├── globals.css
│   ├── ArticleCard.css
│   └── Home.css
│
└── README.md
```

---

# 👥 Team

### Aagaman K.C.

Cybersecurity Student
LinkedIn

### Anurag Acharya

Cybersecurity Student
LinkedIn

We are cybersecurity students in Nepal passionate about building a **safer digital ecosystem**. Psyberly is our platform to share knowledge and learn together.

---

# 🤝 Contributing

Contributions are welcome!

If you want to:

* write an article
* fix bugs
* suggest features

Please **open an issue or submit a pull request.**

For major changes, discuss them first.

---

# 🇳🇵 Built with ❤️ in Nepal
