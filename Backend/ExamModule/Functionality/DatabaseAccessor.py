from .FilterConfig import FilterConfig
from ExamModule.exam_types import ExamType

from ExamModule.models import Exam

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

        queryset = self.MapExamType(queryset)

        return queryset
    
    def GetExam(self, exam_id: int):
        try:
            return Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return None

    def MapExamType(self, queryset):
        for item in queryset:
            item.exam_type = ExamType.MapPrefixToName(item.exam_type)

        return queryset
    
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
    