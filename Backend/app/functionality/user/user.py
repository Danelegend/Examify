

"""
Use Authentication and Authorization workflow

User logs in or signs in

We provide a refresh token and access token
Access token is JWT, refresh token is stored in database and compared against
Both are stored in user cache

On user logout, we remove refresh token from database and remove access token from user cache

When a user is not authenticated, we query cache for refresh token and send that if it exists
"""






