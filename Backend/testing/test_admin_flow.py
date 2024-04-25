import os
import pytest

from testing.util import register, admin_get_current_exams, admin_get_review_exams, \
    admin_submit_review_exam, admin_upload_exam

@pytest.fixture(scope="function")
def register_admin():
    # Signup
    res = register("Dane", "Urban", "danelegend13@gmail.com", "ThisIsAGoodPassword123@")

    return res["access_token"]

@pytest.fixture(scope="function", autouse=True)
def clean_current_exams():
    # Clean the current exams directory
    for file in os.listdir(os.environ["CURRENT_EXAMS_DIRECTORY"]):
        os.remove(os.path.join(os.environ["CURRENT_EXAMS_DIRECTORY"], file))

class TestAdminFlow:
    def test_admin_get_current_exams(self, register_admin):
        token = register_admin

        current_exams_resp_1 = admin_get_current_exams(token)

        assert current_exams_resp_1["exams"] == []

    def test_admin_flow_from_review_to_current(self, register_admin):
        # Start by uploading an exam
        admin_upload_exam(open("testing\\test.pdf", "rb"), 
                          "Test School", "Trial", 2021, "Test Subject")

        # Register the admin
        token = register_admin

        # Check exams in review
        get_review_exams_1 = admin_get_review_exams(token)

        assert get_review_exams_1["exams"] == ["Test School-2021_Test Subject_Trial.pdf"]

        # Check that there are currently no exams in the exams database
        get_current_exams_1 = admin_get_current_exams(token)

        assert get_current_exams_1["exams"] == []

        # Check test_current_exams folder is empty
        assert len(os.listdir(os.environ["CURRENT_EXAMS_DIRECTORY"])) == 0

        # Submit the exam
        admin_submit_review_exam(token, "Test School", "TRI", 2022, "Chemistry", "Test School-2021_Test Subject_Trial.pdf")

        # Check that the exam is now in the current exams
        get_current_exams_2 = admin_get_current_exams(token)
  
        assert len(get_current_exams_2["exams"]) == 1

        # Check that the exam is no longer in the review exams
        get_review_exams_2 = admin_get_review_exams(token)

        assert get_review_exams_2["exams"] == []

        # Check exam in current exams folder
        assert len(os.listdir(os.environ["CURRENT_EXAMS_DIRECTORY"])) == 1
