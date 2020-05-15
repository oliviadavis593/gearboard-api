CREATE TYPE emoji_rating AS ENUM ('🎸', '🎸🎸', '🎸🎸🎸', '🎸🎸🎸🎸', '🎸🎸🎸🎸🎸');

CREATE TABLE gearboard_items (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    rating emoji_rating NOT NULL,
    gear_name TEXT NOT NULL,  
    features TEXT, 
    comments TEXT
);