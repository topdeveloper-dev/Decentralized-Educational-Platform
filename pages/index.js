import { Hero, Breadcrumbs } from "@components/ui/common"
import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { useWeb3 } from "@components/provider"
import { getAllCourses } from "@content/courses/fetcher"


export default function Home({courses}) {
  
  return (
      <>
            <Hero/>
            
            <CourseList courses = {courses}>
          {
            (course) => <CourseCard course={course} key={course.id}/>
          }
        </CourseList>
      </>
  ) 
}

export function getStaticProps(){
  const {data} = getAllCourses()
  return {
    props : {
      courses : data
    }
   }
}

Home.Layout = BaseLayout