import courses from "./index.json"

export const getAllCourses = () =>{
    return{
        data : courses,
        cousreMap : courses.reduce((a, c, i)=>{
            a[c.id] = c
            a[c.id] = i
            return a
         },{})
    }
}