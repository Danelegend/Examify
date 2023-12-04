from enum import Enum


class ExamType(Enum):
    TRIAL_EXAM = "TRI"
    HSC_EXAM = "HSC"
    TOPIC_TEST = "TOP"
    HALF_YEARLY_EXAM = "HAF"
    TERM_1_EXAM = "T_1"
    TERM_2_EXAM = "T_2"
    TERM_3_EXAM = "T_3"
    TERM_4_EXAM = "T_4"

    @classmethod
    def Choices(cls):
        return tuple((i.value, i.name) for i in cls)

    @classmethod
    def MapPrefixToName(cls, prefix):
        PREFIX_TO_NAME_MAPPING = {
            "TRI" : "Trial Exam",
            "HSC" : "HSC Exam",
            "TOP" : "Topic Test",
            "HAF" : "Half Yearly Exam",
            "T_1" : "Term 1 Exam",
            "T_2" : "Term 2 Exam",
            "T_3" : "Term 3 Exam",
            "T_4" : "Term 4 Exam"
        }

        return PREFIX_TO_NAME_MAPPING[prefix]