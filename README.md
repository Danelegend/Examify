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