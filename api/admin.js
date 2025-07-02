// api/admin.js
export default function handler(req, res) {
  // Set content type to HTML
  res.setHeader('Content-Type', 'text/html')

  // Return the admin dashboard HTML
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ethiopian Coffee Tours - Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; }
            .booking-card { transition: all 0.3s ease; }
            .booking-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .sidebar-item { transition: all 0.2s ease; }
            .sidebar-item:hover { background: rgba(249, 115, 22, 0.1); color: #ea580c; }
            .sidebar-item.active { background: #ea580c; color: white; }
            .stats-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .stats-card-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
            .stats-card-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
            .stats-card-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Login Screen -->
        <div id="loginScreen" class="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="coffee" class="w-8 h-8 text-white"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800">Ethiopian Coffee Tours</h1>
                    <p class="text-gray-600">Admin Dashboard</p>
                </div>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <div class="relative">
                            <input type="text" id="username" class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter username" required>
                            <i data-lucide="user" class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"></i>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="password" class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter password" required>
                            <i data-lucide="lock" class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"></i>
                        </div>
                    </div>
                    
                    <button type="submit" class="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition duration-200 flex items-center justify-center">
                        <span id="loginText">Sign In</span>
                        <div id="loginSpinner" class="hidden ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    </button>
                </form>
                
                <div id="loginMessage" class="mt-4 p-3 rounded hidden"></div>
                
                <div class="mt-6 text-center text-sm text-gray-600">
                    <p>Demo Credentials:</p>
                    <p class="text-orange-600">admin / secure_admin_password_123</p>
                </div>
            </div>
        </div>

        <!-- Dashboard (hidden initially) -->
        <div id="dashboard" class="hidden min-h-screen">
            <div class="p-8 bg-white">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-blue-100 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-blue-800">Total Bookings</h3>
                        <p class="text-2xl font-bold text-blue-900" id="totalBookings">Loading...</p>
                    </div>
                    <div class="bg-green-100 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-green-800">Confirmed</h3>
                        <p class="text-2xl font-bold text-green-900" id="confirmedBookings">Loading...</p>
                    </div>
                    <div class="bg-yellow-100 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-yellow-800">Pending</h3>
                        <p class="text-2xl font-bold text-yellow-900" id="pendingBookings">Loading...</p>
                    </div>
                </div>
                
                <div class="mt-8 bg-white border rounded-lg p-6">
                    <h2 class="text-xl font-semibold mb-4">Recent Bookings</h2>
                    <div id="bookingsTable">Loading bookings...</div>
                </div>
                
                <button onclick="logout()" class="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Sign Out
                </button>
            </div>
        </div>

        <script>
            // Initialize icons
            lucide.createIcons();
            
            let authToken = localStorage.getItem('authToken');
            
            // Check if already logged in
            if (authToken) {
                showDashboard();
            }

            // Login form handler
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const loginButton = e.target.querySelector('button[type="submit"]');
                const loginText = document.getElementById('loginText');
                const loginSpinner = document.getElementById('loginSpinner');
                
                // Show loading
                loginButton.disabled = true;
                loginText.textContent = 'Signing In...';
                loginSpinner.classList.remove('hidden');
                
                try {
                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        localStorage.setItem('authToken', data.token);
                        authToken = data.token;
                        showMessage('Login successful!', 'success');
                        setTimeout(showDashboard, 1000);
                    } else {
                        showMessage(data.error || 'Login failed', 'error');
                    }
                } catch (error) {
                    showMessage('Login failed: ' + error.message, 'error');
                } finally {
                    // Reset button
                    loginButton.disabled = false;
                    loginText.textContent = 'Sign In';
                    loginSpinner.classList.add('hidden');
                }
            });

            function showMessage(message, type) {
                const messageDiv = document.getElementById('loginMessage');
                messageDiv.textContent = message;
                messageDiv.className = \`mt-4 p-3 rounded \${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`;
                messageDiv.classList.remove('hidden');
                
                setTimeout(() => messageDiv.classList.add('hidden'), 5000);
            }

            function showDashboard() {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('dashboard').classList.remove('hidden');
                loadDashboardData();
            }

            async function loadDashboardData() {
                try {
                    const response = await fetch('/api/admin/bookings', {
                        headers: { 'Authorization': \`Bearer \${authToken}\` },
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const bookings = data.bookings;
                        
                        // Update stats
                        document.getElementById('totalBookings').textContent = bookings.length;
                        document.getElementById('confirmedBookings').textContent = bookings.filter(b => b.status === 'confirmed').length;
                        document.getElementById('pendingBookings').textContent = bookings.filter(b => b.status === 'pending').length;
                        
                        // Show recent bookings
                        const bookingsTable = document.getElementById('bookingsTable');
                        if (bookings.length === 0) {
                            bookingsTable.innerHTML = '<p class="text-gray-500">No bookings found.</p>';
                        } else {
                            bookingsTable.innerHTML = \`
                                <div class="overflow-x-auto">
                                    <table class="min-w-full">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-4 py-2 text-left">Name</th>
                                                <th class="px-4 py-2 text-left">Email</th>
                                                <th class="px-4 py-2 text-left">Package</th>
                                                <th class="px-4 py-2 text-left">Status</th>
                                                <th class="px-4 py-2 text-left">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200">
                                            \${bookings.slice(0, 10).map(booking => \`
                                                <tr>
                                                    <td class="px-4 py-2">\${booking.full_name}</td>
                                                    <td class="px-4 py-2">\${booking.email}</td>
                                                    <td class="px-4 py-2">\${booking.selected_package}</td>
                                                    <td class="px-4 py-2">
                                                        <span class="px-2 py-1 text-xs rounded-full \${
                                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }">
                                                            \${booking.status}
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-2">\${new Date(booking.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            \`;
                        }
                    } else {
                        document.getElementById('bookingsTable').innerHTML = '<p class="text-red-500">Failed to load bookings.</p>';
                    }
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                    document.getElementById('bookingsTable').innerHTML = '<p class="text-red-500">Error loading data.</p>';
                }
            }

            function logout() {
                localStorage.removeItem('authToken');
                location.reload();
            }
        </script>
    </body>
    </html>
  `)
}
