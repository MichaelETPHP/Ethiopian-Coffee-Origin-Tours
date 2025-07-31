# 🌍 Ethiopian Coffee Origin Tours

A modern, responsive website showcasing authentic coffee tourism experiences in Ethiopia. This project connects travelers with the rich cultural heritage and traditional coffee farming communities of Ethiopia's coffee regions.

## ✨ Features

- **Interactive Tour Packages**: Browse curated coffee tour experiences
- **Authentic Itineraries**: Detailed day-by-day travel plans
- **Booking System**: Easy online reservation system
- **Responsive Design**: Optimized for all devices
- **Modern UI/UX**: Beautiful, intuitive interface
- **Cultural Immersion**: Focus on local communities and traditions

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Database**: Google Sheets (No database setup required!)
- **Authentication**: JWT with bcrypt
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React & React Icons
- **Deployment**: Ready for Vercel/Netlify

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MichaelETPHP/Ethiopian-Coffee-Origin-Tours.git
   cd Ethiopian-Coffee-Origin-Tours
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Set up Google Sheets** (Required for booking functionality)

   ```bash
   # Copy the environment template
   cp sheets.env.example .env

   # Follow the setup guide
   # See GOOGLE_SHEETS_SETUP.md for detailed instructions
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
├── api/                # API endpoints
│   ├── admin/         # Admin API routes
│   │   ├── login.js   # Admin authentication
│   │   └── bookings.js # Booking management
│   ├── bookings.js    # Public booking API
│   └── health.js      # Health check endpoint
├── lib/               # Utility libraries
│   ├── auth.js        # Authentication utilities
│   ├── sheets.js      # Google Sheets integration
│   ├── email.js       # Email functionality
│   └── validation.js  # Input validation
├── server/            # Express server
│   └── index.js       # Server entry point
├── src/               # Frontend React app
│   ├── components/    # React components
│   ├── pages/         # Page components
│   │   └── AdminPage.tsx # Admin dashboard
│   └── main.tsx       # Application entry point
├── setup-sheets.js    # Google Sheets setup script
└── setup-admin.js     # Admin user setup script
```

## 🗄️ Google Sheets Integration

This project uses **Google Sheets as the database** instead of traditional databases. This approach offers several advantages:

### ✅ Benefits

- **No Database Setup**: No need to configure PostgreSQL, MySQL, or other databases
- **Easy Management**: View and edit bookings directly in Google Sheets
- **Automatic Backup**: Google Sheets automatically backs up your data
- **Collaboration**: Multiple team members can access and manage bookings
- **Export Options**: Easy to export data to CSV, Excel, or other formats
- **Real-time Updates**: Changes are reflected immediately across all devices

### 📋 Setup Required

1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a Service Account
4. Set up environment variables
5. Initialize the spreadsheet

**📖 See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for complete setup instructions.**

## 🎨 Key Components

The main landing page featuring:

- Hero section with compelling visuals
- Featured experiences
- Tour packages overview
- Testimonials from travelers

### TourPackages

Displays various coffee tour options with:

- Detailed descriptions
- Pricing information
- Duration and difficulty levels
- Booking functionality

### Booking System

Interactive booking modal with:

- Date selection
- Group size options
- Contact information
- Tour customization

## 🌱 Coffee Regions Featured

- **Yirgacheffe**: Known for bright, citrusy coffees
- **Sidamo**: Famous for full-bodied, wine-like flavors
- **Harrar**: Traditional dry-processed beans
- **Limu**: Balanced, medium-bodied profiles

## 🔐 Admin Dashboard

The application includes a secure admin dashboard for managing bookings and user data:

### Setup Instructions

1. **Set up environment variables**:

   ```bash
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Create admin user**:

   ```bash
   node setup-admin.js
   ```

3. **Access admin dashboard**:
   Navigate to `/admin` in your browser

4. **Default credentials**:

   - Username: `admin`
   - Password: `admin123`

   ⚠️ **Important**: Change the default password after first login!

### Admin Features

- **Authentication**: Secure login with JWT tokens
- **Booking Management**: View, filter, and update booking status
- **Statistics**: Real-time booking statistics
- **Search & Filters**: Advanced search and filtering capabilities
- **Responsive Design**: Works on all devices

## 🎯 Mission

Our mission is to connect travelers with the authentic stories behind Ethiopian coffee, fostering cultural exchange and supporting local coffee farming communities. We believe every cup of coffee has a story, and we're here to help you experience it firsthand.

## 🤝 Contributing

We welcome contributions! Please feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

For questions about tours or technical support:

- Email: info@ethiopiancoffeetours.com
- Website: [Ethiopian Coffee Origin Tours](https://ethiopiancoffeetours.com)

## 🙏 Acknowledgments

- Ethiopian coffee farmers and communities
- Local tour guides and experts
- Coffee enthusiasts worldwide
- Open source community

---

**Experience the birthplace of coffee with us! ☕🇪🇹**

_Built with ❤️ for coffee lovers and cultural explorers_
