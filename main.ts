import inquirer from "inquirer";

class Course{
    constructor(private courseCode:string,
        private courseName:string,){}
            getCourseInfo() : string{
                return`${this.courseCode}-${this.courseName}`  
            }
}

class Student {
    private static studentCount:number = 0;
    private studendID : string;
    private name : string;
    private coursesEnrolled : Course[] = [];
    private balance :number = 0;

    constructor(name:string){
        Student.studentCount ++ ;
        this.studendID = this.generatestudendID();
        this.name = name;
    }
    private generatestudendID() : string{
        const uniqueID = (Math.floor(Math.random()*90000)+10000).toString();
        return`Student ${uniqueID}`
    }

    enroll(course:Course):void{
        this.coursesEnrolled.push(course);
        console.log(`${this.name} enrolled in ${course.getCourseInfo()}`);
    }
    viewBalance():void{
        console.log(`${this.name}'s balance: $ ${this.balance}`);
    }
    payTuitionFees(amount:number):void{
        if(amount > 0){
            this.balance += amount
            console.log(`${this.name} paid ${amount} towards tution fees.`);
            this.viewBalance()
        }else{
            console.log("Invalid Payment Amount")
        }
    }
    showStatus():void{
        console.log(`StudentID: ${this.studendID} `);
        console.log(`StudentName: ${this.name}`);
        console.log(`CourseEnrolled:`);
        this.coursesEnrolled.forEach((course,index) => {
            console.log(` ${index+1}.${course.getCourseInfo()}`);
        });
        this.viewBalance();
    }
    getStudentID():string{
        return this.studendID
    }
    getCoursesEnrolled():Course[]{
        return this.coursesEnrolled
    }
    getName():string{
        return this.name
    }
};
class StudentManagementSystem{
    private courses:Course[] = [
        new Course("GD101","graphicdesigning"),
        new Course("WD102","web designing"),
        new Course("PP103","Phython Programing"),
        new Course("fl104","FreeLancing"),
        new Course("DM105","DigitalMarkiting"),

    ];
    private student :Student[]=[]

    async addStudentInteractive():Promise<void>{
        const answer = await inquirer.prompt ([
        {
            type:"input",
            name:"name",
            message:"enter student name:"
        },
        {
            type:"list",
            name:"courseindex",
            message:"choose a course to enroll",
            choises:this.courses.map((courses,index) => `${index+1} . ${courses.getCourseInfo()}`),
        }
        ]);        
        const selectedCourseIndex = parseInt(answer.courseindex) - 1;
        const selectedCourse = this.courses[selectedCourseIndex];

        if (selectedCourse) {
            const student = new Student(answer.name);
            student.enroll(selectedCourse);
            student.showStatus();
            this.student.push(student);
          } else {
            console.log('Error: Selected course not found.');
          }
        }

        viewListOfStudents(): void {
          console.log('List of Enrolled Students:');
          this.student.forEach((student, index) => {
            console.log(`${index + 1}. ${student.getName()} - Student ID: ${student.getStudentID()}`);
          });
    }

    async viewStudentDetailsIntaractive(): Promise<void> {
        const {studentIndex} = await inquirer.prompt({
        type:"list",
        name:"studentIndex",
        message:"choose a student:",
        choices:this.student.map((student,index) => `${index + 1}. ${student.getName()}`),
        });

        const selectedStudent = this.student[studentIndex - 1];
        if(selectedStudent){
            selectedStudent.showStatus();
        } else {
            console.log("Error: Selected Student not Found.");
        }
    }
    async makePaymentIntaractive(): Promise<void> {
        const {studentIndex,amount} = await inquirer.prompt([{
        type:"list",
        name:"studentIndex",
        message:"choose a student:",
        choices:this.student.map((student,index) => `${index + 1}. ${student.getName()}`),
        },
        {
         type:"input",
         name:"amount",
         message:"Enter Payment Amount",
         validate:(value) => (value > 0 ? true :"invalid payment amount.")
        }
        ]);

        const selectedStudent = this.student[studentIndex - 1];

        if(selectedStudent){
            selectedStudent.payTuitionFees(Number(amount));
        } else {
            console.log("Error: Selected Student not Found.");
        }
    }

    async makePaymentInteractive(): Promise<void> {
        const { studentIndex, amount } = await inquirer.prompt([
          {
            type: 'list',
            name: 'studentIndex',
            message: 'Choose a student:',
            choices: this.student.map((student, index) => `${index + 1}. ${student.getName()}`),
          },
          {
            type: 'input',
            name: 'amount',
            message: 'Enter payment amount:',
            validate: (value) => (value > 0 ? true : 'Invalid payment amount.'),
          },
        ]);

        const selectedStudent = this.student[studentIndex - 1];

        if (selectedStudent) {
          selectedStudent.payTuitionFees(Number(amount));
        } else {
          console.log('Error: Selected student not found.');
        }
      }

      async removeCourseInteractive(): Promise<void> {
        const { studentIndex, courseIndex } = await inquirer.prompt([
          {
            type: 'list',
            name: 'studentIndex',
            message: 'Choose a student:',
            choices: this.student.map((student, index) => `${index + 1}. ${student.getName()}`),
          },
          {
            type: 'list',
            name: 'courseIndex',
            message: 'Choose a course to remove:',
            choices: (answers) => {
              const selectedStudent = this.student[answers.studentIndex - 1];
              return selectedStudent.getCoursesEnrolled().map((course, index) => `${index + 1}. ${course.getCourseInfo()}`);
            },
          },
        ]);
        
        const selectedStudent = this.student[studentIndex - 1];
        const removedCourse = selectedStudent.getCoursesEnrolled().splice(courseIndex - 1, 1);
        console.log(`${selectedStudent.getName()} removed course: ${removedCourse[0].getCourseInfo()}`);
        selectedStudent.showStatus();
      }
    }
      async  function main() {
        const system = new StudentManagementSystem();
        console.log('Welcome to the Student Management System');
      
        while (true) {
          const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: [
              'Add Student',
              'View Students',
              'View Student Details',
              'Make Payment',
              'Remove Course',
              'Exit',
            ],
          });

     switch (action) {
      case 'Exit':
        console.log('Exiting Student Management System. Goodbye!');
        return;
      case 'Add Student':
        await system.addStudentInteractive();
        break;
      case 'View Students':
        system.viewListOfStudents();
        break;
      case 'View Student Details':
        await system.viewStudentDetailsIntaractive();
        break;
      case 'Make Payment':
        await system.makePaymentInteractive();
        break;
      case 'Remove Course':
        await system.removeCourseInteractive();
        break;
    } 
   }
      
}

main();