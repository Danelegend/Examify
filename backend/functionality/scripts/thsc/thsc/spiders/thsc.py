import re

import scrapy

PATTERN = r"(?P<school>[\w\s]+) (?P<year>\d{4})"
PATTERN2 = r"https://thsconline\.github\.io/s/[^/]+/(?P<subject>[^/]+)/[^/]+"

class THSCCrawler(scrapy.Spider):
    def __init__(self):
        if self.file is None:
            self.file = open("links.json", "+w")


    name = 'thsc'
    start_urls = ['https://thsconline.github.io/s']
    visited = {}
    file = None

    def parse(self, response):
        if response.request.url in self.visited or not response.request.url.startswith(self.start_urls[0]): return

        self.visited[response.request.url] = True

        for anchor in response.css("a"):
            href = anchor.css("::attr(href)").get()
            if href == '#v':
                inner_elements = anchor.css("*::text").getall()
                onClick = anchor.css("::attr(onclick)").get()
                code = self._extract_number_from_onClick(onClick)

                for element in inner_elements:
                    post_link = f"https://thsconline.github.io/s/d/{code}/{element}"

                    match = re.search(PATTERN2, response.request.url)
                    if match:
                        subject = match.group("subject").replace('%20', ' ')

                    match = re.search(PATTERN, element)
                    
                    if match:
                        school = match.group("school")
                        year = match.group("year")

                    self.file.write(
f"""
{{
    "school": "{school}",
    "subject": "{subject}",
    "year": {year},
    "code": {code},
    "link": "{post_link}"
}},""")
            else:
                post_link = response.urljoin(href)
                yield scrapy.Request(post_link, callback=self.parse)

    def _extract_number_from_onClick(self, onClick):
        # Use regular expression to extract the number from the onClick attribute
        match = re.search(r'pdf\(this, (\d+)\)', onClick)
        if match:
            return match.group(1)
        return None
    
