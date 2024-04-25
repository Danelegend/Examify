from fastapi import APIRouter, status
from fastapi.responses import FileResponse

from app.functionality.logo.logo import get_logo, get_logos

from router.api_types.api_response import LogosResponse

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK, response_class=LogosResponse)
async def get_logos() -> LogosResponse:
    return LogosResponse(
        logos=get_logos()
    )

@router.get("/{logo_id}", status_code=status.HTTP_200_OK, response_class=FileResponse)
async def get_logo(logo_id: int) -> FileResponse:
    return FileResponse(get_logo(logo_id), media_type='image/png')