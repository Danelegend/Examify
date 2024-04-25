import os

IMAGE_FOLDER = "D:\Examify\Examify\Backend\school_logos"


def get_logos() -> list[str]:
    """
    Get all logos in folder
    """

    return os.listdir("D:\Examify\Examify\Backend\school_logos")

def get_logo(logo: str):
    fileLoc = IMAGE_FOLDER + "\\" + logo

    if not os.path.isfile(fileLoc):
        raise Exception("File does not exist")

    return open(fileLoc, "rb")
