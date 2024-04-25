from database.helpers.user import check_user_email_exists

def user_exists_with_email(email: str) -> bool:
    """
    Check if a user exists with a given email
    """

    return check_user_email_exists(email)
