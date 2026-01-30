# Animax - Anime Streaming Platform PRD

## 1. Application Overview
- **Name:** Animax
- **Type:** Anime Streaming Platform
- **Description:** A premium anime streaming application allowing users to browse, watch, and track their favorite anime series and movies. Features a modern, immersive UI with "Cyber/Luxury" aesthetics.

## 2. User Roles
| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Viewer** | Standard authenticated user | Watch content, Manage watchlist, Track history |
| **Guest** | Unauthenticated/Anonymous | Browse content, Watch limited content (optional) |
| **Admin** | Platform administrator | Manage content, Users, System settings |

## 3. Core Features
1.  **Authentication:** Email/Password Signup & Login, Guest Login.
2.  **Home Feed:** curated lists (Trending, New Releases), Hero banner.
3.  **Anime Details:** Rich metadata (synopsis, rating, genres), Episode list.
4.  **Video Player:** Custom video player interface for watching episodes.
5.  **Watchlist:** Add/Remove anime from personal list.
6.  **Watch History:** specific episodes marked as watched, resume progress.
7.  **Search & Discover:** Filter by genre, year, status.

## 4. Data Entities
| Entity | Fields |
|--------|--------|
| **User** | `uid`, `email`, `name`, `avatar`, `watchlist` (Array<AnimeID>), `history` (Array<AnimeID>) |
| **Anime** | `id`, `title`, `description`, `coverImage`, `bannerImage`, `rating`, `genres`, `episodes` (Array) |
| **Episode** | `id`, `title`, `thumbnail`, `duration`, `videoUrl` |

## 5. Security Considerations
- Users can only modify their own watchlist and history.
- Read-only access to Content content for all users.

## 6. AI Features (To Be Confirmed)
- **AI Recommendations:** Personalized anime suggestions based on history.
- **AI Search:** Natural language search for anime (e.g., "anime like Naruto but darker").
