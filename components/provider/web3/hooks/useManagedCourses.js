import { normalizeOwnedCourse } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => ( account) => {

    const swrRes = useSWR(() =>
      (web3 && contract && account.data && account.isAdmin) ? `web3/managedCourses/${account.data}` : null,
      async () => {
        const courses = []

        const courseCount = await contract.methods.getCourseCount().call()

        for(let i = Number(courseCount); i >= 0; i--){
          const courseHash = await contract.methods.getCourseHashAtIndex(i).call()
          const course = await contract.methods.getCourseByHash(courseHash).call()

          if(course){
            const normalized = await normalizeOwnedCourse(web3)({hash : courseHash}, course)
            courses.push(normalized)
          }
        }
  
        return courses
      }
    )
  
    return swrRes
  }