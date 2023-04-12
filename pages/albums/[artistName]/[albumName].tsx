import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import React, {useState} from 'react'
import styles from "@/styles/album.module.css"

interface Props{
  data: string,
}

const AlbumPage: React.FC<Props> = ({data}) => {
    return(<div className={styles.mainDiv}>
    <h1>{data}</h1>
    </div>)
}

export const getStaticProps:GetStaticProps = async(context) => {
  const {params} = context
  const artistName: string = params!.artistName as string
  const albumName: string = params!.albumName as string

  const res = await fetch("http:/localhost:3000/api/getAccessToken")
  const { token } = await res.json()
  
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