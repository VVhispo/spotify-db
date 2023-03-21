import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import React, {useState} from 'react'

interface Props{
  data: string,
}

const AlbumPage: React.FC<Props> = ({data}) => {
    return(<>
    <h1>{data}</h1>
    </>)
}

export const getStaticProps:GetStaticProps = async(context) => {
  const {params} = context
  console.log(params)
    return {
        props: {
          data: params!.albumName
        },
        revalidate: 10,
      }
}


export const getStaticPaths:GetStaticPaths = async() =>{
    return {
        paths: [
        { params: { artistName:'Placeholder', albumName: 'Placeholder' } },
        ],
    fallback: true
  }
}

export default AlbumPage