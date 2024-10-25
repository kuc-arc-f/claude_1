import Head from '../components/Head'

import { Button } from "@chakra-ui/react";
import { Input } from '@chakra-ui/react'
//
function Page() {
  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    <h1 className="text-4xl font-bold"
    >Input</h1>
    <hr className="my-2" />
    <Input placeholder='extra small size' size='xs' />
    <hr className="my-2" />
    <Input placeholder='small size' size='sm' />
    <hr className="my-2" />
    <Input placeholder='medium size' size='md' />
    <hr className="my-2" />
    <Input placeholder='large size' size='lg' />
    <hr className="my-2" />
  </div>
  )
}

export default Page;