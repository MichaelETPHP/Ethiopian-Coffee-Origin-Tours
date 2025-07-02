// api/admin.js - Updated with better error handling and debugging
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

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
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Debug Panel -->
        <div id="debugPanel" class="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm hidden">
            <h4 class="font-bold mb-2">Debug Info:</h4>
            <div id="debugContent"></div>
            <button onclick="toggleDebug()" class="mt-2 px-2 py-1 bg-red-600 rounded text-xs">Close</button>
        </div>

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
                
                <!-- Debug Toggle -->
                <div class="mb-4 text-center">
                    <button onclick="toggleDebug()" class="text-xs text-gray-500 hover:text-gray-700">
                        🐛 Toggle Debug Info
                    </button>
                </div>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <div class="relative">
                            <input type="text" id="username" value="admin" class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter username" required>
                            <i data-lucide="user" class="w-5 h-5 text-gray-400 absolute left-3 top-3.5"></i>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div class="relative">
                            <input type="password" id="password" value="secure_admin_password_123" class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter password" required>
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
                    <p>Demo Credentials (pre-filled):</p>
                    <p class="text-orange-600">admin / secure_admin_password_123</p>
                </div>

                <!-- API Test Buttons -->
                <div class="mt-6 space-y-2">
                    <button onclick="testAPI('/api/health')" class="w-full text-sm bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Test Health API
                    </button>
                    <button onclick="testAPI('/api/admin/login', 'POST')" class="w-full text-sm bg-green-500 text-white py-2 rounded hover:bg-green-600">
                        Test Login API
                    </button>
                </div>
            </div>
        </div>

        <!-- Dashboard -->
        <div id="dashboard" class="hidden min-h-screen p-8">
            <div class="max-w-6xl mx-auto">
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p class="text-gray-600">Welcome to your admin panel</p>
                    <button onclick="logout()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Sign Out
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                        <h3 class="text-lg font-semibold">Total Bookings</h3>
                        <p class="text-3xl font-bold" id="totalBookings">Loading...</p>
                    </div>
                    <div class="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                        <h3 class="text-lg font-semibold">Confirmed</h3>
                        <p class="text-3xl font-bold" id="confirmedBookings">Loading...</p>
                    </div>
                    <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                        <h3 class="text-lg font-semibold">Pending</h3>
                        <p class="text-3xl font-bold" id="pendingBookings">Loading...</p>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h2 class="text-xl font-semibold mb-4">Recent Bookings</h2>
                    <div id="bookingsTable">Loading bookings...</div>
                </div>
            </div>
        </div>

        <script>
            // Initialize icons
            lucide.createIcons();
            
            let authToken = localStorage.getItem('authToken');
            
            // Debug functions
            function toggleDebug() {
                const panel = document.getElementById('debugPanel');
                panel.classList.toggle('hidden');
            }

            function addDebugInfo(info) {
                const content = document.getElementById('debugContent');
                const time = new Date().toLocaleTimeString();
                content.innerHTML += \`<div class="mb-1">[\${time}] \${info}</div>\`;
            }

            // API Testing function
            async function testAPI(url, method = 'GET') {
                addDebugInfo(\`Testing \${method} \${url}\`);
                
                try {
                    const options = {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    };

                    if (method === 'POST' && url.includes('login')) {
                        options.body = JSON.stringify({
                            username: 'admin',
                            password: 'secure_admin_password_123'
                        });
                    }

                    if (authToken) {
                        options.headers.Authorization = \`Bearer \${authToken}\`;
                    }

                    addDebugInfo(\`Request: \${JSON.stringify(options)}\`);
                    
                    const response = await fetch(url, options);
                    const responseText = await response.text();
                    
                    addDebugInfo(\`Status: \${response.status}\`);
                    addDebugInfo(\`Response: \${responseText.substring(0, 200)}...\`);
                    
                    // Try to parse as JSON
                    try {
                        const jsonData = JSON.parse(responseText);
                        addDebugInfo(\`JSON: \${JSON.stringify(jsonData, null, 2)}\`);
                        
                        if (url.includes('login') && jsonData.token) {
                            addDebugInfo('✅ Login successful - token received');
                        }
                    } catch (e) {
                        addDebugInfo(\`❌ Not JSON: \${e.message}\`);
                    }
                    
                } catch (error) {
                    addDebugInfo(\`❌ Network error: \${error.message}\`);
                }
                
                // Show debug panel
                document.getElementById('debugPanel').classList.remove('hidden');
            }

            // Check if already logged in
            if (authToken) {
                addDebugInfo('Found existing token, attempting to load dashboard');
                showDashboard();
            } else {
                addDebugInfo('No token found, showing login screen');
            }

            // Login form handler
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const loginButton = e.target.querySelector('button[type="submit"]');
                const loginText = document.getElementById('loginText');
                const loginSpinner = document.getElementById('loginSpinner');
                
                addDebugInfo(\`Attempting login with username: \${username}\`);
                
                // Show loading
                loginButton.disabled = true;
                loginText.textContent = 'Signing In...';
                loginSpinner.classList.remove('hidden');
                
                try {
                    const loginUrl = '/api/admin/login';
                    addDebugInfo(\`Sending POST request to: \${loginUrl}\`);
                    
                    const response = await fetch(loginUrl, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ username, password }),
                    });
                    
                    addDebugInfo(\`Response status: \${response.status}\`);
                    addDebugInfo(\`Response headers: \${JSON.stringify([...response.headers])}\`);
                    
                    const responseText = await response.text();
                    addDebugInfo(\`Raw response: \${responseText.substring(0, 500)}\`);
                    
                    let data;
                    try {
                        data = JSON.parse(responseText);
                        addDebugInfo(\`Parsed JSON successfully\`);
                    } catch (parseError) {
                        addDebugInfo(\`❌ JSON parse error: \${parseError.message}\`);
                        throw new Error(\`Server returned invalid JSON. Response: \${responseText.substring(0, 100)}\`);
                    }
                    
                    if (response.ok) {
                        localStorage.setItem('authToken', data.token);
                        authToken = data.token;
                        addDebugInfo('✅ Login successful, token saved');
                        showMessage('Login successful!', 'success');
                        setTimeout(showDashboard, 1000);
                    } else {
                        addDebugInfo(\`❌ Login failed: \${data.error}\`);
                        showMessage(data.error || 'Login failed', 'error');
                    }
                } catch (error) {
                    addDebugInfo(\`❌ Login error: \${error.message}\`);
                    showMessage('Login failed: ' + error.message, 'error');
                } finally {
                    // Reset button
                    loginButton.disabled = false;
                    loginText.textContent = 'Sign In';
                    loginSpinner.classList.add('hidden');
                    
                    // Show debug panel
                    document.getElementById('debugPanel').classList.remove('hidden');
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
                addDebugInfo('Loading dashboard data...');
                
                try {
                    const response = await fetch('/api/admin/bookings', {
                        headers: { 
                            'Authorization': \`Bearer \${authToken}\`,
                            'Accept': 'application/json'
                        },
                    });
                    
                    addDebugInfo(\`Bookings API status: \${response.status}\`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        const bookings = data.bookings || [];
                        
                        addDebugInfo(\`Loaded \${bookings.length} bookings\`);
                        
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
                                                    <td class="px-4 py-2">\${booking.full_name || 'N/A'}</td>
                                                    <td class="px-4 py-2">\${booking.email || 'N/A'}</td>
                                                    <td class="px-4 py-2">\${booking.selected_package || 'N/A'}</td>
                                                    <td class="px-4 py-2">
                                                        <span class="px-2 py-1 text-xs rounded-full \${
                                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }">
                                                            \${booking.status || 'pending'}
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-2">\${booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}</td>
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            \`;
                        }
                    } else {
                        const errorText = await response.text();
                        addDebugInfo(\`❌ Bookings API error: \${errorText}\`);
                        document.getElementById('bookingsTable').innerHTML = '<p class="text-red-500">Failed to load bookings.</p>';
                    }
                } catch (error) {
                    addDebugInfo(\`❌ Dashboard error: \${error.message}\`);
                    document.getElementById('bookingsTable').innerHTML = '<p class="text-red-500">Error loading data.</p>';
                }
            }

            function logout() {
                localStorage.removeItem('authToken');
                addDebugInfo('Logged out, reloading page');
                location.reload();
            }

            // Initial debug info
            addDebugInfo('Admin dashboard loaded');
            addDebugInfo(\`Current URL: \${window.location.href}\`);
            addDebugInfo(\`Has token: \${!!authToken}\`);
        </script>
    </body>
    </html>
  `)
}
