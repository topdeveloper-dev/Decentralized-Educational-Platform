import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3"
import { useWeb3 } from "@components/provider"
import { Button, Loader, Message } from "@components/ui/common"
import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { MarketHeader } from "@components/ui/marketplace"
import { OrderModal } from "@components/ui/order"
import { getAllCourses } from "@content/courses/fetcher"
import { useState } from "react"


export default function Marketplace({courses}) {
    const {web3, contract, requireInstall} = useWeb3()
    const [selectedCourse, setSelectedCourse] = useState(null)
    const {hasConnectedWallet, account, isConnecting } = useWalletInfo()
    const {ownedCourses} = useOwnedCourses(courses,account.data)
    const [isNewPurchase, setIsNewPurchase] = useState(true)

    const purchaseCourse = async(order) =>{
      const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id)
      const orderHash = web3.utils.soliditySha3(
        { type : "bytes16", value : hexCourseId},
        { type : "address", value : account.data}
      )

      const value = web3.utils.toWei(String(order.price))

      if(isNewPurchase){
        const emailHash = web3.utils.sha3(order.email)

      const proof = web3.utils.soliditySha3(
        {type : "bytes32", value : emailHash},
        {type : "bytes32", value : orderHash}
      )
      
        _purchaseCourse(hexCourseId,proof, value)
      }else{
        _repurchaseCourse(orderHash, value)
      }
    }

    const _purchaseCourse = async(hexCourseId, proof, value) => {
      try{
        const result = await contract.methods.purchaseCourse(
          hexCourseId, proof
        ).send({from: account.data, value })
        console.log(result)
      }catch{
        console.log("Error while purchasing course")
      }
    }

    const _repurchaseCourse = async(courseHash, value) =>{
      try{
        const result = await contract.methods.repurchaseCourse(
          courseHash
        ).send({from: account.data, value })
        console.log(result)
      }catch{
        console.log("Error while purchasing course")
      }
    }

  
  return (
    <>
    <MarketHeader />
    <CourseList
      courses={courses}
    >
    {course => {
      const owned = ownedCourses.lookup[course.id]
      return (
        <CourseCard
          key={course.id}
          course={course}
          state={owned?.state}
          disabled={!hasConnectedWallet}
          Footer={() => {
            if (requireInstall) {
              return (
                <Button
                  size="sm"
                  disabled={true}
                  variant="lightPurple">
                  Install
                </Button>
              )
            }

            if (isConnecting) {
              return (
                <Button
                  size="sm"
                  disabled={true}
                  variant="lightPurple">
                  <Loader size="sm" />
                </Button>
              )
            }

            if (!ownedCourses.hasInitialResponse) {
              return (
                <div style={{height: "50px"}}></div>
              )
            }

            if (owned) {
              return (
                <>
                  <div className="flex">
                    <Button 
                      onClick={()=>alert("You are the owner of the course")}
                      size="sm"
                      disabled={true}
                      variant="green">
                      Owned &#10004;
                    </Button>
                    { owned.state === "deactivated" &&
                      <div className="ml-1">
                      <Button
                        size="sm"
                        disabled={false}
                        onClick={() => {
                          setIsNewPurchase(false)
                          setSelectedCourse(course)
                        }}
                        variant="purple">
                        Fund to Activate
                      </Button>
                      </div>
                    }
                  </div>
                </>
              )
            }


            return (
              <Button
                size="sm"
                onClick={() => setSelectedCourse(course)}
                disabled={!hasConnectedWallet}
                variant="lightPurple">
                Purchase
              </Button>
            )}
          }
        />
      )}
    }
    </CourseList>
    { selectedCourse &&
      <OrderModal
        isNewPurchase = {isNewPurchase}
        course={selectedCourse}
        onSubmit={purchaseCourse}
        onClose={() => {
          setSelectedCourse(null)
          setIsNewPurchase(true)
        }}
      />
    }
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

Marketplace.Layout = BaseLayout