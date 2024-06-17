import base64
import re
import json
import os
import requests

from typing import List

from functionality.admin.admin import GetCurrentExams

class DataItem:
    school: str
    subject: str
    year: int
    code: int
    link: str

    def __init__(self, school: str, subject: str, year: int, code: int, link: str) :
        self.school = school
        self.subject = subject
        self.year = year
        self.code = code
        self.link = link

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

def _download_file(link: str, file_name: str) -> bool:
    loc = os.environ["CURRENT_EXAMS_DIRECTORY"]

    download_path = os.path.join(loc, file_name)

    url = link.replace(" ", "%20")

    viewno = url.split("/s/d/")[1].split("/")[0]
    titlex = url.split("/s/d/")[1].split("/")[1]
    hashval = SHA256(viewno)

    data_link = "https://script.google.com/macros/s/AKfycbx69GPoJtf9sSevsUbWtPr46vpa01u4oNkHjFmkkWxmj62AZ0q-/exec?export=data&field="+titlex+"&base="+viewno+"&hash="+hashval

    print("THSC Uploader " + f"Downloading to {download_path} from {url}")

    try:
        data = requests.get(data_link)
        json = _parse_text(data.text)
    except:
        return False
    # Back convert google script link
    # Get the data and reproduce PDF

    if os.path.exists(download_path):
        return False

    """
    with open(download_path, 'wb') as pdf:
        pdf.write(base64.b64decode(json['data']))
        pdf.close()
    """

    print(json)

    print("THSC Uploader " + "Download Complete!")

    return True


def _parse_text(data: str):

    pattern = re.compile(r'downloadfile\((.*?)\)$')

    result = pattern.search(data).group(1)

    return json.loads(result)


def _upload_item(item: DataItem):
    print("THSC Uploader " + f"Uploading exam {item.school} {item.year} {item.subject}")

    file_name = f"{item.school}-{item.year}_{item.subject}_Trial Exam.pdf"

    res = _download_file(item.link, file_name)

    if not res: return

    """
    InsertExam(
        item.school,
        "Trial Exam",
        item.year,
        item.subject,
        file_name
    )
    """

    print("THSC Uploader" + "Upload complete")


def steal_thsc():
    print("Starting")
    
    items = _load_dataitems("./functionality/scripts/data/links.json")

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

    _upload_item(items[0])

def SHA256(s):
    def bitshift(x):
        x &= 0xFFFF_FFFF
        if x > 0x7FFF_FFFF:
            x -= 0x1_0000_0000
        return int(x)
    
    def rshift(val, n): return val>>n if val >= 0 else (val+0x100000000)>>n

    def safe_add(x, y):
        lsw = (x & 0xFFFF) + (y & 0xFFFF)
        msw = bitshift(x >> 16) + bitshift(y >> 16) + bitshift(lsw >> 16)
        return bitshift(msw << 16) | (lsw & 0xFFFF)

    def S(X, n):
        return rshift(X, n) | bitshift(X << (32 - n))

    def R(X, n):
        return rshift(X, n)

    def Ch(x, y, z):
        return (x & y) ^ (~x & z)

    def Maj(x, y, z):
        return (x & y) ^ (x & z) ^ (y & z)

    def Sigma0256(x):
        return S(x, 2) ^ S(x, 13) ^ S(x, 22)

    def Sigma1256(x):
        return S(x, 6) ^ S(x, 11) ^ S(x, 25)

    def Gamma0256(x):
        return S(x, 7) ^ S(x, 18) ^ R(x, 3)

    def Gamma1256(x):
        return S(x, 17) ^ S(x, 19) ^ R(x, 10)

    def core_sha256(m, l):
        K = [
            0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
            0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
            0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967,
            0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
            0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
            0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
        ]

        HASH = [
            0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
        ]

        W = [0] * 64

        if bitshift(l >> 5) in m:
            m[bitshift(l >> 5)] |= bitshift(0x80 << (24 - l % 32))
        else:
            m[bitshift(l >> 5)] = 0 | bitshift(0x80 << (24 - l % 32))

        m[((l + 64 >> 9) << 4) + 15] = l

        for i in range(0, len(m), 16):
            a, b, c, d, e, f, g, h = HASH

            for j in range(64):
                if j < 16:
                    W[j] = m.get(j + i, 0)
                else:
                    W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16])

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j])
                T2 = safe_add(Sigma0256(a), Maj(a, b, c))

                h = g
                g = f
                f = e
                e = safe_add(d, T1)
                d = c
                c = b
                b = a
                a = safe_add(T1, T2)

            HASH = [
                safe_add(a, HASH[0]), safe_add(b, HASH[1]), safe_add(c, HASH[2]), safe_add(d, HASH[3]),
                safe_add(e, HASH[4]), safe_add(f, HASH[5]), safe_add(g, HASH[6]), safe_add(h, HASH[7])
            ]

        return HASH

    def str2binb(s):
        bin = {}
        mask = (1 << 8) - 1
        for i in range(0, len(s) * 8, 8):
            if bitshift(i >> 5) in bin: 
                bin[bitshift(i >> 5)] |= bitshift((s[i // 8] & mask) << (24 - i % 32))
            else: 
                bin[bitshift(i >> 5)] = 0 | bitshift((s[i // 8] & mask) << (24 - i % 32))

        return bin

    def Utf8Encode(string):
        return string.encode('utf-8')

    def binb2hex(binarray):
        hex_tab = "0123456789abcdef"
        str = ""
        for i in range(len(binarray) * 4):
            str += hex_tab[(binarray[bitshift(i >> 2)] >> ((3 - i % 4) * 8 + 4)) & 0xF] + hex_tab[(bitshift(binarray[bitshift(i >> 2)] >> ((3 - i % 4) * 8))) & 0xF]
        return str

    s = Utf8Encode(s)

    return binb2hex(core_sha256(str2binb(s), len(s) * 8))
