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
    def MapPrefixToName(cls, prefix: str):
        PREFIX_TO_NAME_MAPPING = {
            "TRI" : "Trial Exam",
            "HSC" : "HSC Exam",
            "TOP" : "Topic Test",
            "HAE" : "Half Yearly Exam",
            "T_1" : "Term 1 Exam",
            "T_2" : "Term 2 Exam",
            "T_3" : "Term 3 Exam",
            "T_4" : "Term 4 Exam"
        }
        
        return PREFIX_TO_NAME_MAPPING.get(prefix, prefix)
    
    @classmethod
    def MapNameToPrefix(cls, name: str):
        NAME_TO_PREFIX_MAPPING = {
            "Trial Exam": "TRI",
            "HSC Exam": "HSC",
            "Topic Test": "TOP",
            "Half Yearly Exam": "HAE",
            "Term 1 Exam": "T_1",
            "Term 2 Exam": "T_2",
            "Term 3 Exam": "T_3",
            "Term 4 Exam": "T_4"
        }

        return NAME_TO_PREFIX_MAPPING.get(name, name)

    
class UserType(Enum):
    REGULAR = "REG"
    PREMIUM = "PRE"
    ADMIN = "ADM"

    @classmethod
    def Choices(cls):
        return tuple((i.value, i.name) for i in cls)
    

class SubjectType(Enum):
    MATHS_EXTENSION_2 = "Maths Extension 2"
    MATHS_EXTENSION_1 = "Maths Extension 1"
    PHYSICS = "Physics"
    CHEMISTRY = "Chemistry"
    BIOLOGY = "Biology"
    ECONOMICS = "Economics"
    BUSINESS = "Business"
    MATHS_ADVANCED = "Maths Advanced"
    MATHS_STANDARD_2 = "Maths Standard 2"

    @classmethod
    def Choices(cls):
        return tuple((i.value, i.name) for i in cls)
    
    @classmethod
    def MapPrefixToName(cls, prefix: str):
        PREFIX_TO_NAME_MAPPING = {
            "Maths Extension 2": "MX2",
            "Maths Extension 1": "MX1",
            "Physics": "PHY",
            "Chemistry": "CHEM",
            "Biology": "BIO",
            "Economics": "ECO",
            "Business": "BUS",
            "Maths Advanced": "MA",
            "Maths Standard 2": "MS2"
        }
        
        return PREFIX_TO_NAME_MAPPING.get(prefix, prefix)
