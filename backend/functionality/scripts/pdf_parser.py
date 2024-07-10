import pypdf

from typing import Dict, List

RESULT = {}
CURR_KEY = None

def parse_pdf(pdf_location: str) -> List[Dict]:
    """
    Given a file_location to a pdf, get all the questions inside of the pdf
    """
    questions = []

    with open(pdf_location, 'rb') as pdf:
        reader = pypdf.PdfReader(pdf, strict=False)

        for page in reader.pages:
            content = page.extract_text(visitor_text=_visitor_question)
            questions.append(content)

        pdf.close()

    return questions

def _visitor_question(text, cm, tm, fontDict, fontSize):
    if fontDict is None: return

    key = '/BaseFont'

    global CURR_KEY

    if key in fontDict:
        if 'Bold' in fontDict[key] or 'bold' in fontDict[key]:
            if text == '' or text == ' ' or text == ' \n':
                fontDict.update({
                    pypdf.generic.NameObject("/BaseFont"): pypdf.generic.NameObject("/Ariel")
                })
                _visitor_question(text, cm, tm, fontDict, fontSize)
                return 

            CURR_KEY = text
            
            if CURR_KEY in RESULT:
                RESULT[CURR_KEY].append("")
            else:
                RESULT[CURR_KEY] = [""]
        else:
            if CURR_KEY is not None:
                RESULT[CURR_KEY][-1] += text

def _parse_result(result):
    ret = []
    
    for key in result:
        arr = result[key]

        for item in arr:
            if len(item) > 0:
                ret.append((key, item))

    return ret

if __name__ == '__main__':
    file_loc = "/Users/dane/HSC-Exam-Web-App/ExamifyApp/backend/exams/Baulkham Hills-2022_Maths Extension 2_Trial Exam.pdf"
    questions = parse_pdf(file_loc)

    #for question in questions:
        #print(question)

    result = _parse_result(RESULT)

    for item in result:
        print("Next question")
        print(item)