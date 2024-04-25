from fastapi import APIRouter, status, HTTPException
from fastapi.responses import FileResponse

from functionality.logo.logo import get_logo_location, get_logos

from router.api_types.api_response import LogosResponse

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK, response_model=LogosResponse)
async def logos_get() -> LogosResponse:
    return LogosResponse(
        logos=get_logos()
    )

@router.get("/{logo_id}", status_code=status.HTTP_200_OK)
async def logo_get(logo_id: str) -> FileResponse:
    try:
        return FileResponse(get_logo_location(logo_id), media_type='image/png')
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Logo not found") from e