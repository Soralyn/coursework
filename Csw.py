import wx
import wx.grid
import sqlite3
from wx.adv import CalendarCtrl

conn = sqlite3.connect("school_performance.db")
cursor = conn.cursor()

# Создание таблиц, если их нет
cursor.execute('''
CREATE TABLE IF NOT EXISTS Students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    class_id INTEGER,
    phone TEXT
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Subjects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Grades (
    id INTEGER PRIMARY KEY,
    student_id INTEGER,
    subject_id INTEGER,
    grade INTEGER,
    date TEXT,
    FOREIGN KEY (student_id) REFERENCES Students(id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(id)
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Groups (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
)''')

conn.commit()

class SchoolApp(wx.Frame):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.SetTitle("Успеваемость студентов")
        self.SetSize(900, 600)
        self.SetBackgroundColour("#f4f4f4")

        notebook = wx.Notebook(self)
        notebook.SetBackgroundColour("#e8f0fe")

        self.students_panel = wx.Panel(notebook)
        self.subjects_panel = wx.Panel(notebook)
        self.grades_panel = wx.Panel(notebook)

        notebook.AddPage(self.students_panel, "Учащиеся")
        notebook.AddPage(self.subjects_panel, "Предметы")
        notebook.AddPage(self.grades_panel, "Оценки")

        self.init_students_panel()
        self.init_subjects_panel()
        self.init_grades_panel()
        
    def update_student_combobox(self):
        """Обновляет список студентов в комбобоксе"""
        cursor.execute("SELECT id, name FROM Students")
        students = [f"{row[0]} - {row[1]}" for row in cursor.fetchall()]
        self.grade_student.SetItems(students)

    def update_subject_combobox(self):
        """Обновляет список предметов в комбобоксе"""
        cursor.execute("SELECT id, name FROM Subjects")
        subjects = [f"{row[0]} - {row[1]}" for row in cursor.fetchall()]
        self.grade_subject.SetItems(subjects)

    def init_students_panel(self):
        panel = self.students_panel
        sizer = wx.BoxSizer(wx.VERTICAL)

        grid_sizer = wx.FlexGridSizer(3, 2, 10, 10)
        grid_sizer.Add(wx.StaticText(panel, label="Имя Студента:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.student_name = wx.TextCtrl(panel)
        grid_sizer.Add(self.student_name, 1, wx.EXPAND)

        grid_sizer.Add(wx.StaticText(panel, label="Группа:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.student_class = wx.TextCtrl(panel)
        grid_sizer.Add(self.student_class, 1, wx.EXPAND)

        grid_sizer.Add(wx.StaticText(panel, label="Телефон:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.student_phone = wx.TextCtrl(panel)
        grid_sizer.Add(self.student_phone, 1, wx.EXPAND)
        
        sizer.Add(grid_sizer, 0, wx.ALL | wx.EXPAND, 10)

        add_button = wx.Button(panel, label="Добавить Студента")
        add_button.Bind(wx.EVT_BUTTON, self.add_student)
        sizer.Add(add_button, 0, wx.ALL | wx.ALIGN_CENTER, 10)

        self.students_grid = wx.grid.Grid(panel)
        self.students_grid.CreateGrid(0, 3)
        self.students_grid.SetColLabelValue(0, "Имя")
        self.students_grid.SetColLabelValue(1, "Группа")
        self.students_grid.SetColLabelValue(2, "Телефон")
        self.students_grid.AutoSizeColumns()
        sizer.Add(self.students_grid, 1, wx.ALL | wx.EXPAND, 10)

        panel.SetSizer(sizer)
        self.view_students()

    def init_subjects_panel(self):
        panel = self.subjects_panel
        sizer = wx.BoxSizer(wx.VERTICAL)

        grid_sizer = wx.BoxSizer(wx.HORIZONTAL)
        grid_sizer.Add(wx.StaticText(panel, label="Название предмета:"), 0, wx.ALIGN_CENTER_VERTICAL | wx.RIGHT, 10)
        self.subject_name = wx.TextCtrl(panel)
        grid_sizer.Add(self.subject_name, 1, wx.EXPAND)

        sizer.Add(grid_sizer, 0, wx.ALL | wx.EXPAND, 10)

        add_button = wx.Button(panel, label="Добавить предмет")
        add_button.Bind(wx.EVT_BUTTON, self.add_subject)
        sizer.Add(add_button, 0, wx.ALL | wx.ALIGN_CENTER, 10)

        self.subjects_grid = wx.grid.Grid(panel)
        self.subjects_grid.CreateGrid(0, 1)
        self.subjects_grid.SetColLabelValue(0, "Название")
        self.subjects_grid.AutoSizeColumns()
        sizer.Add(self.subjects_grid, 1, wx.ALL | wx.EXPAND, 10)

        panel.SetSizer(sizer)
        self.view_subjects()

    def init_grades_panel(self):
        panel = self.grades_panel
        sizer = wx.BoxSizer(wx.VERTICAL)

        grid_sizer = wx.FlexGridSizer(4, 2, 10, 10)
        grid_sizer.Add(wx.StaticText(panel, label="Студент:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.grade_student = wx.ComboBox(panel, choices=[])
        grid_sizer.Add(self.grade_student, 1, wx.EXPAND)

        grid_sizer.Add(wx.StaticText(panel, label="Предмет:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.grade_subject = wx.ComboBox(panel, choices=[])
        grid_sizer.Add(self.grade_subject, 1, wx.EXPAND)

        grid_sizer.Add(wx.StaticText(panel, label="Оценка:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.grade_value = wx.ComboBox(panel, choices=["2", "3", "4", "5"])
        grid_sizer.Add(self.grade_value, 1, wx.EXPAND)

        grid_sizer.Add(wx.StaticText(panel, label="Дата:"), 0, wx.ALIGN_CENTER_VERTICAL)
        self.grade_date = CalendarCtrl(panel)
        grid_sizer.Add(self.grade_date, 1, wx.EXPAND)

        sizer.Add(grid_sizer, 0, wx.ALL | wx.EXPAND, 10)

        add_button = wx.Button(panel, label="Добавить оценку")
        add_button.Bind(wx.EVT_BUTTON, self.add_grade)
        sizer.Add(add_button, 0, wx.ALL | wx.ALIGN_CENTER, 10)

        self.grades_grid = wx.grid.Grid(panel)
        self.grades_grid.CreateGrid(0, 4)
        self.grades_grid.SetColLabelValue(0, "Студент")
        self.grades_grid.SetColLabelValue(1, "Предмет")
        self.grades_grid.SetColLabelValue(2, "Оценка")
        self.grades_grid.SetColLabelValue(3, "Дата")
        self.grades_grid.AutoSizeColumns()
        sizer.Add(self.grades_grid, 1, wx.ALL | wx.EXPAND, 10)

        panel.SetSizer(sizer)
        self.view_grades()

    def add_student(self, event):
        name = self.student_name.GetValue()
        class_id = self.student_class.GetValue()
        phone = self.student_phone.GetValue()
        if name and class_id:
            # проверка групп
            cursor.execute("SELECT id FROM Groups WHERE id = ?", (class_id,))
            group = cursor.fetchone()
            if not group:
                cursor.execute("INSERT INTO Groups (id, name) VALUES (?, ?)", (class_id, f"Group {class_id}"))
            #должно добавлять студентв
            cursor.execute("INSERT INTO Students (name, class_id, phone) VALUES (?, ?, ?)", (name, class_id, phone))
            conn.commit()
            self.view_students()
            self.update_student_combobox()  # Обновляем список учеников
            wx.MessageBox("Студент и группа добавлены!", "Успех", wx.OK | wx.ICON_INFORMATION)
        else:
            wx.MessageBox("Заполните обязательные поля", "Ошибка", wx.OK | wx.ICON_WARNING)

    def add_subject(self, event):
        name = self.subject_name.GetValue()
        if name:
            cursor.execute("INSERT INTO Subjects (name) VALUES (?)", (name,))
            conn.commit()
            self.view_subjects()
            self.update_subject_combobox()  # обновления предметов
            wx.MessageBox("Предмет добавлен!", "Успех", wx.OK | wx.ICON_INFORMATION)
        else:
            wx.MessageBox("Введите название предмета", "Ошибка", wx.OK | wx.ICON_WARNING)

    def add_grade(self, event):
        student = self.grade_student.GetValue().split(" - ")[0]
        subject = self.grade_subject.GetValue().split(" - ")[0]
        grade = self.grade_value.GetValue()
        date = self.grade_date.GetDate().FormatISODate()
        if student and subject and grade:
            cursor.execute("INSERT INTO Grades (student_id, subject_id, grade, date) VALUES (?, ?, ?, ?)",
                           (student, subject, grade, date))
            conn.commit()
            self.view_grades()
        else:
            wx.MessageBox("Заполните все поля", "Ошибка", wx.OK | wx.ICON_WARNING)

    def view_students(self):
        self.students_grid.ClearGrid()
        cursor.execute("SELECT name, class_id, phone FROM Students")
        for i, row in enumerate(cursor.fetchall()):
            if self.students_grid.GetNumberRows() <= i:
                self.students_grid.AppendRows(1)
            for j, value in enumerate(row):
                self.students_grid.SetCellValue(i, j, str(value))

    def view_subjects(self):
        self.subjects_grid.ClearGrid()
        cursor.execute("SELECT name FROM Subjects")
        for i, row in enumerate(cursor.fetchall()):
            if self.subjects_grid.GetNumberRows() <= i:
                self.subjects_grid.AppendRows(1)
            self.subjects_grid.SetCellValue(i, 0, row[0])

    def view_grades(self):
        self.grades_grid.ClearGrid()
        cursor.execute("""
            SELECT Students.name, Subjects.name, Grades.grade, Grades.date
            FROM Grades
            JOIN Students ON Grades.student_id = Students.id
            JOIN Subjects ON Grades.subject_id = Subjects.id
        """)
        for i, row in enumerate(cursor.fetchall()):
            if self.grades_grid.GetNumberRows() <= i:
                self.grades_grid.AppendRows(1)
            for j, value in enumerate(row):
                self.grades_grid.SetCellValue(i, j, str(value))


app = wx.App(False)
frame = SchoolApp(None)
frame.Show()
app.MainLoop()
conn.close()
