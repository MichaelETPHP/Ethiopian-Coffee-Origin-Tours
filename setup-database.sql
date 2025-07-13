-- Setup Database Tables for Ethiopian Coffee Origin Tours
-- Database: tour_booking_system
-- Run this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    booking_type VARCHAR(20) CHECK (booking_type IN ('individual', 'group')) NOT NULL,
    number_of_people INTEGER DEFAULT 1,
    selected_package VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager')) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Create update trigger for bookings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- Note: This password hash is for 'admin123' - you should change it after first login
INSERT INTO admin_users (username, email, password_hash, role) 
VALUES (
    'admin', 
    'admin@ethiopiancoffee.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', 
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings table
CREATE POLICY "Allow all operations for authenticated users" ON bookings
    FOR ALL USING (true);

-- Create policies for admin_users table
CREATE POLICY "Allow all operations for authenticated users" ON admin_users
    FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON TABLE bookings TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE admin_users TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE bookings_id_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE admin_users_id_seq TO anon, authenticated;

-- Insert some sample bookings for testing
INSERT INTO bookings (full_name, age, email, phone, country, booking_type, number_of_people, selected_package, status) VALUES
('John Smith', 35, 'john@example.com', '+1234567890', 'USA', 'individual', 1, 'Yirgacheffe Coffee Tour', 'pending'),
('Maria Garcia', 28, 'maria@example.com', '+1234567891', 'Spain', 'group', 4, 'Sidamo Coffee Experience', 'confirmed'),
('Ahmed Hassan', 42, 'ahmed@example.com', '+1234567892', 'Egypt', 'individual', 1, 'Limu Coffee Journey', 'pending'),
('Sarah Johnson', 31, 'sarah@example.com', '+1234567893', 'Canada', 'group', 2, 'Harar Coffee Adventure', 'confirmed');

-- Display the created tables
SELECT 'Bookings table created successfully' as message;
SELECT COUNT(*) as total_bookings FROM bookings;

SELECT 'Admin users table created successfully' as message;
SELECT username, email, role FROM admin_users; 