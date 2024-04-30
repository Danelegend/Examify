import os

IMAGE_FOLDER = os.environ.get("SCHOOL_LOGO_DIRECTORY", "school_logos")


def get_logos() -> list[str]:
    """
    Get all logos in folder
    """
    return os.listdir(IMAGE_FOLDER)

def get_logo_location(logo: str):
    fileLoc = os.path.join(IMAGE_FOLDER, logo)

    if not os.path.isfile(fileLoc):
        raise Exception("File does not exist")

    return fileLoc
