import os

if __name__ == '__main__':
    path = 'D:\\Examify\\Examify\\Backend\\app\\review_exams\\Girraween 2018 4U HY & Solutions.pdf'
    print(os.listdir('D:\\Examify\\Examify\\Backend\\app\\review_exams'))
    print(os.path.isfile(path))