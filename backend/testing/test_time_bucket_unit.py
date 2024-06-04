from datetime import datetime, timedelta

from functionality.user.analytics import _calculate_time_bucket

class TestTimeBucket:
    def test_today_with_period_7():
        today = datetime.now()
        period = 7

        result = _calculate_time_bucket(today, period)
        expected = today - timedelta(days=7)

        assert result == expected

    def test_today_with_period_4():
        today = datetime.now()
        period = 4

        result = _calculate_time_bucket(today, period)
        expected = today - timedelta(days=4)

        assert result == expected
    