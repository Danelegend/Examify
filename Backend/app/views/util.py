def get_access_token(request) -> str:
    tok = request.META.get("HTTP_AUTHORIZATION", None)
    return tok.removeprefix("bearer ") if tok is not None else None
