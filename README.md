<h1 align="center">🏍️ MiniRider - Mini Bike Showcase & Marketplace</h1>

<p align="center">
  <strong>An engaging platform to showcase, discover, and manage mini motorbikes with user-friendly features and a sleek interface.</strong>
</p>

<p align="center">
  🔗 <a href="https://mini-moto.vercel.app/" target="_blank"><strong>Live Demo</strong></a>
</p>

<hr/>

<h2>🚀 Features</h2>

<ul>
  <li><strong>Authentication:</strong> Secure login system (JWT or Clerk integration)</li>
  <li><strong>Bike Showcase:</strong> Browse a curated list of mini motorbikes with images and details</li>
  <li><strong>Image Upload:</strong> Upload bike images with preview before submission</li>
  <li><strong>Add Products:</strong> Add new bikes with detailed form input</li>
  <li><strong>Supplier Integration:</strong> Manage and link suppliers for parts or bikes</li>
  <li><strong>Order Management:</strong> Users can browse suppliers and place orders</li>
  <li><strong>Admin Panel:</strong> Manage bike listings, orders, and users</li>
  <li><strong>Responsive UI:</strong> Tailwind-powered clean and mobile-friendly interface</li>
</ul>

<hr/>

<h2>🛠️ Tech Stack</h2>

<ul>
  <li><strong>Frontend:</strong> Next.js (App Router) + Tailwind CSS</li>
  <li><strong>Backend:</strong> Node.js + Express</li>
  <li><strong>Database:</strong> PostgreSQL (Supabase or external DB)</li>
  <li><strong>ORM:</strong> Prisma</li>
  <li><strong>Authentication:</strong> JWT tokens + Cookies (js-cookie)</li>
  <li><strong>Image Handling:</strong> Multer for uploads, served from Express</li>
  <li><strong>Deployment:</strong> Vercel (Frontend), AWS Lightsail or other for backend</li>
</ul>

<hr/>

<h2>📂 Project Structure</h2>

<pre>
/frontend
  ├── app
  ├── components
  ├── pages
  ├── public
  └── styles

/backend
  ├── routes
  ├── controllers
  ├── prisma
  ├── middleware
  └── server.js

.env.example
README.md
</pre>

<hr/>

<h2>📦 Setup Instructions</h2>

<h3>1. Clone the Repository</h3>

<pre>
git clone https://github.com/your-username/minirider.git
cd minirider
</pre>

<h3>2. Install Dependencies</h3>

<pre>
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
</pre>

<h3>3. Environment Setup</h3>

<pre>
cp .env.example .env
# Update the variables like DB URL, JWT secret, etc.
</pre>

<h3>4. Start Development</h3>

<pre>
# Frontend
npm run dev

# Backend
npm run start
</pre>

<hr/>

<h2>📸 Sample Preview</h2>

<p>
Add GIF or screenshots of your UI here (optional). Want help creating preview banners or videos? Just ask!
</p>

<hr/>

<h2>🧠 Inspiration</h2>
<p>
MiniRider is inspired by the rising community of mini bike enthusiasts. It offers a streamlined experience for exploring, managing, and connecting with mini bike suppliers.
</p>

<hr/>

<h2>🤝 Contributing</h2>

<p>
Contributions are welcome! Fork, raise issues, or submit pull requests to make MiniRider better.
</p>

<hr/>

<h2>📝 License</h2>

<p>This project is licensed under the MIT License.</p>
