from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///school_performance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    class_id = db.Column(db.Integer, nullable=True)
    phone = db.Column(db.String(50), nullable=True)

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(10), nullable=False)

# Эндпоинты для студентов
@app.route('/students', methods=['GET', 'POST'])
def students():
    if request.method == 'GET':
        students = Student.query.all()
        return jsonify([{'id': s.id, 'name': s.name, 'class_id': s.class_id, 'phone': s.phone} for s in students])
    elif request.method == 'POST':
        data = request.json
        student = Student(name=data['name'], class_id=data['class_id'], phone=data['phone'])
        db.session.add(student)
        db.session.commit()
        return jsonify({'message': 'Student added'}), 201

@app.route('/students/<int:id>', methods=['DELETE', 'PUT'])
def modify_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({'message': 'Student not found'}), 404

    if request.method == 'DELETE':
        db.session.delete(student)
        db.session.commit()
        return jsonify({'message': 'Student deleted'}), 200

    elif request.method == 'PUT':
        data = request.json
        student.name = data.get('name', student.name)
        student.class_id = data.get('class_id', student.class_id)
        student.phone = data.get('phone', student.phone)
        db.session.commit()
        return jsonify({'message': 'Student updated'}), 200

# Эндпоинты для предметов
@app.route('/subjects', methods=['GET', 'POST'])
def subjects():
    if request.method == 'GET':
        subjects = Subject.query.all()
        return jsonify([{'id': s.id, 'name': s.name} for s in subjects])
    elif request.method == 'POST':
        data = request.json
        subject = Subject(name=data['name'])
        db.session.add(subject)
        db.session.commit()
        return jsonify({'message': 'Subject added'}), 201

@app.route('/subjects/<int:id>', methods=['DELETE', 'PUT'])
def modify_subject(id):
    subject = Subject.query.get(id)
    if not subject:
        return jsonify({'message': 'Subject not found'}), 404

    if request.method == 'DELETE':
        db.session.delete(subject)
        db.session.commit()
        return jsonify({'message': 'Subject deleted'}), 200

    elif request.method == 'PUT':
        data = request.json
        subject.name = data.get('name', subject.name)
        db.session.commit()
        return jsonify({'message': 'Subject updated'}), 200

# Эндпоинты для оценок
@app.route('/grades', methods=['GET', 'POST'])
def grades():
    if request.method == 'GET':
        grades = db.session.query(
            Grade.id,
            Student.name.label('student_name'),
            Subject.name.label('subject_name'),
            Grade.grade,
            Grade.date
        ).join(Student, Grade.student_id == Student.id)\
         .join(Subject, Grade.subject_id == Subject.id)\
         .all()
        return jsonify([
            {
                'id': grade.id,
                'student_name': grade.student_name,
                'subject_name': grade.subject_name,
                'grade': grade.grade,
                'date': grade.date
            }
            for grade in grades
        ])
    elif request.method == 'POST':
        data = request.json
        grade = Grade(
            student_id=data['student_id'],
            subject_id=data['subject_id'],
            grade=data['grade'],
            date=data['date']
        )
        db.session.add(grade)
        db.session.commit()
        return jsonify({'message': 'Grade added'}), 201

@app.route('/grades/<int:id>', methods=['DELETE', 'PUT'])
def modify_grade(id):
    grade = Grade.query.get(id)
    if not grade:
        return jsonify({'message': 'Grade not found'}), 404

    if request.method == 'DELETE':
        db.session.delete(grade)
        db.session.commit()
        return jsonify({'message': 'Grade deleted'}), 200

    elif request.method == 'PUT':
        data = request.json
        grade.student_id = data.get('student_id', grade.student_id)
        grade.subject_id = data.get('subject_id', grade.subject_id)
        grade.grade = data.get('grade', grade.grade)
        grade.date = data.get('date', grade.date)
        db.session.commit()
        return jsonify({'message': 'Grade updated'}), 200

# Эндпоинт для экспорта оценок
@app.route('/export/grades', methods=['GET'])
def export_grades():
    grades = db.session.query(
        Grade.id,
        Student.name.label('student_name'),
        Subject.name.label('subject_name'),
        Grade.grade,
        Grade.date
    ).join(Student, Grade.student_id == Student.id)\
     .join(Subject, Grade.subject_id == Subject.id)\
     .all()

    data = [
        {
            'ID': grade.id,
            'Ученик': grade.student_name,
            'Предмет': grade.subject_name,
            'Оценка': grade.grade,
            'Дата': grade.date
        }
        for grade in grades
    ]
    df = pd.DataFrame(data)
    excel_file_path = 'grades_export.xlsx'
    df.to_excel(excel_file_path, index=False, engine='openpyxl')
    return send_file(excel_file_path, as_attachment=True)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
