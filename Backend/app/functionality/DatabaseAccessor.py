from app.models import Exam
from app.functionality.exams.FilterConfig import FilterConfig
from app.exam_types import ExamType


class DatabaseAccessor(object):
    """
    DatabaseAccessor is singleton
    We only want one instance of DatabaseAccessor to access the
    database, otherwise we risk conflicts

    Data instances returned as queryset
    """
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(DatabaseAccessor, cls).__new__(cls)
        return cls.instance
    
    def GetExams(self, filterConfig: FilterConfig, sortType):
        queryset = self.GetBaseExams()

        if filterConfig.HasYear():
            queryset = self.ApplyYearFilter(queryset, filterConfig.year)
        if filterConfig.HasType():
            queryset = self.ApplyTypeFilter(queryset, filterConfig.type)
        if filterConfig.HasTopic():
            queryset = self.ApplyTopicFilter(queryset, filterConfig.topic)

        return queryset
    
    def GetExam(self, exam_id: int):
        try:
            return Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return None
    
    def GetBaseExams(self):
        queryset = Exam.objects.all()

        return queryset

    def ApplyYearFilter(self, queryset, year):
        return queryset.filter(year=year)

    def ApplyTypeFilter(self, queryset, type):
        return queryset.filter(exam_type=type)

    # TODO: Complete on next migration
    def ApplyTopicFilter(self, queryset, topic):
        return queryset
    