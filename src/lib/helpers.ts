export const isStudent = () => localStorage.getItem('demoday_logged_in') === 'Student'
export const isCompany = () => localStorage.getItem('demoday_logged_in') === 'Company'
export const isAdmin = () => localStorage.getItem('demoday_logged_in') === 'Admin'
