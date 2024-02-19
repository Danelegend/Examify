from ExamModule.exam_types import ExamType
from Security.security import FileLocationAccessible
from ExamModule.Functionality.DatabaseAccessor import DatabaseAccessor
from ExamModule.Functionality.FilterConfig import FilterConfig

from django.core import serializers

import json

URL = "http://localhost:8080"


def GetExams(filterConfig: FilterConfig, sortType="DEFAULT"):
    """
    Given a criteria in filter config, get all the exams that
    match such criteria and return sorted as per the sort type
    """
    queryset = DatabaseAccessor().GetExams(filterConfig, sortType)

    data = serializers.serialize('json', queryset, fields=('id', 'school_name', 'exam_type', 'year'))

    return data

def GetExam(exam_id: int):
    """
    Given an id for an exam, get the details regarding it

    Parameters:
        exam_id: The id for the exam we want to search about
    
    Return:
        json serialized document with following keys:
         - id
         - school_name
         - type
         - year
         - exam_link

    Errors:
        Returns None if no record is found with the given exam_id
    """
    record = DatabaseAccessor().GetExam(exam_id)

    if record is None:
        return None

    file_location = record.file_location
    exam_link = URL + "/api/exam/exampdf?location=" + file_location

    data = {
        "id": record.id,
        "school_name": record.school_name,
        "exam_type": ExamType.MapPrefixToName(record.exam_type),
        "year": record.year,
        "exam_link": exam_link
    }

    return json.dumps(data)

def GetExamPdf(location: str):
    if not FileLocationAccessible(location):
        raise ValueError("Unaccessible location")
    
    return open(location, "rb")