CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE vehicle_status AS ENUM ('IDLE', 'ACTIVE', 'OFFLINE');
CREATE TYPE trip_status AS ENUM ('EN_ROUTE', 'COMPLETED', 'CANCELLED');

CREATE TABLE vehicles (
    id VARCHAR(255) PRIMARY KEY,
    plate_number VARCHAR(255) UNIQUE NOT NULL,
    status vehicle_status DEFAULT 'OFFLINE',
    current_location GEOMETRY(Point, 4326),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(255) REFERENCES vehicles(id) ON DELETE SET NULL,
    status trip_status DEFAULT 'EN_ROUTE',
    pickup_location GEOMETRY(Point, 4326) NOT NULL,
    dropoff_location GEOMETRY(Point, 4326) NOT NULL,
    weather_condition VARCHAR(30) DEFAULT 'CLEAR',
    predicted_eta_seconds INT,
    actual_duration_seconds INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE 
);

CREATE INDEX idx_vehicles_location ON vehicles USING GIST (current_location);
CREATE INDEX idx_trips_pickup ON trips USING GIST (pickup_location); 