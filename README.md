# Examify
Repository for the examify codebase

Features:
 - View all exams
 - Filter Exams (year, type, topics, difficulty)
 - Sortby (recently added, exam_date, difficulty)
 - Favourite

Users can complete exams so they know if they have already done it

Navbar:
Not Logged In:
 - Exams | Login | Register
Logged In: 
 - Exams | Todo | History (List of completed exams) | Logout


Endpoints (prefix: /api)

 - exam/exams: parameters: next_load, load_size, filter_config, sort_method -> Returns: List of Minimal Exam Information
 - exam/exam: paramter: exam_id -> Returns: 


MVP:
- View list of exams
- View individual exam
- Favourite exam
- Get recently viewed exams
- Authentication
- Brief Analytics
- Filter


 BACKEND Endpoints:
  - /auth 
  - /user
  - /exam
  - /exams

  - /auth/register [POST]
  - /auth/login [POST]
  - /auth/logout [DELETE]
  - /auth/refresh [GET]

  - /user/profile [GET]

  - /exams/ [POST]
  - /exams/favourites [GET]
  - /exams/recents [GET]

  - /exam/:school/:year/:type [GET]
  - /exam/pdf/:exam_id [GET]
  - /exam/:exam_id/favourite [POST, DELETE]
  - /exam/:exam_id/recent [POST]

  # Analytics
  FREE:
   - PI chart of completed exams by subject (/api/user/analytics/subject)
   - Activity tracking of exams over the week (/api/user/analytics/activity)
  PAID:
   - Tailored exam recommendations based on topics (/)
   - PI chart analysis of concepts (/api/user/analytics/concept)