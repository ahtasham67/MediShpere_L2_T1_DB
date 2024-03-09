CREATE TABLE Patient (
    PatientID NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    FirstName VARCHAR2(50) NOT NULL,
    LastName VARCHAR2(50) NOT NULL,
    DateOfBirth DATE,
    Gender VARCHAR2(10) CHECK (Gender IN ('Male', 'Female', 'Other')),
    ContactNumber VARCHAR2(15),
    Address VARCHAR2(255),
    EmailAddress VARCHAR2(100) UNIQUE NOT NULL,
    BloodGroup VARCHAR2(5) CHECK (BloodGroup IN ('A+','A-','B+','B-', 'AB+','AB-','O+','O-')),
    password VARCHAR2(100),
		CONSTRAINT patient_pk PRIMARY KEY(PatientID)
);

CREATE TABLE Doctor (
    DoctorID NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    FirstName VARCHAR2(50) NOT NULL,
    LastName VARCHAR2(50) NOT NULL,
    DateOfBirth DATE,
    Gender VARCHAR2(10) CHECK (Gender IN ('Male', 'Female', 'Other')),
    ContactNumber VARCHAR2(15),
    Address VARCHAR2(255),
    EmailAddress VARCHAR2(100) UNIQUE NOT NULL,
    ChamberAddress VARCHAR2(255),
    HospitalName VARCHAR2(100),
    ConsultationFee NUMBER,
    FollowupFee NUMBER,
    password VARCHAR2(100),
		CONSTRAINT doctor_pk PRIMARY KEY(DoctorID)
);

CREATE TABLE DoctorSchedule (
    ScheduleID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DoctorID NUMBER,
    DAY DATE NOT NULL,
    Starttime VARCHAR2(10),
    Endtime VARCHAR2(10),
    capacity NUMBER,
    patient NUMBER,
    Status NUMBER DEFAULT 0 CHECK(Status IN(0,1)),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);

CREATE TABLE Appointment (
    AppointmentID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Status NUMBER CHECK(Status IN(1,0)),
    ScheduleID NUMBER,
    PatientID NUMBER,
    SerialNo NUMBER,
    FOREIGN KEY (ScheduleID) REFERENCES DoctorSchedule(ScheduleID) ON DELETE CASCADE,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE
);

CREATE TABLE Qualification (
    QualificationID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Degree VARCHAR2(100) NOT NULL,
    Institute VARCHAR2(150),
    YearCompleted NUMBER,
    DoctorID NUMBER, 
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);

CREATE TABLE DoctorSpecialty (
    SpecialtyID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    DoctorID NUMBER,
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);

CREATE TABLE DoctorsExperience (
    ExperienceID NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    DoctorID NUMBER,
    HospitalName VARCHAR2(150) NOT NULL,
    Position VARCHAR2(100),
    TimeSpan NUMBER,
    Departments VARCHAR2(255),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID) ON DELETE CASCADE,
		CONSTRAINT experience_pk PRIMARY KEY(ExperienceID)
);

CREATE TABLE HealthRecords (
    RecordID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PatientID NUMBER,
    Weight NUMBER,
    Height NUMBER,
    BloodPressure VARCHAR2(20),
    BMI NUMBER,
    HeartRate NUMBER,
    VaccinationHistory VARCHAR2(255),
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE
);

CREATE TABLE Review (
    ReviewID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Rating NUMBER CHECK (Rating BETWEEN 1 AND 5),
    CommentText VARCHAR2(255),
    AppointmentID NUMBER,
    FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID) ON DELETE CASCADE
);

CREATE TABLE Prescription (
    PrescriptionID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url VARCHAR2(255),
    AppointmentID NUMBER,
    FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID) ON DELETE CASCADE
);
CREATE TABLE DiagnosticCenter (
    DiagnosticCenterID NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    Name VARCHAR2(100) NOT NULL,
    Address VARCHAR2(255) NOT NULL,
    ContactNumber VARCHAR2(15),
    Field VARCHAR2(100),
    OperatingHours VARCHAR2(255),
		CONSTRAINT dc_pk PRIMARY KEY(DiagnosticCenterID)
);
CREATE TABLE suggested_tests (
    test_id NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
    test_name VARCHAR2(255),
    appointmentid NUMBER,
    FOREIGN KEY (appointmentid) REFERENCES appointment(appointmentid) ON DELETE CASCADE
);
CREATE TABLE OfferedTest (
    DiagnosticCenterID NUMBER,
    TestName VARCHAR2(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (DiagnosticCenterID, TestName),
    FOREIGN KEY (DiagnosticCenterID) REFERENCES DiagnosticCenter(DiagnosticCenterID) ON DELETE CASCADE
);
ALTER TABLE DoctorSchedule
MODIFY Status NUMBER DEFAULT 0;
CREATE TABLE DeletedAppointments (
    AppointmentID NUMBER,
    Status NUMBER,
    ScheduleID NUMBER,
    PatientID NUMBER,
    SerialNo NUMBER,
    DeletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE LOGTABLE (
    LOG_ID NUMBER GENERATED ALWAYS AS IDENTITY,
    PROCEDURE_NAME VARCHAR2(255) DEFAULT NULL,
    PROCEDURE_PARAMS VARCHAR2(255) DEFAULT NULL,
    USER_ID NUMBER DEFAULT NULL,
    USER_NAME VARCHAR2(100) DEFAULT NULL,
    CALL_TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT LOGTABLE_PK PRIMARY KEY (LOG_ID)
);
ALTER TABLE DIAGNOSTICCENTER ADD MAP_LINK VARCHAR2(4000);
ALTER TABLE DOCTOR ADD RATING NUMBER DEFAULT 0;
ALTER TABLE REVIEW ADD GIVENDATE DATE;
ALTER TABLE DoctorsExperience MODIFY(TimeSpan VARCHAR2(20));

