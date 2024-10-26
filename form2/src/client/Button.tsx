import Head from '../components/Head'
import { Button } from "@chakra-ui/react";
//
function Page() {
  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    <h1 className="text-4xl font-bold"
    >Button</h1>
    <hr className="my-2" />
    <Button colorScheme="teal" variant="solid">
      Click Me
    </Button>
  </div>
  )
}

export default Page;