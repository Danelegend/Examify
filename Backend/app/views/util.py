def get_access_token(request) -> str:
    headers = request.META.get("headers", None)

    if headers is None: 
        return None

    tok = headers.get("Authorization", None)
    return tok.removeprefix("bearer ") if tok is not None else None
