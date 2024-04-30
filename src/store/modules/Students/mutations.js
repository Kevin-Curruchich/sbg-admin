// export const myMutations = (state)=>{

// }

export const setStudents = (state, students) => {
  state.students = students;
};

export const setStudentsList = (state, val) => {
  state.studentsList = val;
};

export const setIsLoadingStudents = (state, val) => {
  state.isLoadingStudents = val;
};

export const setStudentById = (state, student) => {
  state.student = student;
};

export const setIsLoadingStudent = (state, val) => {
  state.isLoadingStudent = val;
};

export const setStudentStatuses = (state, val) => {
  state.studentStatuses = val;
};

export const setSudentTypes = (state, val) => {
  state.studentTypes = val;
};

export const setIsLoadingStudentTypes = (state, val) => {
  state.isLoadingStudentTypes = val;
};

export const setStudentYears = (state, val) => {
  state.studentYears = val;
};

export const setStudentByStudentTypeId = (state, val) => {
  state.studentsByStudentTypeId = val;
};

export const setIsLoadingStudentByStudentTypeId = (state, val) => {
  state.isLoadingStudentsByStudentTypeId = val;
};
