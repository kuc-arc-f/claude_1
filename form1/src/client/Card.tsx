import Head from '../components/Head'
import { Button } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
//
function Page() {
  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    <h1 className="text-4xl font-bold"
    >Card</h1>
    <hr className="my-2" />
    <Card>
      <CardBody>
        <span>View a summary of all your customers over the last month.</span>
      </CardBody>
    </Card>
  </div>
  )
}

export default Page;