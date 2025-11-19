-- *** 1. USER TABLE ***
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    profile VARCHAR(120),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Soft Delete Columns
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);

---

-- *** 2. BLOG TABLE ***
CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    title VARCHAR(90) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(100),
    slug TEXT UNIQUE,
    -- FIX: Foreign Key correctly references "user"
    author_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Soft Delete Columns
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);