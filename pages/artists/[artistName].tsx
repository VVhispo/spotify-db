import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import React, {useState} from 'react'

interface Props{
    artistId: string | null;
}

const Artist: React.FC<Props> = ({artistId}) => {
    return(
        <></>
    )
}

export const getServerSideProps: GetServerSideProps = async({params}) => {
    const artistName: string = params!.artistName as string

    const response = await fetch("http:/localhost:3000/api/getAccessToken")
    const { token } = await response.json()

    const artist = await fetch(`https://api.spotify.com/v1/search?q=artist%3A${artistName!.replace(" ", "%20")}&type=artist`,{
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    });
    let artistId: string | null
    try{ 
        const res = await artist.json()
        
        if(res.artists.items[0].name.length != artistName.length) throw new Error("not found")
        else{
            artistId = res.artists.items[0].id
            return{
                props: {
                    artistId
                }
            }
        }
    }catch(error){
        return{
            notFound: true
        }
    }
}


export default Artist