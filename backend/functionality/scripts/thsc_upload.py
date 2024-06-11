import json
import os

import urllib.request

from typing import List
from pydantic import BaseModel

import logger

from functionality.admin.admin import GetCurrentExams, InsertExam

class DataItem(BaseModel):
    school: str
    subject: str
    year: int
    code: int
    link: str

CODES = {
    2666: (0, "Engineering Studies"),
    2668: (0, "Engineering Studies"),
    1818: (0, "Chemistry"),
    2468: (0, "Economics"),
    2466: (0, "Economics"),
    4118: (0, "IPT"),
    2418: (0, "Earth & Environmental Science"),
    1816: (0, "Chemistry"),
    5096: (0, "Maths"),
    7508: (0, "Science"),
    6526: (0, "Physics"),
    6521: (0, "Physics"),
    6523: (0, "Physics"),
    6528: (12, "Physics"),
    5236: (0, "Maths"),
    5231: (0, "Maths"),
    5232: (0, "Maths"),
    7528: (12, "Senior Science"),
    7428: (12, "Society & Culture"),
    5106: (0, "Maths"),
    5108: (0, "Maths"),
    7478: (12, "Software"),
    7728: (12, "Studies of Religion 2"),
    5278: (0, "Maths"),
    8678: (12, "Visual Arts"),
    5226: (0, "Maths"),
    5221: (0, "Maths"),
    5222: (0, "Maths"),
    5238: (0, "Maths"),
    5228: (0, "Maths"),
    7718: (12, "Studies of Religion 1"),
    1368: (0, "Biology"),
    5218: (0, "Maths"),
    1366: (0, "Biology"),
    5018: (0, "Legal Studies"),
    5276: (0, "Maths"),
    5518: (0, "Modern History"),
    5098: (0, "Maths"),
    6516: (0, "Physics"),
    6518: (0, "Physics"),
    1568: (0, "Business Studies"),
    6428: (12, "PDHPE"),
    5528: (12, "Modern History"),
    2676: (0, "Engineering Studies"),
    5028: (12, "Legal Studies"),
    2738: (12, "English Ext 1"),
    2678: (12, "Engineering Studies"),
    2476: (0, "Economics"),
    2478: (12, "Economics"),
    2716: (0, "English"),
    2428: (12, "Earth & Environmental Science"),
    2728: (12, "English Advanced"),
    2727: (12, "English Standard"),
    2718: (0, "English"),
    1578: (12, "Business Studies"),
    1576: (0, "Business Studies"),
    1826: (0, "Chemistry"),
    1821: (0, "Chemistry"),
    1823: (0, "Chemistry"),
    1828: (12, "Chemistry"),
    5336: (0, "Maths"),
    5331: (0, "Maths"),
    5332: (0, "Maths"),
    5333: (0, "Maths"),
    5334: (0, "Maths"),
    5346: (0, "Maths"),
    5341: (0, "Maths"),
    5342: (0, "Maths"),
    5343: (0, "Maths"),
    5344: (0, "Maths"),
    5316: (0, "Maths"),
    5313: (0, "Maths"),
    5326: (0, "Maths"),
    5321: (0, "Maths"),
    5322: (0, "Maths"),
    5323: (0, "Maths"),
    5324: (0, "Maths"),
    5348: (12, "Maths Extension 2"),
    5338: (12, "Maths Extension 1"),
    5318: (12, "Maths Standard"),
    5328: (12, "Maths Advanced"),
    4128: (12, "IPT"),
    5405: (0, "Maths"),
    4126: (0, "IPT"),
    4643: (0, "LOTE"),
    4644: (0, "LOTE"),
    1376: (0, "Biology"),
    1378: (12, "Biology"),
    1076: (0, "Agriculture"),
    1078: (12, "Agriculture"),
    1178: (12, "Ancient History"),
}

def _load_dataitems(loc: str) -> List[DataItem]:
    f = open(loc, 'r')

    data = json.loads(f.read())

    items = []
    
    for x in data['data']:
        item=DataItem(
            school=x['school'],
            subject=x['subject'],
            year=int(x['year']),
            code=int(x['code']),
            link=x['link']
        )
        items.append(item)
    return items

def _download_file(link: str, file_name: str):
    loc = os.environ["CURRENT_EXAMS_DIRECTORY"]

    download_path = os.path.join(loc, file_name)

    url = link.replace(" ", "%20")

    logger.Logger.log_backend("THSC Uploader", f"Downloading to {download_path} from {url}")

    urllib.request.urlretrieve(url, download_path)

    logger.Logger.log_backend("THSC Uploader", "Download Complete!")

def _upload_item(item: DataItem):
    logger.Logger.log_backend("THSC Uploader", f"Uploading exam {item.school} {item.year} {item.subject}")

    file_name = f"{item.school}-{item.year}_{item.subject}_Trial Exam.pdf"

    _download_file(item.link, file_name)

    InsertExam(
        item.school,
        "Trial Exam",
        item.year,
        item.subject,
        file_name
    )

    logger.Logger.log_backend("THSC Uploader", "Upload complete")


def steal_thsc():
    items = _load_dataitems("data/links.json")

    items = filter(lambda item: CODES[item.code][0] == 12, items)
    items = map(lambda item: DataItem(
        school=item.school,
        subject=CODES[item.code][1],
        year=item.year,
        code=item.code,
        link=item.link
    ), items)



    current_exams = GetCurrentExams()

    new_items = []

    for item in items: 
        flag = True

        for exam in current_exams:
            if exam.school == item.school and exam.year == item.year and exam.subject == item.subject:
                flag = False
        
        if flag:
            new_items.append(item)

    items = new_items

    for item in items:
        _upload_item(item)
    


if __name__ == '__main__':
    steal_thsc()